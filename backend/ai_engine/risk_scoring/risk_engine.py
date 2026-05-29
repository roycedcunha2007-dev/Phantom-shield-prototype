from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import AIAnalysis, Alert, Device

CLASS_WEIGHTS = {
    "Normal": 4,
    "Suspicious": 22,
    "High Risk": 42,
    "Critical": 62,
}


async def calculate_device_risk_score(
    db: AsyncSession,
    device_id: str,
    anomaly_score: float,
    classification: str,
    features: dict[str, float],
) -> float:
    device = await db.get(Device, device_id)
    alert_count = (
        await db.execute(select(Alert).where(Alert.device_id == device_id))
    ).scalars().all()
    critical_alerts = sum(1 for alert in alert_count if alert.severity.upper() == "CRITICAL")
    high_alerts = sum(1 for alert in alert_count if alert.severity.upper() == "HIGH")

    rule_score = float(device.risk if device else 0)
    alert_history_score = min(100.0, critical_alerts * 18 + high_alerts * 10 + len(alert_count) * 3)
    behavior_score = min(
        100.0,
        features["failed_login_count"] * 5
        + features["usb_insertion_frequency"] * 80
        + features["file_deletion_rate"] * 40
        + features["abnormal_working_hours"] * 4
        + features["large_data_movement"] * 0.03
        + features["unusual_login_locations"] * 12,
    )
    model_score = CLASS_WEIGHTS.get(classification, 10)

    final_score = (
        rule_score * 0.28
        + anomaly_score * 0.32
        + alert_history_score * 0.18
        + behavior_score * 0.14
        + model_score * 0.08
    )
    return round(max(0.0, min(100.0, final_score)), 2)


def calculate_user_risk_score(device_risk_score: float, features: dict[str, float]) -> float:
    insider_weight = (
        features["excessive_file_access"] * 0.22
        + features["repeated_usb_activity"] * 8
        + features["abnormal_working_hours"] * 4
        + features["unusual_login_locations"] * 10
    )
    return round(max(0.0, min(100.0, device_risk_score * 0.72 + insider_weight)), 2)


async def calculate_organization_risk_score(db: AsyncSession) -> float:
    analyses = (await db.execute(select(AIAnalysis).order_by(AIAnalysis.created_at.desc()).limit(100))).scalars().all()
    if not analyses:
        return 0.0
    return round(sum(item.risk_score for item in analyses) / len(analyses), 2)


def calculate_insider_risk_score(features: dict[str, float]) -> float:
    score = (
        min(features["excessive_file_access"], 300) * 0.12
        + min(features["large_data_movement"], 1000) * 0.035
        + features["abnormal_working_hours"] * 6
        + features["repeated_usb_activity"] * 12
        + features["unusual_login_locations"] * 14
    )
    return round(max(0.0, min(100.0, score)), 2)
