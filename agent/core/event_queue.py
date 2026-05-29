import queue
import requests
import threading
import time
import json
from datetime import datetime, timezone
import os

# Import using relative paths to support modular loading
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))
from config import config

# Thread-safe queue
event_queue = queue.Queue()
offline_buffer = []
lock = threading.Lock()

def load_offline_queue():
    global offline_buffer
    if config.QUEUE_FILE.exists():
        try:
            with open(config.QUEUE_FILE, 'r') as f:
                offline_buffer = json.load(f)
        except:
            offline_buffer = []

def save_offline_queue():
    with lock:
        try:
            with open(config.QUEUE_FILE, 'w') as f:
                json.dump(offline_buffer, f)
        except:
            pass

def sync_offline_events():
    global offline_buffer
    with lock:
        if not offline_buffer:
            return
            
        remaining = []
        for event in offline_buffer:
            try:
                url = f"{config.API_URL}/api/telemetry/events"
                resp = requests.post(url, json=event, timeout=5)
                if resp.status_code not in (200, 201):
                    remaining.append(event)
            except Exception:
                remaining.append(event)
                
        offline_buffer = remaining
    save_offline_queue()

def event_sender_worker():
    load_offline_queue()
    
    while True:
        # First try to sync offline queue if we have connectivity
        if offline_buffer:
            sync_offline_events()
            
        event = event_queue.get()
        if event is None:
            break
            
        payload = {
            "device_id": config.DEVICE_ID,
            "event_type": event.get("event_type"),
            "severity": event.get("severity", "LOW"),
            "description": event.get("description", ""),
            "metadata": event.get("metadata", {}),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            url = f"{config.API_URL}/api/telemetry/events"
            requests.post(url, json=payload, timeout=5)
        except Exception:
            # Backend unavailable, save locally
            with lock:
                offline_buffer.append(payload)
            save_offline_queue()
            
        event_queue.task_done()

# Start background worker
worker_thread = threading.Thread(target=event_sender_worker, daemon=True)
worker_thread.start()

def enqueue_event(event_type: str, severity: str, description: str, metadata: dict = None):
    event_queue.put({
        "event_type": event_type,
        "severity": severity,
        "description": description,
        "metadata": metadata or {}
    })
