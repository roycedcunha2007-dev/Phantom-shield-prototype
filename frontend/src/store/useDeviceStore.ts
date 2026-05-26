"use client";

import { create } from "zustand";
import type { Device } from "@/types";

interface DeviceState {
  devices: Device[];
  selectedDeviceId: string;
  setDevices: (devices: Device[]) => void;
  setSelectedDeviceId: (id: string) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  updateAllRisks: (delta: number, floor: number) => void;
}

// Store responsibility: monitored device state and localized device mutations.
export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  selectedDeviceId: "",
  setDevices: (devices) => set({ devices, selectedDeviceId: devices[0]?.id ?? "" }),
  setSelectedDeviceId: (selectedDeviceId) => set({ selectedDeviceId }),
  updateDevice: (id, updates) =>
    set((state) => ({
      devices: state.devices.map((device) => (device.id === id ? { ...device, ...updates } : device)),
    })),
  updateAllRisks: (delta, floor) =>
    set((state) => ({
      devices: state.devices.map((device) => ({ ...device, risk: Math.max(floor, device.risk + delta) })),
    })),
}));
