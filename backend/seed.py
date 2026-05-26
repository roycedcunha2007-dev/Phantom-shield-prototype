import asyncio
from app.database import engine, Base
from app.models import User, Device, Alert, Recommendation

async def seed_db():
    print("Creating tables if they don't exist...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized without demonstration records.")

if __name__ == "__main__":
    asyncio.run(seed_db())
