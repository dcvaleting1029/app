"""Email service for DC Valeting transactional emails via Resend."""
import os
import asyncio
import logging
from typing import Optional

import resend

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "DC Valeting <onboarding@resend.dev>")
BUSINESS_EMAIL = os.environ.get("BUSINESS_EMAIL", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://dcvaleting.company")
BACKEND_URL = os.environ.get("BACKEND_URL", "https://dc-valeting.onrender.com")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


BRAND_BLACK = "#050505"
BRAND_BORDER = "#1a1a1a"
BRAND_SILVER = "#c8c8cc"
BRAND_MUTED = "#888888"


def _layout(title: str, intro: str, booking: dict, footer_note: str = "", subscription: Optional[dict] = None) -> str:
    rows = [
        ("Service", booking.get("service", "—")),
        ("Vehicle", booking.get("vehicle_size", "—")),
        ("Date", booking.get("date", "—")),
        ("Time", booking.get("time", "—")),
    ]
    extras = booking.get("extras") or []
    if extras:
        rows.append(("Extras", ", ".join(extras)))
    if booking.get("address"):
        rows.append(("Address", booking["address"]))
    if booking.get("notes"):
        rows.append(("Notes", booking["notes"]))
    if booking.get("phone"):
        rows.append(("Phone", booking["phone"]))
    if subscription:
        weeks = subscription.get("interval_weeks")
        if weeks:
            rows.append(("Recurring", f"Every {weeks} weeks"))

    detail_rows = "".join(
        f"""
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid {BRAND_BORDER};color:{BRAND_MUTED};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;width:40%;">{k}</td>
            <td style="padding:10px 0;border-bottom:1px solid {BRAND_BORDER};color:#ffffff;font-size:15px;text-align:right;">{v}</td>
        </tr>
        """
        for k, v in rows
    )

    sub_block = ""
    if subscription and subscription.get("id") and subscription.get("cancel_token"):
        cancel_url = (
            f"{BACKEND_URL}/api/subscriptions/cancel"
            f"?id={subscription['id']}&token={subscription['cancel_token']}"
        )
        sub_block = f"""
        <tr>
            <td style="padding:18px 36px 0 36px;">
                <div style="padding:14px 16px;border:1px solid {BRAND_BORDER};border-radius:12px;background:#0c0c0c;">
                    <div style="font-size:11px;letter-spacing:0.22em;color:{BRAND_MUTED};text-transform:uppercase;">Recurring subscription</div>
                    <div style="color:#ffffff;font-size:14px;margin-top:6px;line-height:1.5;">
                        Your next valet is booked automatically every {subscription.get('interval_weeks')} weeks. Cancel anytime —
                        <a href="{cancel_url}" style="color:#ffffff;text-decoration:underline;">click here to stop</a>.
                    </div>
                </div>
            </td>
        </tr>
        """

    return f"""
<!doctype html>
<html>
<body style="margin:0;padding:0;background:{BRAND_BLACK};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#ffffff;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:{BRAND_BLACK};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;width:100%;background:#0a0a0a;border:1px solid {BRAND_BORDER};border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:32px 36px 0 36px;text-align:center;">
              <div style="font-size:11px;letter-spacing:0.32em;color:{BRAND_MUTED};text-transform:uppercase;">DC Valeting</div>
              <div style="height:1px;background:linear-gradient(90deg,transparent,#333,transparent);margin:20px 0;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 8px 36px;">
              <h1 style="margin:0;font-size:30px;line-height:1.1;letter-spacing:0.02em;color:#ffffff;text-transform:uppercase;font-weight:800;">{title}</h1>
              <p style="margin:14px 0 0 0;color:#bbbbbb;font-size:15px;line-height:1.55;">{intro}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 8px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid {BRAND_BORDER};">
                {detail_rows}
              </table>
            </td>
          </tr>
          {f'<tr><td style="padding:8px 36px 0 36px;color:{BRAND_MUTED};font-size:13px;line-height:1.5;">{footer_note}</td></tr>' if footer_note else ''}
          <tr>
            <td style="padding:28px 36px 36px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-top:24px;border-top:1px solid {BRAND_BORDER};color:{BRAND_MUTED};font-size:12px;line-height:1.6;">
                    <strong style="color:#ffffff;">DC Valeting</strong> · Edinburgh & Surrounding Areas<br>
                    07983 668 046 · dcvaleting17@gmail.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div style="margin-top:18px;color:#555;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">© 2025 DC Valeting · All rights reserved</div>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def _booking_received_html(booking: dict, subscription: Optional[dict] = None) -> str:
    return _layout(
        title="Booking received",
        intro=f"Hi {booking.get('name', 'there')}, thanks for booking with DC Valeting. We've received your request and will be in touch shortly to confirm.",
        booking=booking,
        footer_note="You don't need to do anything — we'll confirm by phone or email before your appointment.",
        subscription=subscription,
    )


def _booking_confirmed_html(booking: dict) -> str:
    return _layout(
        title="Booking confirmed",
        intro=f"Hi {booking.get('name', 'there')}, your DC Valeting appointment is now confirmed. We're looking forward to seeing your vehicle.",
        booking=booking,
        footer_note="Need to reschedule? Just reply to this email or give us a call.",
    )


def _booking_cancelled_html(booking: dict) -> str:
    return _layout(
        title="Booking cancelled",
        intro=f"Hi {booking.get('name', 'there')}, your DC Valeting booking has been cancelled. If this was a mistake or you'd like to rebook, just reply to this email or give us a call — we'd love to take care of your vehicle.",
        booking=booking,
        footer_note="Hope to see you again soon.",
    )


def _booking_completed_html(booking: dict) -> str:
    return _layout(
        title="Thank you",
        intro=f"Hi {booking.get('name', 'there')}, thanks for choosing DC Valeting. Your appointment is now complete and we hope you're delighted with the finish. If you have a moment, we'd love a quick review — it really helps small detailing businesses like ours.",
        booking=booking,
        footer_note="Leave us a review on Google: https://g.page/r/CQR0OZkK3r4AEAE/review · Thanks again from the DC Valeting team.",
    )


def _business_new_booking_html(booking: dict, subscription: Optional[dict] = None) -> str:
    extra = ""
    if subscription:
        extra = f" This booking starts a recurring subscription every {subscription.get('interval_weeks')} weeks."
    return _layout(
        title="New booking received",
        intro=f"A new booking has been submitted by {booking.get('name', '—')} ({booking.get('email', '—')}).{extra}",
        booking=booking,
        footer_note="Log in to the admin dashboard to confirm or manage this booking.",
        subscription=subscription,
    )


def _send(to: list, subject: str, html: str) -> Optional[str]:
    """Sync send (run from a thread)."""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — skipping email")
        return None
    try:
        result = resend.Emails.send(
            {
                "from": SENDER_EMAIL,
                "to": to,
                "subject": subject,
                "html": html,
            }
        )
        return result.get("id") if isinstance(result, dict) else None
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, e)
        return None


async def send_booking_received(booking: dict, subscription: Optional[dict] = None) -> None:
    """Customer email + business notification when booking is created."""
    customer_email = booking.get("email")
    tasks = []
    if customer_email:
        tasks.append(
            asyncio.to_thread(
                _send,
                [customer_email],
                "We've received your DC Valeting booking",
                _booking_received_html(booking, subscription),
            )
        )
    if BUSINESS_EMAIL:
        tasks.append(
            asyncio.to_thread(
                _send,
                [BUSINESS_EMAIL],
                f"New booking — {booking.get('name', '—')} · {booking.get('service', '—')}",
                _business_new_booking_html(booking, subscription),
            )
        )
    if tasks:
        await asyncio.gather(*tasks, return_exceptions=True)


async def send_booking_confirmed(booking: dict) -> None:
    """Customer email when admin marks booking as confirmed."""
    customer_email = booking.get("email")
    if not customer_email:
        return
    await asyncio.to_thread(
        _send,
        [customer_email],
        "Your DC Valeting appointment is confirmed",
        _booking_confirmed_html(booking),
    )


async def send_booking_cancelled(booking: dict) -> None:
    """Customer email when booking is cancelled."""
    customer_email = booking.get("email")
    if not customer_email:
        return
    await asyncio.to_thread(
        _send,
        [customer_email],
        "Your DC Valeting booking has been cancelled",
        _booking_cancelled_html(booking),
    )


async def send_booking_completed(booking: dict) -> None:
    """Customer email when booking is marked completed (thank-you + review request)."""
    customer_email = booking.get("email")
    if not customer_email:
        return
    await asyncio.to_thread(
        _send,
        [customer_email],
        "Thanks for choosing DC Valeting",
        _booking_completed_html(booking),
    )
