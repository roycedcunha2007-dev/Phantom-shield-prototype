"use client";

import { useEffect } from "react";
import { getAlerts } from "@/services/alertService";
import { getDevices } from "@/services/deviceService";
import { getRecommendations } from "@/services/recommendationService";
import { useAlertStore } from "@/store/useAlertStore";
import { useDeviceStore } from "@/store/useDeviceStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";

// Mounts global dashboard-side effects once instead of coupling them to a single screen.
export function DashboardRuntime() {
  const setDevices = useDeviceStore((state) => state.setDevices);
  const setAlerts = useAlertStore((state) => state.setAlerts);
  const setRecommendations = useRecommendationStore((state) => state.setRecommendations);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDevices(), getAlerts(), getRecommendations()]).then(([devices, alerts, recommendations]) => {
      if (!mounted) return;
      setDevices(devices);
      setAlerts(alerts);
      setRecommendations(recommendations);
    });
    return () => {
      mounted = false;
    };
  }, [setAlerts, setDevices, setRecommendations]);

  return null;
}
