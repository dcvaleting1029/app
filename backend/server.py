from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, BackgroundTasks
from fastapi.responses import RedirectResponse
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
from datetime import datetime, timedelta, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from email_service import (  # noqa: E402
    send_booking_received,
    send_booking_confirmed,
    send_booking_cancelled,
    send_booking_completed,
)
import google_calendar as gcal  # noqa: E402

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
    recurrence: Optional[str] = "none"  # "none" | "2w" | "4w" | "6w"


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
    recurrence: Optional[str] = "none"
    subscription_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cancel_token: str = Field(default_factory=lambda: secrets.token_urlsafe(20))
    name: str
    email: EmailStr
    phone: str
    address: Optional[str] = ""
    service: str
    vehicle_size: str
    time: str
    extras: Optional[List[str]] = []
    interval_weeks: int  # 2, 4, or 6
    next_date: str  # YYYY-MM-DD of the next scheduled booking date
    active: bool = True
    runs: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    cancelled_at: Optional[datetime] = None


RECURRENCE_TO_WEEKS = {"2w": 2, "4w": 4, "6w": 6}


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
    data = payload.model_dump()
    recurrence = (data.pop("recurrence", "none") or "none").lower()
    booking = Booking(**data, recurrence=recurrence)
    # Create subscription if applicable
    sub = None
    if recurrence in RECURRENCE_TO_WEEKS:
        weeks = RECURRENCE_TO_WEEKS[recurrence]
        try:
            base_date = datetime.strptime(booking.date, "%Y-%m-%d").date()
        except ValueError:
            base_date = datetime.now(timezone.utc).date()
        next_date = (base_date + timedelta(weeks=weeks)).isoformat()
        sub = Subscription(
            name=booking.name,
            email=booking.email,
            phone=booking.phone,
            address=booking.address or "",
            service=booking.service,
            vehicle_size=booking.vehicle_size,
            time=booking.time,
            extras=booking.extras or [],
            interval_weeks=weeks,
            next_date=next_date,
            runs=1,
        )
        booking.subscription_id = sub.id
        sub_doc = sub.model_dump()
        sub_doc["created_at"] = sub_doc["created_at"].isoformat()
        await db.subscriptions.insert_one(sub_doc)

    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    # Background side effects
    background_tasks.add_task(send_booking_received, doc, sub.model_dump() if sub else None)
    background_tasks.add_task(gcal.create_event_for_booking, db, doc)
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
            # Auto-create next recurring booking if part of an active subscription
            background_tasks.add_task(_advance_subscription, doc.get("subscription_id"))
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


# =============================
# Subscriptions
# =============================
async def _advance_subscription(subscription_id: Optional[str]) -> None:
    """Create the next booking in a recurring subscription, if active."""
    if not subscription_id:
        return
    sub = await db.subscriptions.find_one({"id": subscription_id, "active": True})
    if not sub:
        return
    weeks = int(sub.get("interval_weeks", 4))
    next_date_str = sub.get("next_date")
    try:
        next_date = datetime.strptime(next_date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        next_date = datetime.now(timezone.utc).date() + timedelta(weeks=weeks)
    booking = Booking(
        service=sub["service"],
        vehicle_size=sub["vehicle_size"],
        date=next_date.isoformat(),
        time=sub["time"],
        name=sub["name"],
        email=sub["email"],
        phone=sub["phone"],
        address=sub.get("address", "") or "",
        notes=sub.get("notes", "") or "",
        extras=sub.get("extras", []) or [],
        recurrence=f"{weeks}w",
        subscription_id=sub["id"],
    )
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    new_next = (next_date + timedelta(weeks=weeks)).isoformat()
    await db.subscriptions.update_one(
        {"id": subscription_id},
        {"$set": {"next_date": new_next}, "$inc": {"runs": 1}},
    )
    sub_for_email = {k: v for k, v in sub.items() if k != "_id"}
    try:
        await send_booking_received(doc, sub_for_email)
    except Exception as e:
        logger.warning("Subscription advance email failed: %s", e)
    try:
        await gcal.create_event_for_booking(db, doc)
    except Exception as e:
        logger.warning("Subscription advance calendar failed: %s", e)


@api_router.get("/admin/subscriptions")
async def admin_list_subscriptions(_: bool = Depends(require_admin)):
    items = await db.subscriptions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


@api_router.post("/admin/subscriptions/{sub_id}/cancel")
async def admin_cancel_subscription(sub_id: str, _: bool = Depends(require_admin)):
    res = await db.subscriptions.update_one(
        {"id": sub_id},
        {"$set": {"active": False, "cancelled_at": datetime.now(timezone.utc).isoformat()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"ok": True}


@api_router.get("/subscriptions/cancel")
async def public_cancel_subscription(id: str, token: str):
    """Public cancellation link from customer emails."""
    sub = await db.subscriptions.find_one({"id": id})
    if not sub or not secrets.compare_digest(sub.get("cancel_token", ""), token):
        raise HTTPException(status_code=404, detail="Invalid cancellation link")
    if not sub.get("active", True):
        return {"ok": True, "already_cancelled": True}
    await db.subscriptions.update_one(
        {"id": id},
        {"$set": {"active": False, "cancelled_at": datetime.now(timezone.utc).isoformat()}},
    )
    return {"ok": True}




# =============================
# Google Calendar OAuth
# =============================
@api_router.get("/admin/google/status")
async def google_status(_: bool = Depends(require_admin)):
    return {
        "configured": gcal.is_configured(),
        **(await gcal.get_status(db)),
    }


@api_router.get("/admin/google/auth-url")
async def google_auth_url(_: bool = Depends(require_admin)):
    if not gcal.is_configured():
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    return {"url": gcal.build_auth_url()}


@api_router.post("/admin/google/disconnect")
async def google_disconnect(_: bool = Depends(require_admin)):
    await gcal.disconnect(db)
    return {"ok": True}


@api_router.get("/google/oauth-callback")
async def google_oauth_callback(code: Optional[str] = None, error: Optional[str] = None):
    frontend = os.environ.get("FRONTEND_URL", "https://dcvaleting.company")
    if error:
        return RedirectResponse(f"{frontend}/admin?google=error&reason={error}")
    if not code:
        return RedirectResponse(f"{frontend}/admin?google=error&reason=missing_code")
    try:
        tokens = gcal.exchange_code_for_tokens(code)
        email = gcal.fetch_user_email(tokens.get("access_token", ""))
        await gcal.save_tokens(db, tokens, email)
        return RedirectResponse(f"{frontend}/admin?google=connected")
    except Exception as e:
        logger.exception("Google OAuth callback failed: %s", e)
        return RedirectResponse(f"{frontend}/admin?google=error&reason=exchange_failed")


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
