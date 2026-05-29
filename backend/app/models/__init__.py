import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, JSON
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Employee")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Device(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    device_type = Column(String, nullable=False)
    status = Column(String, default="Online")
    risk = Column(Integer, default=0)
    last_activity = Column(String, default="Just now")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # TODO: endpoint telemetry ingestion
    # Future-proof structure for logs and metrics

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    status = Column(String, default="Open")
    device_id = Column(String, ForeignKey("devices.id"))
    ip_address = Column(String)
    high_alert_reason = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    explanation = Column(String)
    action = Column(String)
    applied = Column(Boolean, default=False)

    # TODO: AI anomaly engine integration

class DeviceEvent(Base):
    __tablename__ = "device_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey("devices.id"))
    event_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(String)
    metadata_ = Column("metadata", JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class TelemetrySnapshot(Base):
    __tablename__ = "telemetry_snapshots"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey("devices.id"))
    cpu_usage = Column(Integer)
    memory_usage = Column(Integer)
    disk_usage = Column(Integer)
    network_usage = Column(Integer)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey("devices.id"), index=True)
    anomaly_score = Column(Float, nullable=False, default=0)
    risk_score = Column(Float, nullable=False, default=0)
    classification = Column(String, nullable=False, default="Normal")
    confidence = Column(Float, nullable=False, default=0)
    features = Column(JSON)
    user_risk_score = Column(Float, nullable=False, default=0)
    organization_risk_score = Column(Float, nullable=False, default=0)
    insider_risk_score = Column(Float, nullable=False, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey("devices.id"), index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    confidence = Column(Float, nullable=False, default=0)
    status = Column(String, nullable=False, default="Open")
    reason = Column(String)
    contributing_factors = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
