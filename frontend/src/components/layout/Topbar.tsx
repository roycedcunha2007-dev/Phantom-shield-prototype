"use client";

import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Security Overview", subtitle: "Live posture, breach signals, and automated response state." },
  "/dashboard/devices": { title: "Device Monitoring", subtitle: "Monitor endpoint health, activity logs, and suspicious behavior." },
  "/dashboard/alerts": { title: "Alerts and Threats", subtitle: "Review active threats and execute containment actions." },
  "/dashboard/recommendations": { title: "AI Recommendation Engine", subtitle: "Recommendations derived from recorded security activity." },
};

// Component responsibility: route-aware page context and signed-in user display.
export function Topbar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{meta.title}</h1>
        <p className="page-subtitle">{meta.subtitle}</p>
      </div>
      <div className="topbar-actions">
        <span className="status-pill"><span className="status-dot" />System healthy</span>
        {user && (
          <div className="user-chip">
            <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <span className="user-meta">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role} on {user.device}</span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
