import os
import uuid
import json
from pathlib import Path
import platform

# Handle cross-platform paths
if platform.system() == "Windows":
    base_dir = Path(os.environ.get("PROGRAMDATA", "C:\\ProgramData")) / "PhantomShield"
else:
    base_dir = Path("/var/lib/phantomshield")

# Fallback for dev mode without admin
try:
    base_dir.mkdir(parents=True, exist_ok=True)
except PermissionError:
    base_dir = Path.home() / ".phantomshield"
    base_dir.mkdir(parents=True, exist_ok=True)

DEVICE_ID_FILE = base_dir / ".device_id"
OFFLINE_QUEUE_FILE = base_dir / "offline_queue.json"

def get_or_create_device_id() -> str:
    if DEVICE_ID_FILE.exists():
        try:
            return DEVICE_ID_FILE.read_text().strip()
        except:
            pass
    new_id = str(uuid.uuid4())
    DEVICE_ID_FILE.write_text(new_id)
    return new_id

class Config:
    API_URL = os.getenv("API_URL", "http://localhost:8000")
    SIMULATION_MODE = os.getenv("SIMULATION_MODE", "false").lower() == "true"
    DEVICE_ID = get_or_create_device_id()
    HEARTBEAT_INTERVAL_SEC = 15
    QUEUE_FILE = OFFLINE_QUEUE_FILE

config = Config()
