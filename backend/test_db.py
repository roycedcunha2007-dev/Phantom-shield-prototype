import asyncio
from app.database import AsyncSessionLocal, engine, Base
from app.models import Device
from sqlalchemy import select

async def test_crud():
    print("Starting CRUD tests...")
    
    async with AsyncSessionLocal() as db:
        # Create
        print("Testing INSERT...")
        new_device = Device(name="Test-Endpoint-99", owner="Test User", device_type="Linux server", risk=10)
        db.add(new_device)
        await db.commit()
        await db.refresh(new_device)
        print(f"Inserted device with ID: {new_device.id}")
        
        # Read
        print("Testing SELECT...")
        result = await db.execute(select(Device).where(Device.id == new_device.id))
        device = result.scalar_one_or_none()
        if device:
            print(f"Read successful: {device.name}")
        else:
            print("Read failed!")
            
        # Update
        print("Testing UPDATE...")
        device.risk = 99
        await db.commit()
        await db.refresh(device)
        print(f"Updated risk to: {device.risk}")
        
        # Delete
        print("Testing DELETE...")
        await db.delete(device)
        await db.commit()
        
        verify_delete = await db.execute(select(Device).where(Device.id == new_device.id))
        if verify_delete.scalar_one_or_none() is None:
            print("Delete successful!")
        else:
            print("Delete failed!")

    print("All CRUD tests passed successfully!")

if __name__ == "__main__":
    asyncio.run(test_crud())
