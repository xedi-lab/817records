import os
import httpx

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID", "")  # твой telegram id или id группы

async def notify_new_booking(booking) -> None:
    if not BOT_TOKEN or not ADMIN_CHAT_ID:
        return
    text = (
        f"🎙 <b>Новая заявка #{booking.id}</b>\n\n"
        f"👤 {booking.full_name}"
        + (f" (@{booking.username})" if booking.username else "")
        + f"\n📅 {booking.date}\n"
        f"⏰ {booking.start_time} — {booking.end_time} ({booking.hours}ч)\n"
        + (f"\n💬 {booking.comment}" if booking.comment else "")
    )
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                json={"chat_id": ADMIN_CHAT_ID, "text": text, "parse_mode": "HTML"},
                timeout=5,
            )
    except Exception:
        pass
