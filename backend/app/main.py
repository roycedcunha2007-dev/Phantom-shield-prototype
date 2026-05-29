from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, update, select
from app.database import get_db, async_session_maker
from app.models import Device
from app.routers import ai, alerts, auth, devices, recommendations
from ai_engine.engine import load_models
import asyncio
from datetime import datetime, timezone, timedelta

app = FastAPI(title="Phantom Shield Backend")

@app.on_event("startup")
async def startup_event():
    load_models()
    asyncio.create_task(offline_device_monitor())

async def offline_device_monitor():
    from app.websocket import manager
    while True:
        try:
            await asyncio.sleep(15)
            async with async_session_maker() as db:
                cutoff = datetime.now(timezone.utc) - timedelta(seconds=45)
                # Find devices that haven't updated since cutoff and are online
                result = await db.execute(select(Device).where(Device.status == "Online", Device.updated_at < cutoff))
                offline_devices = result.scalars().all()
                for dev in offline_devices:
                    dev.status = "Offline"
                    dev.last_activity = "Offline"
                    
                    await manager.broadcast({
                        "type": "device_offline",
                        "payload": {
                            "device_id": dev.id
                        }
                    })
                await db.commit()
        except Exception as e:
            print(f"Offline monitor error: {e}")

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
app.include_router(ai.router)
from app.routers import telemetry
app.include_router(telemetry.router)

from fastapi import WebSocket, WebSocketDisconnect
from app.websocket import manager

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming client messages if any
    except WebSocketDisconnect:
        manager.disconnect(websocket)

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
