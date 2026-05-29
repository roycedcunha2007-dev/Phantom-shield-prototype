from pydantic import BaseModel
from typing import Optional, Dict, Any

class DeviceRegisterReq(BaseModel):
    device_id: Optional[str] = None
    device_name: str
    hostname: str
    operating_system: str
    cpu: str
    memory: str
    username: str
    mac_address: str
    ip_address: str

class DeviceHeartbeatReq(BaseModel):
    device_id: str
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_usage: float
    active_process_count: int
    timestamp: str

class DeviceEventReq(BaseModel):
    device_id: str
    event_type: str
    severity: str
    description: str
    metadata: Dict[str, Any]
    timestamp: str
