from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import asyncio
import models
from notify import notify_new_booking

app = FastAPI(title="817 RECORDS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    models.init_db()


# ── Schemas ──────────────────────────────────────────────────────────────────

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


# ── Slots (static for now, can be made dynamic later) ─────────────────────────

@app.get("/slots")
def get_slots(date: str):
    slots = []
    for h in range(10, 22):
        t = f"{h:02d}:00"
        e = f"{h+1:02d}:00"
        slots.append({"id": f"{date}-{t}", "date": date, "start_time": t, "end_time": e, "is_available": True})
    return {"slots": slots}


# ── Bookings ──────────────────────────────────────────────────────────────────

@app.post("/bookings", status_code=201)
def create_booking(data: BookingCreate, db: Session = Depends(models.get_db)):
    booking = models.Booking(**data.model_dump())
    db.add(booking)

    # upsert client
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


# ── Admin ─────────────────────────────────────────────────────────────────────

@app.get("/admin/bookings")
def list_bookings(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(models.get_db),
):
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
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })
    result.sort(key=lambda x: x["total_bookings"], reverse=True)
    return {"clients": result, "total": len(result)}


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
