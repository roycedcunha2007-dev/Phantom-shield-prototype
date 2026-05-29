from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ai_engine.engine import analyze_device, retrain_models
from app.database import get_db
from app.models import AIAnalysis, AIRecommendation, Device

router = APIRouter(prefix="/api/ai", tags=["AI Risk Engine"])


def serialize_analysis(analysis: AIAnalysis) -> dict:
    return {
        "id": analysis.id,
        "deviceId": analysis.device_id,
        "anomalyScore": analysis.anomaly_score,
        "riskScore": analysis.risk_score,
        "classification": analysis.classification,
        "confidence": analysis.confidence,
        "features": analysis.features or {},
        "userRiskScore": analysis.user_risk_score,
        "organizationRiskScore": analysis.organization_risk_score,
        "insiderRiskScore": analysis.insider_risk_score,
        "createdAt": analysis.created_at.isoformat() if analysis.created_at else None,
    }


def serialize_recommendation(recommendation: AIRecommendation) -> dict:
    return {
        "id": recommendation.id,
        "deviceId": recommendation.device_id,
        "title": recommendation.title,
        "description": recommendation.description,
        "confidence": recommendation.confidence,
        "status": recommendation.status,
        "reason": recommendation.reason or "",
        "contributingFactors": recommendation.contributing_factors or [],
        "createdAt": recommendation.created_at.isoformat() if recommendation.created_at else None,
    }


@router.get("/risk")
async def get_ai_risk(db: AsyncSession = Depends(get_db)):
    analyses = (
        await db.execute(select(AIAnalysis).order_by(AIAnalysis.created_at.desc()).limit(50))
    ).scalars().all()
    if not analyses:
        devices = (await db.execute(select(Device))).scalars().all()
        for device in devices:
            await analyze_device(db, device.id)
        await db.commit()
        analyses = (
            await db.execute(select(AIAnalysis).order_by(AIAnalysis.created_at.desc()).limit(50))
        ).scalars().all()

    organization_risk = round(sum(item.risk_score for item in analyses) / len(analyses), 2) if analyses else 0
    return {
        "organizationRiskScore": organization_risk,
        "latest": serialize_analysis(analyses[0]) if analyses else None,
        "items": [serialize_analysis(item) for item in analyses],
    }


@router.get("/anomalies")
async def get_ai_anomalies(db: AsyncSession = Depends(get_db)):
    analyses = (
        await db.execute(select(AIAnalysis).where(AIAnalysis.anomaly_score >= 40).order_by(AIAnalysis.created_at.desc()).limit(100))
    ).scalars().all()
    return [serialize_analysis(item) for item in analyses]


@router.get("/recommendations")
async def get_ai_recommendations(db: AsyncSession = Depends(get_db)):
    recommendations = (
        await db.execute(select(AIRecommendation).order_by(AIRecommendation.created_at.desc()).limit(100))
    ).scalars().all()
    return [serialize_recommendation(item) for item in recommendations]


@router.get("/device/{device_id}")
async def get_device_ai(device_id: str, db: AsyncSession = Depends(get_db)):
    latest = (
        await db.execute(
            select(AIAnalysis)
            .where(AIAnalysis.device_id == device_id)
            .order_by(AIAnalysis.created_at.desc())
            .limit(1)
        )
    ).scalars().first()
    if not latest:
        result = await analyze_device(db, device_id)
        await db.commit()
        return result

    recommendations = (
        await db.execute(
            select(AIRecommendation)
            .where(AIRecommendation.device_id == device_id)
            .order_by(AIRecommendation.created_at.desc())
            .limit(20)
        )
    ).scalars().all()
    payload = serialize_analysis(latest)
    payload["recommendations"] = [serialize_recommendation(item) for item in recommendations]
    return payload


@router.post("/retrain")
async def retrain_ai_models():
    retrain_models()
    return {"status": "ok", "message": "AI models retrained and persisted"}
