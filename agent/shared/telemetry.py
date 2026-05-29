import psutil
import requests
import time
import threading
from datetime import datetime, timezone
from config import config
from event_queue import enqueue_event
import random

def collect_telemetry():
    if config.SIMULATION_MODE:
        # Generate some fake data
        cpu = random.uniform(5.0, 99.0)
        mem = random.uniform(20.0, 90.0)
        disk = random.uniform(40.0, 80.0)
        net = random.uniform(1.0, 100.0)
        procs = random.randint(100, 300)
    else:
        cpu = psutil.cpu_percent(interval=1)
        mem = psutil.virtual_memory().percent
        disk = psutil.disk_usage('/').percent
        net = 0 # Placeholder for network usage
        procs = len(psutil.pids())

    return {
        "device_id": config.DEVICE_ID,
        "cpu_usage": cpu,
        "memory_usage": mem,
        "disk_usage": disk,
        "network_usage": net,
        "active_process_count": procs,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

def heartbeat_worker():
    while True:
        try:
            data = collect_telemetry()
            
            # Send heartbeat
            url = f"{config.API_URL}/api/devices/heartbeat"
            requests.post(url, json=data, timeout=5)
            
            # Generate event if CPU is high
            if data["cpu_usage"] > 95:
                enqueue_event(
                    event_type="high_cpu",
                    severity="HIGH",
                    description="High CPU usage detected",
                    metadata={"cpu_usage": data["cpu_usage"]}
                )
                
        except Exception as e:
            pass
            
        time.sleep(config.HEARTBEAT_INTERVAL_SEC)

def start_telemetry():
    t = threading.Thread(target=heartbeat_worker, daemon=True)
    t.start()
