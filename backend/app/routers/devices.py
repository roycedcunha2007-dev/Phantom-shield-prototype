from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Device

router = APIRouter(prefix="/api/devices", tags=["Devices"])


@router.get("")
async def list_devices(db: AsyncSession = Depends(get_db)):
    devices = (await db.execute(select(Device).order_by(Device.created_at))).scalars().all()
    return [
        {
            "id": device.id,
            "name": device.name,
            "owner": device.owner,
            "type": device.device_type,
            "status": device.status,
            "risk": device.risk,
            "lastActivity": device.last_activity,
            "logs": [],
        }
        for device in devices
    ]

from fastapi import HTTPException
from app.schemas import DeviceRegisterReq, DeviceHeartbeatReq
from app.models import TelemetrySnapshot
from app.websocket import manager
from datetime import datetime, timezone
import uuid

@router.post("/register")
async def register_device(req: DeviceRegisterReq, db: AsyncSession = Depends(get_db)):
    # If device_id provided and exists, update it, otherwise create new
    if req.device_id:
        existing = await db.get(Device, req.device_id)
        if existing:
            existing.status = "Online"
            existing.last_activity = "Just now"
            await db.commit()
            return {"device_id": existing.id}
    
    new_device = Device(
        id=req.device_id or str(uuid.uuid4()),
        name=req.hostname,
        owner=req.username,
        device_type="Endpoint",
        status="Online",
        last_activity="Just now",
        risk=0
    )
    db.add(new_device)
    await db.commit()
    
    # Broadcast to websocket
    await manager.broadcast({
        "type": "device_connected",
        "payload": {
            "id": new_device.id,
            "name": new_device.name,
            "owner": new_device.owner,
            "type": new_device.device_type,
            "status": new_device.status,
            "risk": new_device.risk,
            "lastActivity": new_device.last_activity
        }
    })
    
    return {"device_id": new_device.id}

@router.post("/heartbeat")
async def device_heartbeat(req: DeviceHeartbeatReq, db: AsyncSession = Depends(get_db)):
    device = await db.get(Device, req.device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device.status = "Online"
    device.last_activity = "Just now"
    
    snapshot = TelemetrySnapshot(
        device_id=req.device_id,
        cpu_usage=int(req.cpu_usage),
        memory_usage=int(req.memory_usage),
        disk_usage=int(req.disk_usage),
        network_usage=int(req.network_usage)
    )
    db.add(snapshot)
    await db.commit()
    
    await manager.broadcast({
        "type": "heartbeat_received",
        "payload": {
            "device_id": req.device_id,
            "cpu_usage": req.cpu_usage,
            "memory_usage": req.memory_usage,
            "disk_usage": req.disk_usage,
            "network_usage": req.network_usage,
            "timestamp": req.timestamp
        }
    })
    return {"status": "ok"}
