"use client";

import { DeviceCard } from "@/components/devices/DeviceCard";
import { useDeviceStore } from "@/store/useDeviceStore";

// Component responsibility: selection list only; details panel subscribes separately.
export function DeviceList() {
  const devices = useDeviceStore((state) => state.devices);
  const selectedDeviceId = useDeviceStore((state) => state.selectedDeviceId);
  const setSelectedDeviceId = useDeviceStore((state) => state.setSelectedDeviceId);
  return (
    <div className="device-list">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} active={device.id === selectedDeviceId} onSelect={() => setSelectedDeviceId(device.id)} />
      ))}
    </div>
  );
}
