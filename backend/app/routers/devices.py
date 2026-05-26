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
