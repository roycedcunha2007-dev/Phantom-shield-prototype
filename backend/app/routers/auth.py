from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get("")
async def auth_status():
    return {"status": "available"}
