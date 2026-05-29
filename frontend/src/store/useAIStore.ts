"use client";

import { create } from "zustand";
import type { AIAnalysis, AIRecommendation } from "@/types";

interface AIState {
  analyses: AIAnalysis[];
  recommendations: AIRecommendation[];
  organizationRiskScore: number;
  setAIInsights: (analyses: AIAnalysis[], organizationRiskScore: number) => void;
  setAIRecommendations: (recommendations: AIRecommendation[]) => void;
  addAnalysis: (analysis: AIAnalysis) => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  analyses: [],
  recommendations: [],
  organizationRiskScore: 0,
  setAIInsights: (analyses, organizationRiskScore) => set({ analyses, organizationRiskScore }),
  setAIRecommendations: (recommendations) => set({ recommendations }),
  addAnalysis: (analysis) => {
    const recommendations = analysis.recommendations ?? [];
    set({
      analyses: [analysis, ...get().analyses.filter((item) => item.id !== analysis.id)].slice(0, 50),
      recommendations: [
        ...recommendations,
        ...get().recommendations.filter((item) => !recommendations.some((next) => next.id === item.id)),
      ].slice(0, 50),
      organizationRiskScore: analysis.organizationRiskScore,
    });
  },
}));
