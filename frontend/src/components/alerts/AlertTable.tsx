"use client";

import { useState } from "react";
import { Badge } from "@/components/common/Badge";
import { AlertModal } from "@/components/alerts/AlertModal";
import { useAlertStore } from "@/store/useAlertStore";
import { useDeviceStore } from "@/store/useDeviceStore";
import { useUserStore } from "@/store/useUserStore";
import { currentTime } from "@/utils/time";
import type { Alert } from "@/types";

// Component responsibility: alert presentation plus the original block/unblock/enquire actions.
export function AlertTable() {
  const alerts = useAlertStore((state) => state.alerts);
  const updateAlertStatus = useAlertStore((state) => state.updateAlertStatus);
  const devices = useDeviceStore((state) => state.devices);
  const updateDevice = useDeviceStore((state) => state.updateDevice);
  const user = useUserStore((state) => state.user);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const deviceFor = (id: string) => devices.find((device) => device.id === id) ?? devices[0];

  const blockAlert = (alert: Alert) => {
    const device = deviceFor(alert.deviceId);
    updateAlertStatus(alert.id, "Blocked", { title: "Threat blocked", time: currentTime(), body: `${alert.type} on ${device.name} was marked blocked by ${user?.name ?? "the current operator"}.` });
    updateDevice(device.id, { status: "Quarantined", risk: Math.max(25, device.risk - 16) });
  };

  const unblockAlert = (alert: Alert) => {
    const device = deviceFor(alert.deviceId);
    updateAlertStatus(alert.id, "Investigating", { title: "Account unblocked", time: currentTime(), body: `${device.name} was unblocked after review and returned to investigating status.` });
    updateDevice(device.id, { status: "Online", risk: Math.min(96, device.risk + 10) });
  };

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Threat type</th><th>Severity</th><th>Timestamp</th><th>Status</th><th>Device</th><th>Actions</th></tr></thead>
          <tbody>
            {alerts.map((alert) => {
              const device = deviceFor(alert.deviceId);
              const blocked = alert.status === "Blocked";
              return (
                <tr key={alert.id}>
                  <td><span className="threat-name">{alert.type}</span></td>
                  <td><Badge value={alert.severity} /></td>
                  <td>{alert.timestamp}</td>
                  <td><Badge value={alert.status} /></td>
                  <td>{device.name}</td>
                  <td>
                    <div className="action-row">
                      <button className="table-action enquire" onClick={() => setSelectedAlert(alert)}>Enquire</button>
                      {blocked
                        ? <button className="table-action unblock" onClick={() => unblockAlert(alert)}>Unblock</button>
                        : <button className="table-action block" onClick={() => blockAlert(alert)}>Block</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedAlert && <AlertModal alert={selectedAlert} device={deviceFor(selectedAlert.deviceId)} onClose={() => setSelectedAlert(null)} />}
    </>
  );
}
