"use client";

import { useEffect } from "react";
import { getAlerts } from "@/services/alertService";
import { getAIRecommendations, getAIRisk } from "@/services/aiService";
import { getDevices } from "@/services/deviceService";
import { getRecommendations } from "@/services/recommendationService";
import { useAIStore } from "@/store/useAIStore";
import { useAlertStore } from "@/store/useAlertStore";
import { useDeviceStore } from "@/store/useDeviceStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";

// Mounts global dashboard-side effects once instead of coupling them to a single screen.
export function DashboardRuntime() {
  const setDevices = useDeviceStore((state) => state.setDevices);
  const setAlerts = useAlertStore((state) => state.setAlerts);
  const setRecommendations = useRecommendationStore((state) => state.setRecommendations);
  const setAIInsights = useAIStore((state) => state.setAIInsights);
  const setAIRecommendations = useAIStore((state) => state.setAIRecommendations);

    useEffect(() => {
    let mounted = true;
    Promise.all([getDevices(), getAlerts(), getRecommendations(), getAIRisk(), getAIRecommendations()]).then(([devices, alerts, recommendations, aiRisk, aiRecommendations]) => {
      if (!mounted) return;
      setDevices(devices);
      setAlerts(alerts);
      setRecommendations(recommendations);
      setAIInsights(aiRisk.items, aiRisk.organizationRiskScore);
      setAIRecommendations(aiRecommendations);
    });
    
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "device_connected") {
          // Check if device already exists to prevent duplicates, or just use update logic
          useDeviceStore.getState().setDevices([...useDeviceStore.getState().devices.filter(d => d.id !== data.payload.id), data.payload]);
        } else if (data.type === "heartbeat_received") {
          useDeviceStore.getState().updateDevice(data.payload.device_id, {
            status: "Online",
            lastActivity: "Just now",
            // In a real app we might store cpu/memory somewhere or update a specific graph
          });
        } else if (data.type === "new_security_event") {
          useAlertStore.getState().addFeedItem({
            title: data.payload.event_type,
            time: "Just now",
            body: `${data.payload.description} on ${data.payload.device_id}`
          });
        } else if (data.type === "high_risk_alert") {
          useAlertStore.getState().addAlert({
            id: data.payload.id,
            type: data.payload.type,
            severity: data.payload.severity,
            status: "Open",
            deviceId: data.payload.device_id,
            timestamp: "Just now",
            ipAddress: "",
            openedTabs: [],
            suspiciousBehaviors: [],
            highAlertReason: data.payload.reason ?? ""
          }, {
            title: `New ${data.payload.severity} alert created`,
            time: "Just now",
            body: `${data.payload.type} on ${data.payload.device_id}`
          });
          useDeviceStore.getState().updateAllRisks(10, 0); // Simplified risk bump
        } else if (data.type === "device_offline") {
          useDeviceStore.getState().updateDevice(data.payload.device_id, {
            status: "Offline",
            lastActivity: "Offline"
          });
        } else if (data.type === "ai_analysis_updated") {
          useAIStore.getState().addAnalysis(data.payload);
          useDeviceStore.getState().updateDevice(data.payload.deviceId, {
            risk: Math.round(data.payload.riskScore)
          });
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };

    return () => {
      mounted = false;
      ws.close();
    };
  }, [setAIInsights, setAIRecommendations, setAlerts, setDevices, setRecommendations]);

  return null;
}
