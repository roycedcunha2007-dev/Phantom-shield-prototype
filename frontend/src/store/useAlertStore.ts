"use client";

import { create } from "zustand";
import type { ActivityFeedItem, Alert, AlertStatus } from "@/types";

interface AlertState {
  alerts: Alert[];
  feed: ActivityFeedItem[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert, feedItem: ActivityFeedItem) => void;
  updateAlertStatus: (id: string, status: AlertStatus, feedItem: ActivityFeedItem) => void;
  addFeedItem: (item: ActivityFeedItem) => void;
}

// Store responsibility: alert queue plus activity feed entries created by alert workflows.
export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  feed: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert, feedItem) => set((state) => ({ alerts: [alert, ...state.alerts], feed: [feedItem, ...state.feed] })),
  updateAlertStatus: (id, status, feedItem) =>
    set((state) => ({
      alerts: state.alerts.map((alert) => (alert.id === id ? { ...alert, status } : alert)),
      feed: [feedItem, ...state.feed],
    })),
  addFeedItem: (item) => set((state) => ({ feed: [item, ...state.feed] })),
}));
