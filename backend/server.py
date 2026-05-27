from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
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
