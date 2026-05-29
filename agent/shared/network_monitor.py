import psutil
import time
import threading
from event_queue import enqueue_event
from config import config

class NetworkMonitor:
    def __init__(self):
        self.last_connections = set()
        self.recent_new_connections = []
        self.lock = threading.Lock()

    def check_network(self):
        try:
            current_conns = set()
            for conn in psutil.net_connections(kind='inet'):
                if conn.status == 'ESTABLISHED':
                    if hasattr(conn, 'raddr') and conn.raddr:
                        current_conns.add((conn.raddr.ip, conn.raddr.port))
            
            new_conns = current_conns - self.last_connections
            
            now = time.time()
            with self.lock:
                self.recent_new_connections = [t for t in self.recent_new_connections if now - t < 60] # track last 60s
                for _ in new_conns:
                    self.recent_new_connections.append(now)
                
                # Check for port scanning or beaconing (high frequency connections)
                if len(self.recent_new_connections) > 100:
                    enqueue_event(
                        event_type="network_anomaly",
                        severity="HIGH",
                        description=f"High frequency network connections: {len(self.recent_new_connections)} in 60s",
                        metadata={"new_connections_60s": len(self.recent_new_connections)}
                    )
                    self.recent_new_connections.clear()
            
            self.last_connections = current_conns
        except (psutil.AccessDenied, Exception):
            pass

def network_monitor_worker():
    monitor = NetworkMonitor()
    monitor.check_network()
    
    while True:
        monitor.check_network()
        time.sleep(5)

def start_network_monitor():
    if not config.SIMULATION_MODE:
        t = threading.Thread(target=network_monitor_worker, daemon=True)
        t.start()
