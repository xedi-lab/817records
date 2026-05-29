from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta, date as date_type
import asyncio, io
import models
from notify import notify_new_booking

app = FastAPI(title="817 RECORDS API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def startup():
    models.init_db()


# ── Schemas ─────────────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    telegram_id: int
    full_name: str
    username: Optional[str] = None
    phone: Optional[str] = None
    date: str
    start_time: str
    end_time: str
    hours: int
    comment: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str

class VisitData(BaseModel):
    telegram_id: int
    first_name: str
    username: Optional[str] = None

class SlotWindowCreate(BaseModel):
    date: str
    start_time: str
    end_time: str

class BroadcastData(BaseModel):
    message: str


# ── Visit tracking ───────────────────────────────────────────────────────────

@app.post("/users/visit")
def track_visit(data: VisitData, db: Session = Depends(models.get_db)):
    client = db.get(models.Client, data.telegram_id)
    now = datetime.utcnow()
    if client:
        client.app_opens = (client.app_opens or 0) + 1
        client.last_seen = now
        if data.username:
            client.username = data.username
        client.full_name = data.first_name
    else:
        db.add(models.Client(
            telegram_id=data.telegram_id,
            username=data.username,
            full_name=data.first_name,
            app_opens=1,
            last_seen=now,
        ))
    db.commit()
    return {"ok": True}


# ── Slots ────────────────────────────────────────────────────────────────────

@app.get("/slots")
def get_slots(date: str, db: Session = Depends(models.get_db)):
    windows = db.query(models.SlotWindow).filter(models.SlotWindow.date == date).all()

    # Get already-booked times for conflict detection
    booked = db.query(models.Booking).filter(
        models.Booking.date == date,
        models.Booking.status.in_(["pending", "confirmed"]),
    ).all()
    booked_ranges = [(b.start_time, b.end_time) for b in booked]

    def is_free(h_start: int, h_end: int) -> bool:
        t_start = f"{h_start:02d}:00"
        for bs, be in booked_ranges:
            bs_h, be_h = int(bs[:2]), int(be[:2])
            if h_start < be_h and h_end > bs_h:
                return False
        return True

    slots = []
    if windows:
        for w in windows:
            sh, eh = int(w.start_time[:2]), int(w.end_time[:2])
            for h in range(sh, eh):
                slots.append({
                    "id": f"{date}-{h:02d}:00",
                    "date": date,
                    "start_time": f"{h:02d}:00",
                    "end_time": f"{h+1:02d}:00",
                    "is_available": is_free(h, h + 1),
                })
    else:
        for h in range(10, 22):
            slots.append({
                "id": f"{date}-{h:02d}:00",
                "date": date,
                "start_time": f"{h:02d}:00",
                "end_time": f"{h+1:02d}:00",
                "is_available": is_free(h, h + 1),
            })
    return {"slots": slots}


# ── Bookings ─────────────────────────────────────────────────────────────────

@app.post("/bookings", status_code=201)
async def create_booking(data: BookingCreate, db: Session = Depends(models.get_db)):
    booking = models.Booking(**data.model_dump())
    db.add(booking)
    client = db.get(models.Client, data.telegram_id)
    if client:
        client.full_name = data.full_name
        client.username = data.username
        if data.phone:
            client.phone = data.phone
    else:
        db.add(models.Client(
            telegram_id=data.telegram_id,
            username=data.username,
            full_name=data.full_name,
            phone=data.phone,
        ))
    db.commit()
    db.refresh(booking)
    asyncio.create_task(notify_new_booking(booking))
    return booking


# ── Admin: Bookings ──────────────────────────────────────────────────────────

@app.get("/admin/bookings")
def list_bookings(status: Optional[str] = None, limit: int = 50, offset: int = 0,
                  db: Session = Depends(models.get_db)):
    q = db.query(models.Booking)
    if status:
        q = q.filter(models.Booking.status == status)
    total = q.count()
    bookings = q.order_by(models.Booking.created_at.desc()).offset(offset).limit(limit).all()
    return {"bookings": bookings, "total": total}

@app.patch("/admin/bookings/{booking_id}/status")
def update_status(booking_id: int, body: StatusUpdate, db: Session = Depends(models.get_db)):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(404, "Not found")
    if body.status not in ("pending", "confirmed", "cancelled", "completed"):
        raise HTTPException(400, "Invalid status")
    booking.status = body.status
    db.commit()
    db.refresh(booking)
    return booking


# ── Admin: Slot Windows ──────────────────────────────────────────────────────

@app.get("/admin/slot-windows")
def get_slot_windows(db: Session = Depends(models.get_db)):
    today = date_type.today().isoformat()
    end = (date_type.today() + timedelta(days=13)).isoformat()
    windows = db.query(models.SlotWindow).filter(
        models.SlotWindow.date >= today,
        models.SlotWindow.date <= end,
    ).order_by(models.SlotWindow.date, models.SlotWindow.start_time).all()
    return {"windows": windows}

@app.post("/admin/slot-windows", status_code=201)
def create_slot_window(data: SlotWindowCreate, db: Session = Depends(models.get_db)):
    w = models.SlotWindow(**data.model_dump())
    db.add(w)
    db.commit()
    db.refresh(w)
    return w

@app.delete("/admin/slot-windows/{window_id}", status_code=204)
def delete_slot_window(window_id: int, db: Session = Depends(models.get_db)):
    w = db.get(models.SlotWindow, window_id)
    if not w:
        raise HTTPException(404, "Not found")
    db.delete(w)
    db.commit()


# ── Admin: Clients ───────────────────────────────────────────────────────────

@app.get("/admin/clients")
def list_clients(db: Session = Depends(models.get_db)):
    clients_raw = db.query(models.Client).all()
    result = []
    for c in clients_raw:
        bq = db.query(models.Booking).filter(
            models.Booking.telegram_id == c.telegram_id,
            models.Booking.status != "cancelled",
        )
        total_bookings = bq.count()
        total_hours = sum(b.hours for b in bq.all())
        last = db.query(models.Booking.date).filter(
            models.Booking.telegram_id == c.telegram_id,
        ).order_by(models.Booking.date.desc()).first()
        result.append({
            "telegram_id": c.telegram_id,
            "username": c.username,
            "full_name": c.full_name,
            "phone": c.phone,
            "total_bookings": total_bookings,
            "total_hours": total_hours,
            "last_visit": last[0] if last else None,
            "app_opens": c.app_opens or 0,
            "last_seen": c.last_seen.isoformat() if c.last_seen else None,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })
    result.sort(key=lambda x: x["total_bookings"], reverse=True)
    return {"clients": result, "total": len(result)}


# ── Admin: Stats ─────────────────────────────────────────────────────────────

@app.get("/admin/stats")
def get_stats(db: Session = Depends(models.get_db)):
    now = datetime.utcnow()
    month_str = f"{now.year}-{now.month:02d}"
    total_bookings = db.query(models.Booking).count()
    pending = db.query(models.Booking).filter(models.Booking.status == "pending").count()
    confirmed = db.query(models.Booking).filter(models.Booking.status == "confirmed").count()
    total_clients = db.query(models.Client).count()
    month_bookings = db.query(models.Booking).filter(
        models.Booking.date.startswith(month_str),
        models.Booking.status != "cancelled",
    ).all()
    hours_this_month = sum(b.hours for b in month_bookings)
    return {
        "total_bookings": total_bookings,
        "pending": pending,
        "confirmed": confirmed,
        "total_clients": total_clients,
        "hours_this_month": hours_this_month,
    }


# ── Admin: Analytics ─────────────────────────────────────────────────────────

@app.get("/admin/analytics")
def get_analytics(period: str = "week", db: Session = Depends(models.get_db)):
    today = date_type.today()
    if period == "today":
        from_date = today
    elif period == "week":
        from_date = today - timedelta(days=6)
    else:  # month
        from_date = today - timedelta(days=29)

    bookings = db.query(models.Booking).filter(
        models.Booking.date >= from_date.isoformat(),
        models.Booking.date <= today.isoformat(),
    ).all()

    by_date: dict = {}
    for b in bookings:
        if b.date not in by_date:
            by_date[b.date] = {"date": b.date, "count": 0, "hours": 0, "confirmed": 0}
        by_date[b.date]["count"] += 1
        by_date[b.date]["hours"] += b.hours
        if b.status == "confirmed":
            by_date[b.date]["confirmed"] += 1

    total_hours = sum(b.hours for b in bookings if b.status != "cancelled")
    confirmed_count = sum(1 for b in bookings if b.status == "confirmed")
    cancelled_count = sum(1 for b in bookings if b.status == "cancelled")

    return {
        "period": period,
        "total": len(bookings),
        "confirmed": confirmed_count,
        "cancelled": cancelled_count,
        "total_hours": total_hours,
        "by_date": sorted(by_date.values(), key=lambda x: x["date"]),
    }


# ── Admin: Broadcast ─────────────────────────────────────────────────────────

@app.post("/admin/broadcast")
async def broadcast(data: BroadcastData, db: Session = Depends(models.get_db)):
    import os, httpx
    token = os.getenv("BOT_TOKEN", "")
    if not token:
        raise HTTPException(500, "Bot token not configured")

    clients = db.query(models.Client).all()
    sent, failed = 0, 0
    async with httpx.AsyncClient() as client:
        for c in clients:
            try:
                r = await client.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={"chat_id": c.telegram_id, "text": data.message},
                    timeout=5,
                )
                if r.json().get("ok"):
                    sent += 1
                else:
                    failed += 1
            except Exception:
                failed += 1
    return {"sent": sent, "failed": failed, "total": len(clients)}


# ── Admin: Export ─────────────────────────────────────────────────────────────

@app.get("/admin/export")
def export_bookings(db: Session = Depends(models.get_db)):
    try:
        import openpyxl
        bookings = db.query(models.Booking).order_by(models.Booking.date.desc()).all()
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Брони"
        ws.append(["ID", "Имя", "Telegram", "Телефон", "Дата", "Начало", "Конец", "Часов", "Статус", "Комментарий", "Создана"])
        for b in bookings:
            ws.append([b.id, b.full_name, f"@{b.username}" if b.username else "", b.phone or "",
                       b.date, b.start_time, b.end_time, b.hours, b.status, b.comment or "",
                       b.created_at.strftime("%Y-%m-%d %H:%M") if b.created_at else ""])
        buf = io.BytesIO()
        wb.save(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                  headers={"Content-Disposition": "attachment; filename=817records-bookings.xlsx"})
    except ImportError:
        # Fallback: CSV
        bookings = db.query(models.Booking).order_by(models.Booking.date.desc()).all()
        lines = ["ID,Имя,Telegram,Телефон,Дата,Начало,Конец,Часов,Статус,Комментарий"]
        for b in bookings:
            lines.append(f'{b.id},"{b.full_name}",@{b.username or ""},"{b.phone or ""}",{b.date},{b.start_time},{b.end_time},{b.hours},{b.status},"{b.comment or ""}"')
        return StreamingResponse(io.StringIO("\n".join(lines)), media_type="text/csv",
                                  headers={"Content-Disposition": "attachment; filename=817records-bookings.csv"})
