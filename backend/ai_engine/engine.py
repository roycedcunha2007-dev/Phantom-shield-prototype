from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ai_engine.anomaly_detection.isolation_forest import IsolationForestDetector
from ai_engine.features.pipeline import build_device_features
from ai_engine.prediction.classifier import SuspiciousBehaviorClassifier
from ai_engine.recommendation_engine.recommender import generate_recommendations
from ai_engine.risk_scoring.risk_engine import (
    calculate_device_risk_score,
    calculate_insider_risk_score,
    calculate_organization_risk_score,
    calculate_user_risk_score,
)
from app.models import AIAnalysis, AIRecommendation, Device

# TODO: deep learning models
# TODO: behavioral graph analysis
# TODO: threat intelligence enrichment
# TODO: LLM-powered investigation assistant
# TODO: federated learning
# TODO: ransomware prediction

detector = IsolationForestDetector()
classifier = SuspiciousBehaviorClassifier()


def load_models() -> None:
    detector.load_or_train()
    classifier.load_or_train()


def retrain_models() -> None:
    from ai_engine.anomaly_detection.isolation_forest import MODEL_PATH as ANOMALY_PATH
    from ai_engine.prediction.classifier import MODEL_PATH as CLASSIFIER_PATH

    for path in (ANOMALY_PATH, CLASSIFIER_PATH):
        if path.exists():
            path.unlink()
    detector.load_or_train()
    classifier.load_or_train()


async def analyze_device(db: AsyncSession, device_id: str) -> dict[str, object]:
    features = await build_device_features(db, device_id)
    anomaly_score = detector.score(features)
    classification, confidence = classifier.predict(features)
    risk_score = await calculate_device_risk_score(db, device_id, anomaly_score, classification, features)
    user_risk_score = calculate_user_risk_score(risk_score, features)
    organization_risk_score = await calculate_organization_risk_score(db)
    insider_risk_score = calculate_insider_risk_score(features)

    analysis = AIAnalysis(
        device_id=device_id,
        anomaly_score=anomaly_score,
        risk_score=risk_score,
        classification=classification,
        confidence=confidence,
        features=features,
        user_risk_score=user_risk_score,
        organization_risk_score=organization_risk_score,
        insider_risk_score=insider_risk_score,
    )
    db.add(analysis)

    device = await db.get(Device, device_id)
    if device:
        device.risk = int(max(device.risk or 0, round(risk_score)))

    generated = generate_recommendations(
        device_id=device_id,
        features=features,
        anomaly_score=anomaly_score,
        risk_score=risk_score,
        classification=classification,
        insider_risk_score=insider_risk_score,
    )
    recommendations = []
    existing_titles = {
        item.title
        for item in (
            await db.execute(
                select(AIRecommendation).where(
                    AIRecommendation.device_id == device_id,
                    AIRecommendation.status == "Open",
                )
            )
        ).scalars().all()
    }
    for item in generated:
        if item["title"] in existing_titles:
            continue
        recommendation = AIRecommendation(
            device_id=device_id,
            title=str(item["title"]),
            description=str(item["description"]),
            confidence=float(item["confidence"]),
            reason=str(item["reason"]),
            contributing_factors=item["contributing_factors"],
        )
        db.add(recommendation)
        recommendations.append(recommendation)

    await db.flush()
    return {
        "id": analysis.id,
        "deviceId": device_id,
        "anomalyScore": anomaly_score,
        "riskScore": risk_score,
        "classification": classification,
        "confidence": confidence,
        "userRiskScore": user_risk_score,
        "organizationRiskScore": organization_risk_score,
        "insiderRiskScore": insider_risk_score,
        "features": features,
        "recommendations": [
            {
                "id": recommendation.id,
                "deviceId": recommendation.device_id,
                "title": recommendation.title,
                "description": recommendation.description,
                "confidence": recommendation.confidence,
                "reason": recommendation.reason,
                "contributingFactors": recommendation.contributing_factors or [],
                "status": recommendation.status,
            }
            for recommendation in recommendations
        ],
    }
