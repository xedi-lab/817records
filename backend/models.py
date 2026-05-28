from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, func
from sqlalchemy.orm import DeclarativeBase, Session
from datetime import datetime

engine = create_engine("sqlite:///./817records.db", connect_args={"check_same_thread": False})

class Base(DeclarativeBase):
    pass

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer, index=True)
    username = Column(String, nullable=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    date = Column(String, nullable=False)       # YYYY-MM-DD
    start_time = Column(String, nullable=False)  # HH:MM
    end_time = Column(String, nullable=False)
    hours = Column(Integer, nullable=False)
    total_price = Column(Integer, nullable=True)
    status = Column(String, default="pending")   # pending | confirmed | cancelled | completed
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Client(Base):
    __tablename__ = "clients"

    telegram_id = Column(Integer, primary_key=True)
    username = Column(String, nullable=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()
