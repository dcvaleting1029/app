"""Google Calendar integration for DC Valeting bookings.

OAuth 2.0 flow (web app) — owner signs in once via admin dashboard, refresh
token persisted to MongoDB. Booking creation triggers a fire-and-forget event
create on the connected calendar.
"""
from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import requests
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from googleapiclient.discovery import build

logger = logging.getLogger(__name__)

CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
REDIRECT_URI = os.environ.get(
    "GOOGLE_REDIRECT_URI",
    "https://dc-valeting.onrender.com/api/google/oauth-callback",
)
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://dcvaleting.company")

SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
]

# Single-owner business — one token row only
TOKEN_DOC_ID = "google_calendar_owner"


def is_configured() -> bool:
    return bool(CLIENT_ID and CLIENT_SECRET)


def build_auth_url() -> str:
    """Construct Google OAuth consent URL."""
    from urllib.parse import urlencode

    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
        "include_granted_scopes": "true",
    }
    return "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)


def exchange_code_for_tokens(code: str) -> dict:
    """Exchange authorization code for access + refresh tokens."""
    resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_user_email(access_token: str) -> Optional[str]:
    try:
        r = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        if r.ok:
            return r.json().get("email")
    except Exception as e:
        logger.warning("Could not fetch userinfo: %s", e)
    return None


async def save_tokens(db, tokens: dict, email: Optional[str]) -> None:
    payload = {
        "access_token": tokens.get("access_token"),
        "refresh_token": tokens.get("refresh_token"),
        "expires_in": tokens.get("expires_in"),
        "token_type": tokens.get("token_type", "Bearer"),
        "scope": tokens.get("scope"),
        "email": email,
        "connected_at": datetime.now(timezone.utc).isoformat(),
    }
    # Preserve existing refresh_token if Google didn't return a new one
    if not payload["refresh_token"]:
        existing = await db.oauth_tokens.find_one({"_id": TOKEN_DOC_ID})
        if existing and existing.get("refresh_token"):
            payload["refresh_token"] = existing["refresh_token"]
    await db.oauth_tokens.update_one(
        {"_id": TOKEN_DOC_ID},
        {"$set": payload},
        upsert=True,
    )


async def get_status(db) -> dict:
    doc = await db.oauth_tokens.find_one({"_id": TOKEN_DOC_ID})
    if not doc or not doc.get("refresh_token"):
        return {"connected": False}
    return {
        "connected": True,
        "email": doc.get("email"),
        "connected_at": doc.get("connected_at"),
    }


async def disconnect(db) -> None:
    await db.oauth_tokens.delete_one({"_id": TOKEN_DOC_ID})


async def _get_credentials(db) -> Optional[Credentials]:
    doc = await db.oauth_tokens.find_one({"_id": TOKEN_DOC_ID})
    if not doc or not doc.get("refresh_token"):
        return None
    creds = Credentials(
        token=doc.get("access_token"),
        refresh_token=doc.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=SCOPES,
    )
    if not creds.valid:
        try:
            await asyncio.to_thread(creds.refresh, GoogleRequest())
            await db.oauth_tokens.update_one(
                {"_id": TOKEN_DOC_ID},
                {"$set": {"access_token": creds.token}},
            )
        except Exception as e:
            logger.error("Failed to refresh Google token: %s", e)
            return None
    return creds


def _build_event(booking: dict) -> dict:
    """Build a Google Calendar event body from a booking dict."""
    # Parse start: date 'YYYY-MM-DD' + time 'HH:MM' as UK local time
    date_str = booking.get("date", "")
    time_str = booking.get("time", "00:00")
    try:
        start_naive = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    except ValueError:
        start_naive = datetime.now()

    end_naive = start_naive + timedelta(hours=2)

    desc_lines = [
        f"Customer: {booking.get('name', '—')}",
        f"Phone: {booking.get('phone', '—')}",
        f"Email: {booking.get('email', '—')}",
        f"Vehicle: {booking.get('vehicle_size', '—')}",
    ]
    extras = booking.get("extras") or []
    if extras:
        desc_lines.append(f"Extras: {', '.join(extras)}")
    if booking.get("address"):
        desc_lines.append(f"Address: {booking['address']}")
    if booking.get("notes"):
        desc_lines.append(f"Notes: {booking['notes']}")
    desc_lines.append("")
    desc_lines.append(f"Booking ID: {booking.get('id', '—')}")

    return {
        "summary": f"DC Valeting — {booking.get('name', 'Booking')} ({booking.get('service', 'Service')})",
        "description": "\n".join(desc_lines),
        "location": booking.get("address") or "Edinburgh & Surrounding Areas",
        "start": {
            "dateTime": start_naive.isoformat(),
            "timeZone": "Europe/London",
        },
        "end": {
            "dateTime": end_naive.isoformat(),
            "timeZone": "Europe/London",
        },
        "reminders": {
            "useDefault": False,
            "overrides": [
                {"method": "popup", "minutes": 60},
                {"method": "email", "minutes": 24 * 60},
            ],
        },
    }


async def create_event_for_booking(db, booking: dict) -> Optional[str]:
    """Fire-and-forget: create a Google Calendar event for this booking.

    Returns the event id on success, None on failure (errors are logged).
    """
    if not is_configured():
        return None
    creds = await _get_credentials(db)
    if creds is None:
        logger.info("Google Calendar not connected — skipping event create")
        return None

    def _insert() -> Optional[str]:
        try:
            service = build("calendar", "v3", credentials=creds, cache_discovery=False)
            event = (
                service.events()
                .insert(calendarId="primary", body=_build_event(booking))
                .execute()
            )
            return event.get("id")
        except Exception as e:
            logger.error("Failed to create calendar event: %s", e)
            return None

    event_id = await asyncio.to_thread(_insert)
    if event_id:
        # Track on the booking record
        try:
            await db.bookings.update_one(
                {"id": booking.get("id")},
                {"$set": {"google_event_id": event_id}},
            )
        except Exception:
            pass
    return event_id
