import psutil
import time
import threading
from event_queue import enqueue_event
from config import config

class USBMonitor:
    def __init__(self):
        self.known_drives = set()

    def check_drives(self):
        try:
            current_drives = set()
            for part in psutil.disk_partitions(all=False):
                # On Windows, removable drives often have 'removable' in opts or 'cdrom'
                # On Linux/Mac, they might be mounted under /media or /Volumes
                is_removable = False
                if 'removable' in part.opts.lower() or 'cdrom' in part.opts.lower():
                    is_removable = True
                elif part.mountpoint.startswith('/media') or part.mountpoint.startswith('/mnt'):
                    is_removable = True
                elif part.mountpoint.startswith('/Volumes') and part.mountpoint != '/Volumes/Macintosh HD':
                    is_removable = True

                if is_removable:
                    current_drives.add(part.device)

            new_drives = current_drives - self.known_drives
            removed_drives = self.known_drives - current_drives

            for drive in new_drives:
                enqueue_event(
                    event_type="usb_inserted",
                    severity="MEDIUM",
                    description=f"External storage device connected: {drive}",
                    metadata={"drive": drive}
                )

            for drive in removed_drives:
                enqueue_event(
                    event_type="usb_removed",
                    severity="LOW",
                    description=f"External storage device disconnected: {drive}",
                    metadata={"drive": drive}
                )

            self.known_drives = current_drives
        except Exception:
            pass

def usb_monitor_worker():
    monitor = USBMonitor()
    # Initialize known drives without triggering alerts
    monitor.check_drives()
    
    while True:
        time.sleep(5)
        monitor.check_drives()

def start_usb_monitor():
    if not config.SIMULATION_MODE:
        t = threading.Thread(target=usb_monitor_worker, daemon=True)
        t.start()
