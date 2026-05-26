"use client";

import { Badge } from "@/components/common/Badge";
import { RiskMeter } from "@/components/devices/RiskMeter";
import type { Device } from "@/types";
import { getRiskLevel } from "@/utils/risk";

export function DeviceCard({ device, active, onSelect }: { device: Device; active: boolean; onSelect: () => void }) {
  return (
    <button className={`device-card ${active ? "active" : ""}`} onClick={onSelect}>
      <div className="device-card-head">
        <div>
          <h3 className="device-name">{device.name}</h3>
          <p className="device-owner">{device.owner} · {device.type}</p>
        </div>
        <Badge value={device.status} />
      </div>
      <div className="device-meta">
        <Badge value={getRiskLevel(device.risk)}>{getRiskLevel(device.risk)} risk</Badge>
        <Badge value="info">{device.lastActivity}</Badge>
      </div>
      <RiskMeter score={device.risk} compact />
    </button>
  );
}
