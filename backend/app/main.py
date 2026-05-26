from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
from app.routers import alerts, auth, devices, recommendations

app = FastAPI(title="Phantom Shield Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(alerts.router)
app.include_router(recommendations.router)

# TODO: websocket threat streaming

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    db_status = "disconnected"
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        print(f"Health check DB error: {e}")
        pass

    return {
        "status": "healthy",
        "database": db_status
    }
