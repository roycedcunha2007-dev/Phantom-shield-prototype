from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Recommendation

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("")
async def list_recommendations(db: AsyncSession = Depends(get_db)):
    recommendations = (await db.execute(select(Recommendation))).scalars().all()
    return [
        {
            "id": recommendation.id,
            "title": recommendation.title,
            "severity": recommendation.severity,
            "explanation": recommendation.explanation or "",
            "action": recommendation.action or "",
            "applied": recommendation.applied,
        }
        for recommendation in recommendations
    ]
