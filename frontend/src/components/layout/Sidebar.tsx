"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLockup } from "@/components/layout/BrandLockup";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/devices", label: "Devices" },
  { href: "/dashboard/alerts", label: "Alerts" },
  { href: "/dashboard/recommendations", label: "AI Engine" },
];

// Component responsibility: persistent dashboard navigation only.
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <BrandLockup caption="Security command center" />
      <nav className="nav-list" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? "active" : ""}`}>
            <span className="nav-icon" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="footer-label">Response automation</span>
        <span className="footer-value">Active and enforcing</span>
      </div>
    </aside>
  );
}
