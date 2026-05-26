const features = [
  ["alerts", "Real-time breach alerts", "Get notified when sensitive files move unusually, risky logins occur, or blocked behavior needs review."],
  ["risk", "Insider risk analysis", "Identify abnormal employee or shared-device behavior before it escalates into data exposure."],
  ["devices", "Multi-device monitoring", "Track laptops, tablets, kiosks, and mobile devices in one consistent operational view."],
  ["dashboard", "Live threat dashboard", "See active threats, risk scores, device posture, and response status without switching tools."],
  ["ai", "AI-powered recommendations", "Prioritize the next control to apply with plain-language explanations and suggested actions."],
  ["block", "Automated threat prevention", "Contain suspicious activity by resolving alerts, blocking transfers, and isolating devices from the UI."],
];

export function FeaturesSection() {
  return (
    <>
      <section className="landing-section" id="platform">
        <div className="landing-container two-column">
          <div>
            <p className="section-kicker">What Phantom Shield does</p>
            <h2>One operating layer for breach prevention, threat detection, and data protection.</h2>
          </div>
          <div className="section-copy">
            <p>Most SMBs discover security problems after data has already moved, credentials have already been abused, or a device has already been compromised. Phantom Shield watches the activity that matters across endpoints, users, and sensitive files so teams can act earlier.</p>
            <p>It turns device signals, insider activity, and threat alerts into a readable command center built for fast decisions, not specialist-only investigation.</p>
          </div>
        </div>
      </section>
      <section className="landing-section feature-section" id="features">
        <div className="landing-container">
          <div className="section-heading">
            <p className="section-kicker">Key features</p>
            <h2>Security controls that match the way modern SMBs work.</h2>
          </div>
          <div className="feature-grid">
            {features.map(([icon, title, description]) => (
              <article className="feature-card" key={title}>
                <span className={`feature-icon ${icon}`} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
