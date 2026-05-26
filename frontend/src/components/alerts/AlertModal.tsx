"use client";

import { Modal } from "@/components/common/Modal";
import type { Alert, Device } from "@/types";

export function AlertModal({ alert, device, onClose }: { alert: Alert; device: Device; onClose: () => void }) {
  return (
    <Modal overlayClassName="alert-modal" dialogClassName="alert-dialog" onClose={onClose}>
      <button className="alert-close" type="button" aria-label="Close alert details" onClick={onClose}>&times;</button>
      <p className="section-kicker">Suspicious account enquiry</p>
      <h3>{alert.type}</h3>
      <div className="alert-summary-grid">
        <div><span>Device</span><strong>{device.name}</strong></div>
        <div><span>IP address</span><strong>{alert.ipAddress}</strong></div>
        <div><span>Severity</span><strong>{alert.severity}</strong></div>
        <div><span>Status</span><strong>{alert.status}</strong></div>
      </div>
      <div className="alert-detail-block"><h4>Tabs opened</h4><ul>{alert.openedTabs.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className="alert-detail-block"><h4>Suspicious behaviours</h4><ul>{alert.suspiciousBehaviors.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className="alert-detail-block"><h4>Why this device is on alert</h4><p>{alert.highAlertReason}</p></div>
    </Modal>
  );
}
