from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Device, DeviceEvent, Alert
from app.schemas import DeviceEventReq
from app.websocket import manager
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/telemetry", tags=["Telemetry"])

@router.post("/processes")
async def receive_process_event(req: DeviceEventReq, db: AsyncSession = Depends(get_db)):
    return await receive_device_event(req, db)

@router.post("/network")
async def receive_network_event(req: DeviceEventReq, db: AsyncSession = Depends(get_db)):
    return await receive_device_event(req, db)

@router.post("/files")
async def receive_file_event(req: DeviceEventReq, db: AsyncSession = Depends(get_db)):
    return await receive_device_event(req, db)

@router.post("/sessions")
async def receive_session_event(req: DeviceEventReq, db: AsyncSession = Depends(get_db)):
    return await receive_device_event(req, db)

@router.post("/usb")
async def receive_usb_event(req: DeviceEventReq, db: AsyncSession = Depends(get_db)):
    return await receive_device_event(req, db)

@router.post("/events")
async def receive_device_event(req: DeviceEventReq, db: AsyncSession = Depends(get_db)):
    device = await db.get(Device, req.device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    event = DeviceEvent(
        device_id=req.device_id,
        event_type=req.event_type,
        severity=req.severity,
        description=req.description,
        metadata_=req.metadata
    )
    db.add(event)
    
    # Broadcast event
    await manager.broadcast({
        "type": "new_security_event",
        "payload": {
            "device_id": req.device_id,
            "event_type": req.event_type,
            "severity": req.severity,
            "description": req.description,
            "metadata": req.metadata,
            "timestamp": req.timestamp
        }
    })
    
    # Alert Engine (Rule-based detection)
    alert = None
    if req.event_type == "high_cpu":
        cpu_usage = req.metadata.get("cpu_usage", 0)
        if cpu_usage > 95:
            alert = Alert(
                type="Resource Spike",
                severity="HIGH",
                device_id=req.device_id,
                high_alert_reason=f"CPU Usage at {cpu_usage}%"
            )
    elif req.event_type == "mass_file_copy":
        count = req.metadata.get("count", 0)
        if count > 100:
            alert = Alert(
                type="Data Exfiltration Risk",
                severity="CRITICAL",
                device_id=req.device_id,
                high_alert_reason=f"{count} files copied rapidly"
            )
    elif req.event_type == "suspicious_process":
        process = req.metadata.get("process", "unknown")
        alert = Alert(
            type="Suspicious Process",
            severity="HIGH",
            device_id=req.device_id,
            high_alert_reason=f"Suspicious process launched: {process}"
        )

    # Advanced Correlation
    from sqlalchemy import select
    from datetime import timedelta
    cutoff = datetime.now(timezone.utc) - timedelta(seconds=60)
    recent_events = (await db.execute(
        select(DeviceEvent)
        .where(DeviceEvent.device_id == req.device_id)
        .where(DeviceEvent.created_at >= cutoff)
    )).scalars().all()
    
    event_types = [e.event_type for e in recent_events]
    event_types.append(req.event_type) # Include current
    
    if "usb_inserted" in event_types and "mass_file_copy" in event_types:
        # Check if we already created this alert recently to avoid spam
        existing_alert = (await db.execute(
            select(Alert).where(Alert.device_id == req.device_id, Alert.type == "Insider Risk")
            .where(Alert.created_at >= cutoff)
        )).scalars().first()
        
        if not existing_alert:
            alert = Alert(
                type="Insider Risk",
                severity="CRITICAL",
                device_id=req.device_id,
                high_alert_reason="USB inserted + mass file copy detected"
            )


    if alert:
        db.add(alert)
        await db.flush() # get alert id
        # update device risk
        device.risk = min(100, device.risk + (30 if alert.severity == "CRITICAL" else 10))
        
        await manager.broadcast({
            "type": "high_risk_alert",
            "payload": {
                "id": alert.id,
                "type": alert.type,
                "severity": alert.severity,
                "device_id": alert.device_id,
                "reason": alert.high_alert_reason
            }
        })

    await db.flush()
    try:
        from ai_engine.engine import analyze_device

        ai_result = await analyze_device(db, req.device_id)
        await manager.broadcast({
            "type": "ai_analysis_updated",
            "payload": ai_result
        })
    except Exception as exc:
        print(f"AI analysis error: {exc}")

    await db.commit()
    return {"status": "ok"}
