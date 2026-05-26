import Link from "next/link";

export function CTASection() {
  return (
    <section className="landing-cta">
      <div className="landing-container cta-inner">
        <p className="section-kicker">Ready for a safer operating day</p>
        <h2>Start protecting your business today.</h2>
        <p>Open the Phantom Shield workspace and see how breach alerts, device monitoring, insider risk, and automated response work together.</p>
        <Link className="primary-btn hero-cta" href="/auth">Get Started</Link>
      </div>
    </section>
  );
}
