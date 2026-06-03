"""Backend tests for DC Valeting admin endpoints."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')
if not BASE_URL:
    env_path = '/app/frontend/.env'
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.strip().split('=', 1)[1]
                    break
BASE_URL = BASE_URL.rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "dcvaleting2025"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    s.headers.update({
        "Content-Type": "application/json",
        "X-Admin-Password": ADMIN_PASSWORD,
    })
    return s


# --- Admin login ---
class TestAdminAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/admin/login", json={"password": "wrong"})
        assert r.status_code == 401

    def test_admin_bookings_requires_password(self, session):
        r = session.get(f"{API}/admin/bookings")
        assert r.status_code == 401

    def test_admin_bookings_wrong_password(self, session):
        r = session.get(
            f"{API}/admin/bookings",
            headers={"X-Admin-Password": "wrong"},
        )
        assert r.status_code == 401


# --- Admin booking listing + status update + delete ---
class TestAdminBookings:
    unique_email = None
    unique_name = None
    booking_id = None

    def test_create_booking_via_public_api(self, session):
        ts = int(time.time())
        TestAdminBookings.unique_email = f"test_admin_{ts}@example.com"
        TestAdminBookings.unique_name = f"TEST_Admin_{ts}"
        payload = {
            "service": "Deep Clean",
            "vehicle_size": "SUV / Large",
            "date": "2026-03-10",
            "time": "12:00",
            "name": TestAdminBookings.unique_name,
            "email": TestAdminBookings.unique_email,
            "phone": "07900900900",
            "address": "Test Address",
            "notes": "Admin flow test",
        }
        r = session.post(f"{API}/bookings", json=payload)
        assert r.status_code == 200, r.text
        TestAdminBookings.booking_id = r.json()["id"]
        assert r.json()["status"] == "pending"

    def test_admin_list_contains_new_booking(self, admin_session):
        r = admin_session.get(f"{API}/admin/bookings")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        matched = [b for b in items if b["id"] == TestAdminBookings.booking_id]
        assert len(matched) == 1
        b = matched[0]
        assert b["email"] == TestAdminBookings.unique_email
        assert b["service"] == "Deep Clean"
        assert b["vehicle_size"] == "SUV / Large"
        assert b["status"] == "pending"

    def test_admin_update_status_confirmed(self, admin_session):
        bid = TestAdminBookings.booking_id
        r = admin_session.patch(
            f"{API}/admin/bookings/{bid}", json={"status": "confirmed"}
        )
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "confirmed"
        # Verify persistence
        r2 = admin_session.get(f"{API}/admin/bookings")
        b = [x for x in r2.json() if x["id"] == bid][0]
        assert b["status"] == "confirmed"

    def test_admin_update_status_invalid(self, admin_session):
        bid = TestAdminBookings.booking_id
        r = admin_session.patch(
            f"{API}/admin/bookings/{bid}", json={"status": "bogus"}
        )
        assert r.status_code == 400

    def test_admin_update_nonexistent(self, admin_session):
        r = admin_session.patch(
            f"{API}/admin/bookings/does-not-exist",
            json={"status": "confirmed"},
        )
        assert r.status_code == 404

    def test_admin_stats(self, admin_session):
        r = admin_session.get(f"{API}/admin/stats")
        assert r.status_code == 200
        data = r.json()
        assert "total" in data and isinstance(data["total"], int)
        assert "by_status" in data

    def test_admin_delete_booking(self, admin_session):
        bid = TestAdminBookings.booking_id
        r = admin_session.delete(f"{API}/admin/bookings/{bid}")
        assert r.status_code == 200
        # GET by id should now 404
        r2 = requests.get(f"{API}/bookings/{bid}")
        assert r2.status_code == 404

    def test_admin_delete_nonexistent(self, admin_session):
        r = admin_session.delete(f"{API}/admin/bookings/no-such-id")
        assert r.status_code == 404
