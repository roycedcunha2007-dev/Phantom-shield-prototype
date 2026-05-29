import time
import socket
import platform
import psutil
import requests
import os
import sys
from pathlib import Path

# Add shared and core to path so imports work correctly
BASE_DIR = Path(__file__).parent.parent
sys.path.append(str(BASE_DIR / "core"))
sys.path.append(str(BASE_DIR / "shared"))

from config import config
from event_queue import enqueue_event
from telemetry import start_telemetry
from file_monitor import start_file_monitor
from system_monitor import start_system_monitor
from network_monitor import start_network_monitor
from usb_monitor import start_usb_monitor

def register_device():
    print("Registering device with backend...")
    
    hostname = socket.gethostname()
    os_name = platform.system() + " " + platform.release()
    cpu_info = platform.processor() or "Unknown CPU"
    mem_info = f"{round(psutil.virtual_memory().total / (1024**3), 2)} GB"
    username = os.getlogin() if hasattr(os, "getlogin") else "Unknown"
    
    mac = "00:00:00:00:00:00"
    ip = "127.0.0.1"
    
    try:
        for interface, addrs in psutil.net_if_addrs().items():
            for addr in addrs:
                if addr.family == socket.AF_INET and not addr.address.startswith("127."):
                    ip = addr.address
                elif addr.family == psutil.AF_LINK:
                    mac = addr.address
    except:
        pass

    payload = {
        "device_id": config.DEVICE_ID,
        "device_name": hostname,
        "hostname": hostname,
        "operating_system": os_name,
        "cpu": cpu_info,
        "memory": mem_info,
        "username": username,
        "mac_address": mac,
        "ip_address": ip
    }

    try:
        url = f"{config.API_URL}/api/devices/register"
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        print(f"Device registered successfully. ID: {config.DEVICE_ID}")
        
        enqueue_event(
            event_type="session_start",
            severity="LOW",
            description=f"Device {hostname} session started",
            metadata={"user": username}
        )
    except Exception as e:
        print(f"Failed to register device: {e}")
        print("Will retry later using offline queue...")

def main():
    print(f"Starting Phantom Agent on {platform.system()}...")
    if config.SIMULATION_MODE:
        print("Running in SIMULATION MODE")
        
    register_device()
    
    print("Starting cross-platform shared monitors...")
    start_telemetry()
    start_file_monitor()
    start_system_monitor()
    start_network_monitor()
    start_usb_monitor()
    
    # Load platform-specific modules if needed
    if platform.system() == "Windows":
        # Load advanced Windows features if available
        pass
    elif platform.system() == "Linux":
        pass
    elif platform.system() == "Darwin":
        pass

    print("Phantom Agent is active and streaming telemetry.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down Phantom Agent...")
        enqueue_event(
            event_type="session_end",
            severity="LOW",
            description="Agent shutting down",
            metadata={}
        )
        time.sleep(1)

if __name__ == "__main__":
    main()
