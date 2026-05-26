import { AuthForm } from "@/components/auth/AuthForm";
import { BrandLockup } from "@/components/layout/BrandLockup";

export default function AuthPage() {
  return (
    <main className="auth-screen">
      <section className="auth-hero">
        <BrandLockup caption="Security command center" />
        <div className="auth-copy">
          <h1>Breach prevention built for everyday business teams.</h1>
          <p>Monitor devices, detect insider risk, and block threats in real time through a focused security operations workspace.</p>
          <div className="signal-strip">
            <div className="signal-tile"><span className="signal-value">24/7</span><span className="signal-label">Live detection</span></div>
            <div className="signal-tile"><span className="signal-value">4.8s</span><span className="signal-label">Median response</span></div>
            <div className="signal-tile"><span className="signal-value">128</span><span className="signal-label">Controls mapped</span></div>
          </div>
        </div>
      </section>
      <section className="auth-panel"><AuthForm /></section>
    </main>
  );
}
