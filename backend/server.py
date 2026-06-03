from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from email_service import (  # noqa: E402
    send_booking_received,
    send_booking_confirmed,
    send_booking_cancelled,
    send_booking_completed,
)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="DC Valeting API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# =============================
# Models
# =============================
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class BookingCreate(BaseModel):
    service: str
    vehicle_size: str
    date: str  # ISO date string (YYYY-MM-DD)
    time: str  # e.g. "10:00"
    name: str
    email: EmailStr
    phone: str
    address: Optional[str] = ""
    notes: Optional[str] = ""
    extras: Optional[List[str]] = []


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service: str
    vehicle_size: str
    date: str
    time: str
    name: str
    email: EmailStr
    phone: str
    address: Optional[str] = ""
    notes: Optional[str] = ""
    extras: Optional[List[str]] = []
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# =============================
# Routes
# =============================
@api_router.get("/")
async def root():
    return {"message": "DC Valeting API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate, background_tasks: BackgroundTasks):
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    # Send emails in background so the response stays fast
    background_tasks.add_task(send_booking_received, doc)
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for b in bookings:
        if isinstance(b.get('created_at'), str):
            try:
                b['created_at'] = datetime.fromisoformat(b['created_at'])
            except Exception:
                b['created_at'] = datetime.now(timezone.utc)
    return bookings


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Booking not found")
    if isinstance(doc.get('created_at'), str):
        try:
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        except Exception:
            doc['created_at'] = datetime.now(timezone.utc)
    return doc


# =============================
# Admin
# =============================
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


class AdminLogin(BaseModel):
    password: str


class StatusUpdate(BaseModel):
    status: str  # pending | confirmed | completed | cancelled


def require_admin(x_admin_password: Optional[str] = Header(default=None)):
    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=500, detail="Admin password not configured")
    if not x_admin_password or not secrets.compare_digest(x_admin_password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=500, detail="Admin password not configured")
    if not secrets.compare_digest(payload.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"ok": True}


@api_router.get("/admin/bookings", response_model=List[Booking])
async def admin_list_bookings(_: bool = Depends(require_admin)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for b in bookings:
        if isinstance(b.get('created_at'), str):
            try:
                b['created_at'] = datetime.fromisoformat(b['created_at'])
            except Exception:
                b['created_at'] = datetime.now(timezone.utc)
    return bookings


@api_router.patch("/admin/bookings/{booking_id}", response_model=Booking)
async def admin_update_booking_status(
    booking_id: str,
    payload: StatusUpdate,
    background_tasks: BackgroundTasks,
    _: bool = Depends(require_admin),
):
    allowed = {"pending", "confirmed", "completed", "cancelled"}
    if payload.status not in allowed:
        raise HTTPException(status_code=400, detail="Invalid status")
    # fetch previous to detect transition
    prev = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not prev:
        raise HTTPException(status_code=404, detail="Booking not found")
    await db.bookings.update_one(
        {"id": booking_id}, {"$set": {"status": payload.status}}
    )
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    prev_status = prev.get("status") or "pending"
    # Fire transactional emails only on real status transitions
    if payload.status != prev_status:
        if payload.status == "confirmed":
            background_tasks.add_task(send_booking_confirmed, doc)
        elif payload.status == "cancelled":
            background_tasks.add_task(send_booking_cancelled, doc)
        elif payload.status == "completed":
            background_tasks.add_task(send_booking_completed, doc)
    if isinstance(doc.get('created_at'), str):
        try:
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        except Exception:
            doc['created_at'] = datetime.now(timezone.utc)
    return doc


@api_router.delete("/admin/bookings/{booking_id}")
async def admin_delete_booking(booking_id: str, _: bool = Depends(require_admin)):
    res = await db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@api_router.get("/admin/stats")
async def admin_stats(_: bool = Depends(require_admin)):
    pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
    by_status = {}
    async for row in db.bookings.aggregate(pipeline):
        by_status[row["_id"] or "pending"] = row["count"]
    total = await db.bookings.count_documents({})
    return {"total": total, "by_status": by_status}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
