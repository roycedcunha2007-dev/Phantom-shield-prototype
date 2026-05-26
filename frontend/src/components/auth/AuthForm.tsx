"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { RoleToggle } from "@/components/auth/RoleToggle";
import { UserInput } from "@/components/auth/UserInput";
import { useUserStore } from "@/store/useUserStore";

// Component responsibility: preserve the current role/name/device entry workflow.
export function AuthForm() {
  const router = useRouter();
  const selectedRole = useUserStore((state) => state.selectedRole);
  const setSelectedRole = useUserStore((state) => state.setSelectedRole);
  const login = useUserStore((state) => state.login);
  const [name, setName] = useState("");
  const [device, setDevice] = useState("");
  const [showError, setShowError] = useState(false);

  return (
    <form className="auth-card" onSubmit={(event) => {
      event.preventDefault();
      if (!name.trim() || !device.trim()) {
        setShowError(true);
        return;
      }
      login({ name: name.trim(), device: device.trim(), role: selectedRole });
      router.push("/dashboard");
    }}>
      <p className="section-kicker">Secure access</p>
      <h2>Open your workspace</h2>
      <p>Choose your operating role and identify the device joining the monitoring session.</p>
      <RoleToggle selectedRole={selectedRole} onChange={setSelectedRole} />
      <p className={`error-message ${showError ? "visible" : ""}`}>Enter both your name and device name to continue.</p>
      <UserInput id="nameInput" label="Full name" placeholder="Your full name" autoComplete="name" value={name} onChange={setName} />
      <UserInput id="deviceInput" label="Device name" placeholder="Your device name" value={device} onChange={setDevice} />
      <Button variant="primary" type="submit">Enter dashboard</Button>
    </form>
  );
}
