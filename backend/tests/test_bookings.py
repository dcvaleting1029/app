"""Backend tests for DC Valeting API - bookings endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')
if not BASE_URL:
    # Read from /app/frontend/.env if env var not set
    env_path = '/app/frontend/.env'
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.strip().split('=', 1)[1]
                    break
BASE_URL = BASE_URL.rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Root endpoint ---
class TestRoot:
    def test_root_message(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "DC Valeting" in data["message"]


# --- Bookings create + persistence ---
class TestBookings:
    payload = {
        "service": "Full Valet",
        "vehicle_size": "Small / Medium",
        "date": "2026-02-15",
        "time": "10:00",
        "name": "TEST_John Smith",
        "email": "test_john@example.com",
        "phone": "07123456789",
        "address": "Edinburgh",
        "notes": "Test booking"
    }

    def test_create_booking(self, session):
        r = session.post(f"{API}/bookings", json=self.payload)
        assert r.status_code == 200, f"got {r.status_code}: {r.text}"
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "created_at" in data
        assert data["service"] == self.payload["service"]
        assert data["vehicle_size"] == self.payload["vehicle_size"]
        assert data["email"] == self.payload["email"]
        assert data["status"] == "pending"
        # store id for next test
        TestBookings.created_id = data["id"]

    def test_get_booking_by_id(self, session):
        bid = getattr(TestBookings, "created_id", None)
        assert bid, "booking id missing from prior test"
        r = session.get(f"{API}/bookings/{bid}")
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == bid
        assert data["name"] == self.payload["name"]
        assert data["email"] == self.payload["email"]

    def test_get_booking_not_found(self, session):
        r = session.get(f"{API}/bookings/nonexistent-id-xyz")
        assert r.status_code == 404

    def test_list_bookings_contains_created(self, session):
        r = session.get(f"{API}/bookings")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        ids = [b["id"] for b in data]
        assert TestBookings.created_id in ids

    def test_create_booking_invalid_email(self, session):
        bad = dict(self.payload)
        bad["email"] = "not-an-email"
        r = session.post(f"{API}/bookings", json=bad)
        assert r.status_code == 422

    def test_create_booking_missing_field(self, session):
        bad = dict(self.payload)
        del bad["service"]
        r = session.post(f"{API}/bookings", json=bad)
        assert r.status_code == 422
