"use client";

import type { Role } from "@/types";

export function RoleToggle({ selectedRole, onChange }: { selectedRole: Role; onChange: (role: Role) => void }) {
  return (
    <div className="role-toggle" role="tablist" aria-label="Select role">
      {(["Employee", "Admin"] as Role[]).map((role) => (
        <button key={role} type="button" className={`role-option ${selectedRole === role ? "active" : ""}`} onClick={() => onChange(role)}>
          {role}
        </button>
      ))}
    </div>
  );
}
