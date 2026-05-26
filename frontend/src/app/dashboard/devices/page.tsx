"use client";

import { Badge } from "@/components/common/Badge";
import { DeviceList } from "@/components/devices/DeviceList";
import { RiskMeter } from "@/components/devices/RiskMeter";
import { useDeviceStore } from "@/store/useDeviceStore";
import { getRiskLevel } from "@/utils/risk";

export default function DevicesPage() {
  const devices = useDeviceStore((state) => state.devices);
  const selectedDeviceId = useDeviceStore((state) => state.selectedDeviceId);
  const selected = devices.find((device) => device.id === selectedDeviceId) ?? devices[0];

  if (!selected) {
    return <div className="view"><section className="panel">Loading monitored devices...</section></div>;
  }

  return (
    <div className="view device-layout">
      <section className="panel">
        <div className="panel-header">
          <div><h2 className="panel-title">Monitored Devices</h2><p className="panel-subtitle">Select an asset to inspect logs and risk drivers.</p></div>
        </div>
        <DeviceList />
      </section>
      <section className="panel">
        <div className="panel-header">
          <div><h2 className="panel-title">{selected.name}</h2><p className="panel-subtitle">{selected.owner} · {selected.type} · Last activity {selected.lastActivity}</p></div>
          <Badge value={getRiskLevel(selected.risk)}>{getRiskLevel(selected.risk)} risk</Badge>
        </div>
        <RiskMeter score={selected.risk} />
        <div className="log-list device-logs">
          {selected.logs.map((log, index) => (
            <article className={`log-item ${log.suspicious ? "suspicious" : ""}`} key={`${log.time}-${index}`}>
              <div className="item-topline"><span className="item-title">{log.title}</span><span className="item-time">{log.time}</span></div>
              <p className="item-body">{log.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
