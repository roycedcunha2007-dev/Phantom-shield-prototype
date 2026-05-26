"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

const plans = [
  { name: "Basic", description: "For small teams getting device visibility and breach awareness in place.", included: ["Up to 25 monitored devices", "Core breach alerts", "Device status tracking", "Activity feed", "Email alert summaries"], excluded: ["AI recommendations", "Automated threat blocking", "Advanced insider risk scoring"], featured: false },
  { name: "Advanced", description: "For growing businesses that need active detection, risk scoring, and guided response.", included: ["Up to 100 monitored devices", "Real-time breach alerts", "Insider risk analysis", "Live threat dashboard", "AI-powered recommendations", "Priority policy templates"], excluded: ["Custom compliance reporting", "Dedicated response workflow design"], featured: true },
  { name: "Premium", description: "For teams standardizing prevention, response, and security operations across the business.", included: ["Unlimited monitored devices", "Automated threat blocking", "Advanced AI recommendations", "Custom policy recommendations", "Executive risk reporting", "Priority support workflows"], excluded: ["On-site incident response", "Custom enterprise integrations"], featured: false },
];

const guidelines: Record<string, string[]> = {
  Basic: ["Best suited for smaller teams beginning with device visibility and breach awareness.", "Keep an estimate of the number of devices you want monitored ready before enquiring.", "Ask about alert setup, onboarding time, and whether your current devices are supported."],
  Advanced: ["Recommended for growing businesses that need active detection and guided response.", "Be ready to discuss your current device count, insider-risk concerns, and alert workflow.", "Ask about AI recommendations, dashboard access, and rollout support for your team."],
  Premium: ["Designed for teams that want broader prevention, automation, and reporting coverage.", "Prepare your expected scale, policy needs, and any reporting or workflow requirements.", "Ask about automated blocking, support expectations, and customization options."],
};

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const whatsappUrl = selectedPlan
    ? `https://wa.me/919930868762?text=${encodeURIComponent(`Hello, I would like to enquire about the ${selectedPlan} plan for Phantom Shield.`)}`
    : "";

  return (
    <>
      <section className="landing-section">
        <div className="landing-container">
          <div className="section-heading">
            <p className="section-kicker">How it works</p>
            <h2>A clear path from visibility to action.</h2>
          </div>
          <div className="steps-grid">
            {[
              ["01", "Connect devices", "Enroll company endpoints and shared systems so Phantom Shield can observe security posture and activity."],
              ["02", "Monitor activity", "Track file movement, login behavior, device status, and policy signals in real time."],
              ["03", "Detect anomalies", "Surface unusual data access, insider risk patterns, and threat indicators with severity context."],
              ["04", "Take action", "Resolve alerts, block risky activity, and apply recommended controls before damage spreads."],
            ].map(([number, title, copy]) => (
              <article className="step-card" key={title}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="landing-section why-section">
        <div className="landing-container two-column">
          <div>
            <p className="section-kicker">Why it matters</p>
            <h2>SMBs are exposed to enterprise-level threats without enterprise-level security teams.</h2>
          </div>
          <div className="problem-list">
            <article><h3>Breaches move faster than manual review</h3><p>Customer records, invoices, and credentials can leave the business long before someone checks audit logs.</p></article>
            <article><h3>Internal risk is often invisible</h3><p>Shared devices, unusual access, and policy gaps create exposure even when no external attacker is present.</p></article>
            <article><h3>Security tools are hard to operate</h3><p>Phantom Shield focuses attention on plain-language alerts, clear risk scores, and practical prevention steps.</p></article>
          </div>
        </div>
      </section>
      <section className="landing-section" id="pricing">
        <div className="landing-container">
          <div className="section-heading">
            <p className="section-kicker">Plan enquiries</p>
            <h2>Choose the plan that fits, then enquire for details.</h2>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
                <div>
                  <span className="pricing-label">{plan.featured ? "Most useful" : "Enquire plan"}</span>
                  <h3>{plan.name}</h3>
                  <div className="plan-enquiry">Enquire for plan details</div>
                  <p>{plan.description}</p>
                </div>
                <div className="plan-details">
                  <div><h4>Included</h4><ul className="included-list">{plan.included.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h4>Not included</h4><ul className="excluded-list">{plan.excluded.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
                <Button onClick={() => setSelectedPlan(plan.name)}>Enquire about {plan.name}</Button>
              </article>
            ))}
          </div>
        </div>
      </section>
      {selectedPlan && (
        <Modal overlayClassName="enquiry-modal" dialogClassName="enquiry-dialog" onClose={() => setSelectedPlan(null)}>
          <button className="enquiry-close" type="button" aria-label="Close enquiry guidelines" onClick={() => setSelectedPlan(null)}>&times;</button>
          <p className="section-kicker">Before you enquire</p>
          <h3>{selectedPlan} plan guidelines</h3>
          <ul>{guidelines[selectedPlan].map((item) => <li key={item}>{item}</li>)}</ul>
          <a className="primary-btn enquiry-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>
        </Modal>
      )}
    </>
  );
}
