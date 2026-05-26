from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Alert

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("")
async def list_alerts(db: AsyncSession = Depends(get_db)):
    alerts = (await db.execute(select(Alert).order_by(Alert.created_at.desc()))).scalars().all()
    return [
        {
            "id": alert.id,
            "type": alert.type,
            "severity": alert.severity,
            "timestamp": alert.created_at.strftime("%H:%M") if alert.created_at else "",
            "status": alert.status,
            "deviceId": alert.device_id,
            "ipAddress": alert.ip_address or "",
            "openedTabs": [],
            "suspiciousBehaviors": [],
            "highAlertReason": alert.high_alert_reason or "",
        }
        for alert in alerts
    ]
