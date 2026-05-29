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
      
      {active && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button 
            onClick={(e) => { e.stopPropagation(); alert(`Simulated network isolation for ${device.name}`); }} 
            style={{ padding: "0.5rem", background: "var(--danger)", color: "white", border: "none", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}
          >
            Quarantine Device
          </button>
        </div>
      )}
    </button>
  );
}
