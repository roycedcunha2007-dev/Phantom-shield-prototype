import psutil
import time
import threading
from event_queue import enqueue_event
from config import config

class ProcessMonitor:
    def __init__(self):
        self.known_pids = set()
        self.process_history = {} # Track creation times and parents

    def check_processes(self):
        current_pids = set(psutil.pids())
        new_pids = current_pids - self.known_pids
        
        # Track terminated
        terminated_pids = self.known_pids - current_pids
        for pid in terminated_pids:
            if pid in self.process_history:
                del self.process_history[pid]

        for pid in new_pids:
            try:
                p = psutil.Process(pid)
                name = p.name().lower()
                cmdline = " ".join(p.cmdline()).lower()
                parent = p.parent()
                parent_name = parent.name().lower() if parent else "unknown"
                create_time = p.create_time()
                
                self.process_history[pid] = {
                    "name": name,
                    "parent": parent_name,
                    "cmdline": cmdline,
                    "create_time": create_time
                }
                
                # Suspicious behavior checks
                is_suspicious = False
                severity = "LOW"
                reason = ""
                
                # 1. PowerShell / CMD abuse
                if name in ['powershell.exe', 'cmd.exe', 'bash', 'sh']:
                    suspicious_args = ['hidden', 'bypass', 'encodedcommand', '-e ', 'wget', 'curl', 'nc ']
                    if any(arg in cmdline for arg in suspicious_args):
                        is_suspicious = True
                        severity = "HIGH"
                        reason = f"Suspicious shell execution: {name}"
                
                # 2. Crypto-mining
                elif 'miner' in name or 'xmrig' in name:
                    is_suspicious = True
                    severity = "CRITICAL"
                    reason = f"Crypto-mining behavior detected: {name}"
                    
                # 3. Privilege escalation / Weird parents
                elif name in ['svchost.exe', 'lsass.exe'] and parent_name not in ['services.exe', 'wininit.exe', 'unknown']:
                    is_suspicious = True
                    severity = "CRITICAL"
                    reason = f"Process masquerading detected: {name} spawned by {parent_name}"
                
                if is_suspicious:
                    enqueue_event(
                        event_type="suspicious_process",
                        severity=severity,
                        description=reason,
                        metadata={"process": name, "cmdline": cmdline, "parent": parent_name}
                    )
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
                
        self.known_pids = current_pids

def process_monitor_worker():
    monitor = ProcessMonitor()
    monitor.check_processes()
    
    while True:
        monitor.check_processes()
        time.sleep(2) # Faster checking for advanced tracking

def start_system_monitor():
    if not config.SIMULATION_MODE:
        t = threading.Thread(target=process_monitor_worker, daemon=True)
        t.start()
