import os
import time
import threading
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from event_queue import enqueue_event
from config import config

class SuspiciousFileHandler(FileSystemEventHandler):
    def __init__(self):
        self.recent_copies = []
        self.recent_deletions = []
        self.recent_renames = []
        self.lock = threading.Lock()

    def on_created(self, event):
        if event.is_directory:
            return
            
        file_path = event.src_path
        ext = os.path.splitext(file_path)[1].lower()
        
        # Check suspicious extensions
        if ext in ['.exe', '.bat', '.ps1', '.sh', '.dll']:
            enqueue_event(
                event_type="suspicious_file_creation",
                severity="HIGH",
                description=f"Suspicious executable dropped: {os.path.basename(file_path)}",
                metadata={"file": file_path}
            )

        # Track mass copy operations
        now = time.time()
        with self.lock:
            self.recent_copies = [t for t in self.recent_copies if now - t < 10]
            self.recent_copies.append(now)
            
            if len(self.recent_copies) > 100:
                enqueue_event(
                    event_type="mass_file_copy",
                    severity="CRITICAL",
                    description=f"Data exfiltration risk: {len(self.recent_copies)} files created rapidly",
                    metadata={"count": len(self.recent_copies)}
                )
                self.recent_copies.clear()

    def on_deleted(self, event):
        if event.is_directory: return
        now = time.time()
        with self.lock:
            self.recent_deletions = [t for t in self.recent_deletions if now - t < 10]
            self.recent_deletions.append(now)
            if len(self.recent_deletions) > 50:
                enqueue_event(
                    event_type="mass_file_deletion",
                    severity="HIGH",
                    description=f"Mass deletion detected: {len(self.recent_deletions)} files",
                    metadata={"count": len(self.recent_deletions)}
                )
                self.recent_deletions.clear()

    def on_moved(self, event):
        if event.is_directory: return
        now = time.time()
        ext = os.path.splitext(event.dest_path)[1].lower()
        if ext in ['.encrypted', '.locked', '.crypt']:
            enqueue_event(
                event_type="ransomware_behavior",
                severity="CRITICAL",
                description=f"Ransomware-like encryption behavior detected",
                metadata={"src": event.src_path, "dest": event.dest_path}
            )
            
        with self.lock:
            self.recent_renames = [t for t in self.recent_renames if now - t < 10]
            self.recent_renames.append(now)
            if len(self.recent_renames) > 50:
                enqueue_event(
                    event_type="mass_file_rename",
                    severity="CRITICAL",
                    description=f"Rapid rename operations (ransomware risk): {len(self.recent_renames)} files",
                    metadata={"count": len(self.recent_renames)}
                )
                self.recent_renames.clear()

def start_file_monitor():
    if config.SIMULATION_MODE:
        return
        
    paths_to_watch = [
        os.path.expanduser("~/Downloads"),
        os.path.expanduser("~/Desktop"),
        os.path.expanduser("~/Documents")
    ]
    
    observer = Observer()
    handler = SuspiciousFileHandler()
    
    for path in paths_to_watch:
        if os.path.exists(path):
            observer.schedule(handler, path, recursive=True)
            
    observer.start()
