"use client";

import { useMemo } from "react";
import { useDeviceStore } from "@/store/useDeviceStore";
import { getRiskLevel } from "@/utils/risk";

// Derived business logic kept outside components for reuse and easy backend replacement later.
export function useRiskCalculation() {
  const devices = useDeviceStore((state) => state.devices);
  return useMemo(() => {
    if (!devices.length) return { averageRisk: 0, averageRiskLevel: getRiskLevel(0) };
    const total = devices.reduce((sum, device) => sum + device.risk, 0);
    const averageRisk = Math.round(total / devices.length);
    return { averageRisk, averageRiskLevel: getRiskLevel(averageRisk) };
  }, [devices]);
}
