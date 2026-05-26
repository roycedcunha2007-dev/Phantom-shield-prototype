"use client";

import { AlertTable } from "@/components/alerts/AlertTable";

export default function AlertsPage() {
  return (
    <div className="view">
      <section className="panel">
        <div className="panel-header">
          <div><h2 className="panel-title">Threat Queue</h2><p className="panel-subtitle">Review suspicious activity, inspect evidence, and block or unblock accounts when needed.</p></div>
        </div>
        <AlertTable />
      </section>
    </div>
  );
}
