"use client";

import { create } from "zustand";
import type { Recommendation } from "@/types";

interface RecommendationState {
  recommendations: Recommendation[];
  setRecommendations: (recommendations: Recommendation[]) => void;
  applyRecommendation: (id: string) => Recommendation | undefined;
}

// Store responsibility: recommendation state and applied-status mutations.
export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: [],
  setRecommendations: (recommendations) => set({ recommendations }),
  applyRecommendation: (id) => {
    const recommendation = get().recommendations.find((item) => item.id === id);
    if (!recommendation || recommendation.applied) return recommendation;
    set((state) => ({
      recommendations: state.recommendations.map((item) => (item.id === id ? { ...item, applied: true } : item)),
    }));
    return recommendation;
  },
}));
