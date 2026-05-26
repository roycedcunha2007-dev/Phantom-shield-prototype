import Link from "next/link";
import { BrandLockup } from "@/components/layout/BrandLockup";

// Component responsibility: landing navigation and hero entry path.
export function HeroSection() {
  return (
    <>
      <header className="landing-nav">
        <a href="#home" aria-label="Phantom Shield home"><BrandLockup caption="SMB cyber defense" /></a>
        <nav className="landing-links" aria-label="Landing page navigation">
          <a href="#platform">Platform</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <Link className="secondary-btn compact" href="/auth">Sign in</Link>
      </header>
      <section className="landing-hero" id="home">
        <div className="landing-container hero-content">
          <p className="section-kicker">Proactive security for growing teams</p>
          <h1>Stop data breaches before they become business crises.</h1>
          <p className="hero-subtitle">Phantom Shield helps small and medium-sized businesses monitor devices, detect insider risk, and block suspicious activity from one clear security workspace.</p>
          <div className="hero-actions">
            <Link className="primary-btn hero-cta" href="/auth">Secure Your System</Link>
            <a className="text-link" href="#platform">See how it works</a>
          </div>
          <div className="hero-proof">
            <span><strong>Real-time alerts</strong> for high-risk behavior</span>
            <span><strong>Device-wide visibility</strong> without enterprise complexity</span>
            <span><strong>Automated blocking</strong> for critical threats</span>
          </div>
        </div>
      </section>
    </>
  );
}
