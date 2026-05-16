(function () {
  "use strict";

  const app = document.getElementById("app");

  const mockData = {
    user: null,
    route: "overview",
    selectedRole: "Admin",
    selectedDeviceId: "dev-001",
    simulationTick: 0,
    devices: [
      {
        id: "dev-001",
        name: "Finance-Laptop-07",
        owner: "Maya Singh",
        type: "Windows endpoint",
        status: "Online",
        risk: 72,
        lastActivity: "2 min ago",
        logs: [
          { time: "09:42", title: "Unusual export volume", detail: "1.8 GB copied from billing archive to local Downloads.", suspicious: true },
          { time: "09:31", title: "VPN re-authenticated", detail: "Device restored secure tunnel through Mumbai gateway.", suspicious: false },
          { time: "09:15", title: "Policy sync", detail: "Endpoint received updated DLP rule set.", suspicious: false }
        ]
      },
      {
        id: "dev-002",
        name: "Ops-Tablet-03",
        owner: "Arjun Mehta",
        type: "iPadOS mobile",
        status: "Online",
        risk: 31,
        lastActivity: "6 min ago",
        logs: [
          { time: "09:38", title: "Location changed", detail: "Device moved from office network to managed LTE.", suspicious: false },
          { time: "09:21", title: "Application check", detail: "Inventory scan found all required security agents active.", suspicious: false }
        ]
      },
      {
        id: "dev-003",
        name: "Sales-MacBook-11",
        owner: "Neha Kapoor",
        type: "macOS endpoint",
        status: "Online",
        risk: 48,
        lastActivity: "1 min ago",
        logs: [
          { time: "09:46", title: "New SaaS session", detail: "CRM login verified with compliant device posture.", suspicious: false },
          { time: "09:04", title: "Attachment scan", detail: "Inbound proposal file cleared sandbox inspection.", suspicious: false }
        ]
      },
      {
        id: "dev-004",
        name: "Warehouse-PC-02",
        owner: "Shared kiosk",
        type: "Windows kiosk",
        status: "Quarantined",
        risk: 91,
        lastActivity: "11 min ago",
        logs: [
          { time: "09:29", title: "Command shell opened", detail: "Unexpected script attempted privilege escalation.", suspicious: true },
          { time: "09:28", title: "Network isolation", detail: "Automated containment moved device to quarantine VLAN.", suspicious: true }
        ]
      }
    ],
    alerts: [
      {
        id: "alt-001",
        type: "Data exfiltration pattern",
        severity: "Critical",
        timestamp: "09:42",
        status: "Investigating",
        deviceId: "dev-001",
        ipAddress: "103.214.67.18",
        openedTabs: ["Billing archive", "Payroll export", "External cloud storage"],
        suspiciousBehaviors: ["Copied 1.8 GB of files in 7 minutes", "Accessed payroll records outside normal hours", "Attempted upload to an unapproved destination"],
        highAlertReason: "Large-volume sensitive data movement matched an exfiltration pattern and crossed the critical policy threshold."
      },
      {
        id: "alt-002",
        type: "Privilege escalation attempt",
        severity: "High",
        timestamp: "09:29",
        status: "Blocked",
        deviceId: "dev-004",
        ipAddress: "10.24.18.42",
        openedTabs: ["Local admin console", "PowerShell history", "System settings"],
        suspiciousBehaviors: ["Unexpected script launched", "Privilege escalation command detected", "Device attempted lateral access after the script ran"],
        highAlertReason: "The device attempted elevated execution and was automatically quarantined to prevent spread."
      },
      {
        id: "alt-003",
        type: "Impossible travel login",
        severity: "Medium",
        timestamp: "08:57",
        status: "Investigating",
        deviceId: "dev-003",
        ipAddress: "185.72.91.204",
        openedTabs: ["CRM dashboard", "Lead export", "Account settings"],
        suspiciousBehaviors: ["Login location changed too quickly to be physically possible", "Session opened after a recent login from another region", "MFA challenge was delayed"],
        highAlertReason: "The account showed a location anomaly consistent with possible credential misuse."
      },
      {
        id: "alt-004",
        type: "Sensitive file shared externally",
        severity: "High",
        timestamp: "08:31",
        status: "Open",
        deviceId: "dev-001",
        ipAddress: "103.214.67.18",
        openedTabs: ["Invoice folder", "Vendor contracts", "Public share settings"],
        suspiciousBehaviors: ["External share link created", "Restricted folder accessed repeatedly", "Link permissions widened beyond policy"],
        highAlertReason: "A sensitive file was exposed outside the company boundary with permissive sharing settings."
      }
    ],
    recommendations: [
      {
        id: "rec-001",
        title: "Tighten finance data movement policy",
        severity: "High",
        explanation: "Finance-Laptop-07 copied a high-volume billing archive outside the normal accounting window.",
        action: "Apply DLP rule",
        applied: false
      },
      {
        id: "rec-002",
        title: "Require step-up verification for CRM sessions",
        severity: "Medium",
        explanation: "The sales account had a login pattern consistent with impossible travel within a short interval.",
        action: "Enforce MFA",
        applied: false
      },
      {
        id: "rec-003",
        title: "Keep kiosk endpoints in restricted mode",
        severity: "Critical",
        explanation: "Warehouse-PC-02 attempted elevated script execution and is already isolated from production systems.",
        action: "Extend quarantine",
        applied: false
      }
    ],
    feed: [
      { title: "Automated block completed", time: "09:43", body: "Outbound transfer from Finance-Laptop-07 was stopped before external upload finished." },
      { title: "Insider risk score changed", time: "09:42", body: "Maya Singh moved from moderate to elevated risk due to unusual archive movement." },
      { title: "Threat intelligence updated", time: "09:36", body: "New indicators added for credential phishing kits targeting SMB finance teams." },
      { title: "Device quarantine confirmed", time: "09:29", body: "Warehouse-PC-02 was moved to a restricted network segment." }
    ]
  };

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "devices", label: "Devices" },
    { id: "alerts", label: "Alerts" },
    { id: "recommendations", label: "AI Engine" }
  ];

  const threatTypes = ["Data Loss", "Credential Risk", "Malware", "Policy Drift"];

  function getRiskLevel(score) {
    if (score >= 80) return "Critical";
    if (score >= 60) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  }

  function className(value) {
    return String(value).toLowerCase().replace(/\s+/g, "-");
  }

  function getDevice(id) {
    return mockData.devices.find((device) => device.id === id) || mockData.devices[0];
  }

  function activeAlerts() {
    return mockData.alerts.filter((alert) => !["Resolved", "Blocked"].includes(alert.status));
  }

  function averageRisk() {
    const total = mockData.devices.reduce((sum, device) => sum + device.risk, 0);
    return Math.round(total / mockData.devices.length);
  }

  function renderLanding() {
    app.innerHTML = `
      <main class="landing-page">
        <header class="landing-nav">
          <a class="brand-lockup" href="#home" aria-label="Phantom Shield home">
            <span class="brand-mark">PS</span>
            <span class="brand-text">
              <span class="brand-name">Phantom Shield</span>
              <span class="brand-caption">SMB cyber defense</span>
            </span>
          </a>
          <nav class="landing-links" aria-label="Landing page navigation">
            <a href="#platform">Platform</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <button class="secondary-btn compact" data-enter-app>Sign in</button>
        </header>

        <section class="landing-hero" id="home">
          <div class="landing-container hero-content">
            <p class="section-kicker">Proactive security for growing teams</p>
            <h1>Stop data breaches before they become business crises.</h1>
            <p class="hero-subtitle">Phantom Shield helps small and medium-sized businesses monitor devices, detect insider risk, and block suspicious activity from one clear security workspace.</p>
            <div class="hero-actions">
              <button class="primary-btn hero-cta" data-enter-app>Secure Your System</button>
              <a class="text-link" href="#platform">See how it works</a>
            </div>
            <div class="hero-proof">
              <span><strong>Real-time alerts</strong> for high-risk behavior</span>
              <span><strong>Device-wide visibility</strong> without enterprise complexity</span>
              <span><strong>Automated blocking</strong> for critical threats</span>
            </div>
          </div>
        </section>

        <section class="landing-section" id="platform">
          <div class="landing-container two-column">
            <div>
              <p class="section-kicker">What Phantom Shield does</p>
              <h2>One operating layer for breach prevention, threat detection, and data protection.</h2>
            </div>
            <div class="section-copy">
              <p>Most SMBs discover security problems after data has already moved, credentials have already been abused, or a device has already been compromised. Phantom Shield watches the activity that matters across endpoints, users, and sensitive files so teams can act earlier.</p>
              <p>It turns device signals, insider activity, and threat alerts into a readable command center built for fast decisions, not specialist-only investigation.</p>
            </div>
          </div>
        </section>

        <section class="landing-section feature-section" id="features">
          <div class="landing-container">
            <div class="section-heading">
              <p class="section-kicker">Key features</p>
              <h2>Security controls that match the way modern SMBs work.</h2>
            </div>
            <div class="feature-grid">
              ${landingFeature("alerts", "Real-time breach alerts", "Get notified when sensitive files move unusually, risky logins occur, or blocked behavior needs review.")}
              ${landingFeature("risk", "Insider risk analysis", "Identify abnormal employee or shared-device behavior before it escalates into data exposure.")}
              ${landingFeature("devices", "Multi-device monitoring", "Track laptops, tablets, kiosks, and mobile devices in one consistent operational view.")}
              ${landingFeature("dashboard", "Live threat dashboard", "See active threats, risk scores, device posture, and response status without switching tools.")}
              ${landingFeature("ai", "AI-powered recommendations", "Prioritize the next control to apply with plain-language explanations and suggested actions.")}
              ${landingFeature("block", "Automated threat prevention", "Contain suspicious activity by resolving alerts, blocking transfers, and isolating devices from the UI.")}
            </div>
          </div>
        </section>

        <section class="landing-section">
          <div class="landing-container">
            <div class="section-heading">
              <p class="section-kicker">How it works</p>
              <h2>A clear path from visibility to action.</h2>
            </div>
            <div class="steps-grid">
              ${landingStep("01", "Connect devices", "Enroll company endpoints and shared systems so Phantom Shield can observe security posture and activity.")}
              ${landingStep("02", "Monitor activity", "Track file movement, login behavior, device status, and policy signals in real time.")}
              ${landingStep("03", "Detect anomalies", "Surface unusual data access, insider risk patterns, and threat indicators with severity context.")}
              ${landingStep("04", "Take action", "Resolve alerts, block risky activity, and apply recommended controls before damage spreads.")}
            </div>
          </div>
        </section>

        <section class="landing-section why-section">
          <div class="landing-container two-column">
            <div>
              <p class="section-kicker">Why it matters</p>
              <h2>SMBs are exposed to enterprise-level threats without enterprise-level security teams.</h2>
            </div>
            <div class="problem-list">
              <article>
                <h3>Breaches move faster than manual review</h3>
                <p>Customer records, invoices, and credentials can leave the business long before someone checks audit logs.</p>
              </article>
              <article>
                <h3>Internal risk is often invisible</h3>
                <p>Shared devices, unusual access, and policy gaps create exposure even when no external attacker is present.</p>
              </article>
              <article>
                <h3>Security tools are hard to operate</h3>
                <p>Phantom Shield focuses attention on plain-language alerts, clear risk scores, and practical prevention steps.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="landing-section" id="pricing">
          <div class="landing-container">
            <div class="section-heading">
              <p class="section-kicker">Plan enquiries</p>
              <h2>Choose the plan that fits, then enquire for details.</h2>
            </div>
            <div class="pricing-grid">
              ${pricingCard({
                name: "Basic",
                description: "For small teams getting device visibility and breach awareness in place.",
                included: ["Up to 25 monitored devices", "Core breach alerts", "Device status tracking", "Activity feed", "Email alert summaries"],
                excluded: ["AI recommendations", "Automated threat blocking", "Advanced insider risk scoring"],
                featured: false
              })}
              ${pricingCard({
                name: "Advanced",
                description: "For growing businesses that need active detection, risk scoring, and guided response.",
                included: ["Up to 100 monitored devices", "Real-time breach alerts", "Insider risk analysis", "Live threat dashboard", "AI-powered recommendations", "Priority policy templates"],
                excluded: ["Custom compliance reporting", "Dedicated response workflow design"],
                featured: true
              })}
              ${pricingCard({
                name: "Premium",
                description: "For teams standardizing prevention, response, and security operations across the business.",
                included: ["Unlimited monitored devices", "Automated threat blocking", "Advanced AI recommendations", "Custom policy recommendations", "Executive risk reporting", "Priority support workflows"],
                excluded: ["On-site incident response", "Custom enterprise integrations"],
                featured: false
              })}
            </div>
          </div>
        </section>

        <section class="landing-cta">
          <div class="landing-container cta-inner">
            <p class="section-kicker">Ready for a safer operating day</p>
            <h2>Start protecting your business today.</h2>
            <p>Open the Phantom Shield workspace and see how breach alerts, device monitoring, insider risk, and automated response work together.</p>
            <button class="primary-btn hero-cta" data-enter-app>Get Started</button>
          </div>
        </section>
      </main>
    `;

    app.querySelectorAll("[data-enter-app]").forEach((button) => {
      button.addEventListener("click", renderAuth);
    });

    app.querySelectorAll("[data-enquire-plan]").forEach((button) => {
      button.addEventListener("click", () => openPlanEnquiry(button.dataset.enquirePlan));
    });
  }

  function landingFeature(icon, title, description) {
    return `
      <article class="feature-card">
        <span class="feature-icon ${icon}" aria-hidden="true"></span>
        <h3>${title}</h3>
        <p>${description}</p>
      </article>
    `;
  }

  function landingStep(number, title, description) {
    return `
      <article class="step-card">
        <span class="step-number">${number}</span>
        <h3>${title}</h3>
        <p>${description}</p>
      </article>
    `;
  }

  function pricingCard(plan) {
    return `
      <article class="pricing-card ${plan.featured ? "featured" : ""}">
        <div>
          <span class="pricing-label">${plan.featured ? "Most useful" : "Enquire plan"}</span>
          <h3>${plan.name}</h3>
          <div class="plan-enquiry">Enquire for plan details</div>
          <p>${plan.description}</p>
        </div>
        <div class="plan-details">
          <div>
            <h4>Included</h4>
            <ul class="included-list">
              ${plan.included.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>Not included</h4>
            <ul class="excluded-list">
              ${plan.excluded.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        </div>
        <button class="secondary-btn" data-enquire-plan="${plan.name}">Enquire about ${plan.name}</button>
      </article>
    `;
  }

  function planGuidelines(planName) {
    return {
      Basic: [
        "Best suited for smaller teams beginning with device visibility and breach awareness.",
        "Keep an estimate of the number of devices you want monitored ready before enquiring.",
        "Ask about alert setup, onboarding time, and whether your current devices are supported."
      ],
      Advanced: [
        "Recommended for growing businesses that need active detection and guided response.",
        "Be ready to discuss your current device count, insider-risk concerns, and alert workflow.",
        "Ask about AI recommendations, dashboard access, and rollout support for your team."
      ],
      Premium: [
        "Designed for teams that want broader prevention, automation, and reporting coverage.",
        "Prepare your expected scale, policy needs, and any reporting or workflow requirements.",
        "Ask about automated blocking, support expectations, and customization options."
      ]
    }[planName] || [];
  }

  function openPlanEnquiry(planName) {
    const existingModal = document.querySelector(".enquiry-modal");
    if (existingModal) existingModal.remove();

    const message = encodeURIComponent(`Hello, I would like to enquire about the ${planName} plan for Phantom Shield.`);
    const whatsappUrl = `https://wa.me/919930868762?text=${message}`;

    const modal = document.createElement("div");
    modal.className = "enquiry-modal";
    modal.innerHTML = `
      <div class="enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
        <button class="enquiry-close" type="button" aria-label="Close enquiry guidelines">&times;</button>
        <p class="section-kicker">Before you enquire</p>
        <h3 id="enquiry-title">${planName} plan guidelines</h3>
        <ul>
          ${planGuidelines(planName).map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <a class="primary-btn enquiry-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
          Continue on WhatsApp
        </a>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest(".enquiry-close")) {
        modal.remove();
      }
    });
  }

  function renderAuth() {
    app.innerHTML = `
      <main class="auth-screen">
        <section class="auth-hero">
          <div class="brand-lockup">
            <span class="brand-mark">PS</span>
            <span class="brand-text">
              <span class="brand-name">Phantom Shield</span>
              <span class="brand-caption">Security command center</span>
            </span>
          </div>
          <div class="auth-copy">
            <h1>Breach prevention built for everyday business teams.</h1>
            <p>Monitor devices, detect insider risk, and block threats in real time through a focused security operations workspace.</p>
            <div class="signal-strip">
              <div class="signal-tile"><span class="signal-value">24/7</span><span class="signal-label">Live detection</span></div>
              <div class="signal-tile"><span class="signal-value">4.8s</span><span class="signal-label">Median response</span></div>
              <div class="signal-tile"><span class="signal-value">128</span><span class="signal-label">Controls mapped</span></div>
            </div>
          </div>
        </section>
        <section class="auth-panel">
          <form class="auth-card" id="authForm">
            <p class="section-kicker">Secure access</p>
            <h2>Open your workspace</h2>
            <p>Choose your operating role and identify the device joining the monitoring session.</p>
            <div class="role-toggle" role="tablist" aria-label="Select role">
              <button type="button" class="role-option" data-role="Employee">Employee</button>
              <button type="button" class="role-option active" data-role="Admin">Admin</button>
            </div>
            <p class="error-message" id="authError">Enter both your name and device name to continue.</p>
            <div class="field">
              <label for="nameInput">Full name</label>
              <input id="nameInput" autocomplete="name" placeholder="Alex Morgan">
            </div>
            <div class="field">
              <label for="deviceInput">Device name</label>
              <input id="deviceInput" autocomplete="off" placeholder="Admin-Laptop-01">
            </div>
            <button class="primary-btn" type="submit">Enter dashboard</button>
          </form>
        </section>
      </main>
    `;

    app.querySelectorAll(".role-option").forEach((button) => {
      button.addEventListener("click", () => {
        mockData.selectedRole = button.dataset.role;
        app.querySelectorAll(".role-option").forEach((item) => item.classList.toggle("active", item === button));
      });
    });

    document.getElementById("authForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("nameInput").value.trim();
      const device = document.getElementById("deviceInput").value.trim();
      const error = document.getElementById("authError");

      if (!name || !device) {
        error.classList.add("visible");
        return;
      }

      mockData.user = { name, device, role: mockData.selectedRole };
      renderDashboard();
    });
  }

  function renderDashboard() {
    app.innerHTML = `
      <main class="dashboard-shell">
        <aside class="sidebar">
          <div class="brand-lockup">
            <span class="brand-mark">PS</span>
            <span class="brand-text">
              <span class="brand-name">Phantom Shield</span>
              <span class="brand-caption">SMB security</span>
            </span>
          </div>
          <nav class="nav-list" aria-label="Primary navigation">
            ${navItems.map((item) => `
              <button class="nav-item ${mockData.route === item.id ? "active" : ""}" data-route="${item.id}">
                <span class="nav-icon" aria-hidden="true"></span>
                <span>${item.label}</span>
              </button>
            `).join("")}
          </nav>
          <div class="sidebar-footer">
            <span class="footer-label">Response automation</span>
            <span class="footer-value">Active and enforcing</span>
          </div>
        </aside>
        <section class="main-area">
          <header class="topbar">
            <div class="topbar-left">
              <h1 class="page-title">${pageTitle()}</h1>
              <p class="page-subtitle">${pageSubtitle()}</p>
            </div>
            <div class="topbar-actions">
              <span class="status-pill"><span class="status-dot"></span>System healthy</span>
              <div class="user-chip">
                <span class="avatar">${mockData.user.name.slice(0, 1).toUpperCase()}</span>
                <span class="user-meta">
                  <span class="user-name">${mockData.user.name}</span>
                  <span class="user-role">${mockData.user.role} on ${mockData.user.device}</span>
                </span>
              </div>
            </div>
          </header>
          <section class="content" id="content"></section>
        </section>
      </main>
    `;

    app.querySelectorAll(".nav-item").forEach((button) => {
      button.addEventListener("click", () => {
        mockData.route = button.dataset.route;
        renderDashboard();
      });
    });

    renderRoute();
  }

  function pageTitle() {
    return {
      overview: "Security Overview",
      devices: "Device Monitoring",
      alerts: "Alerts and Threats",
      recommendations: "AI Recommendation Engine"
    }[mockData.route];
  }

  function pageSubtitle() {
    return {
      overview: "Live posture, breach signals, and automated response state.",
      devices: "Monitor endpoint health, activity logs, and suspicious behavior.",
      alerts: "Review active threats and execute containment actions.",
      recommendations: "Simulated intelligence prioritizes the next best controls."
    }[mockData.route];
  }

  function renderRoute() {
    const content = document.getElementById("content");
    if (mockData.route === "overview") content.innerHTML = overviewView();
    if (mockData.route === "devices") content.innerHTML = devicesView();
    if (mockData.route === "alerts") content.innerHTML = alertsView();
    if (mockData.route === "recommendations") content.innerHTML = recommendationsView();
    bindRouteEvents();
  }

  function overviewView() {
    const risk = averageRisk();
    const blockedCount = mockData.alerts.filter((alert) => alert.status === "Blocked").length;

    return `
      <div class="view">
        <section class="metric-grid">
          ${metricCard("Active threats", activeAlerts().length, `${blockedCount} blocked today`, "Open incidents needing review")}
          ${metricCard("Devices monitored", mockData.devices.length, "+1 joined session", "Endpoints, mobiles, and kiosks")}
          ${metricCard("Risk level", getRiskLevel(risk), `${risk}/100`, "Blended insider and endpoint score")}
        </section>
        <section class="dashboard-grid">
          <div class="panel">
            <div class="panel-header">
              <div>
                <h2 class="panel-title">Live Threat Tracking</h2>
                <p class="panel-subtitle">Signal density by category across monitored devices.</p>
              </div>
              <button class="secondary-btn" data-action="simulate-threat">Simulate update</button>
            </div>
            <div class="threat-chart">
              ${threatTypes.map((type, index) => chartRow(type, threatScore(index), index)).join("")}
            </div>
          </div>
          <div class="panel">
            <div class="panel-header">
              <div>
                <h2 class="panel-title">Activity Feed</h2>
                <p class="panel-subtitle">Real-time breach prevention events.</p>
              </div>
            </div>
            <div class="activity-feed">
              ${mockData.feed.slice(0, 6).map(feedItem).join("")}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function metricCard(label, value, trend, footer) {
    return `
      <article class="metric-card">
        <span class="metric-label">${label}</span>
        <div class="metric-value">${value}<span class="metric-trend">${trend}</span></div>
        <p class="metric-footer">${footer}</p>
      </article>
    `;
  }

  function threatScore(index) {
    const base = [68, 54, 37, 42][index];
    return Math.min(96, base + (mockData.simulationTick * (index + 4)) % 22);
  }

  function chartRow(label, value, index) {
    const styles = ["danger", "warning", "info", ""];
    return `
      <div class="chart-row">
        <span class="chart-label">${label}</span>
        <span class="chart-track"><span class="chart-fill ${styles[index]}" data-width="${value}"></span></span>
        <span class="chart-value">${value}</span>
      </div>
    `;
  }

  function feedItem(item) {
    return `
      <article class="feed-item">
        <div class="item-topline">
          <span class="item-title">${item.title}</span>
          <span class="item-time">${item.time}</span>
        </div>
        <p class="item-body">${item.body}</p>
      </article>
    `;
  }

  function devicesView() {
    const selected = getDevice(mockData.selectedDeviceId);

    return `
      <div class="view device-layout">
        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Monitored Devices</h2>
              <p class="panel-subtitle">Select an asset to inspect logs and risk drivers.</p>
            </div>
          </div>
          <div class="device-list">
            ${mockData.devices.map(deviceCard).join("")}
          </div>
        </section>
        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">${selected.name}</h2>
              <p class="panel-subtitle">${selected.owner} · ${selected.type} · Last activity ${selected.lastActivity}</p>
            </div>
            <span class="badge ${className(getRiskLevel(selected.risk))}">${getRiskLevel(selected.risk)} risk</span>
          </div>
          <div class="risk-meter">
            <span class="risk-track"><span class="risk-fill ${className(getRiskLevel(selected.risk))}" data-width="${selected.risk}"></span></span>
            <span class="risk-score">${selected.risk}/100</span>
          </div>
          <div class="log-list device-logs">
            ${selected.logs.map(logItem).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function deviceCard(device) {
    return `
      <button class="device-card ${device.id === mockData.selectedDeviceId ? "active" : ""}" data-device="${device.id}">
        <div class="device-card-head">
          <div>
            <h3 class="device-name">${device.name}</h3>
            <p class="device-owner">${device.owner} · ${device.type}</p>
          </div>
          <span class="badge ${className(device.status)}">${device.status}</span>
        </div>
        <div class="device-meta">
          <span class="badge ${className(getRiskLevel(device.risk))}">${getRiskLevel(device.risk)} risk</span>
          <span class="badge info">${device.lastActivity}</span>
        </div>
        <div class="risk-meter">
          <span class="risk-track"><span class="risk-fill ${className(getRiskLevel(device.risk))}" data-width="${device.risk}"></span></span>
          <span class="risk-score">${device.risk}</span>
        </div>
      </button>
    `;
  }

  function logItem(log) {
    return `
      <article class="log-item ${log.suspicious ? "suspicious" : ""}">
        <div class="item-topline">
          <span class="item-title">${log.title}</span>
          <span class="item-time">${log.time}</span>
        </div>
        <p class="item-body">${log.detail}</p>
      </article>
    `;
  }

  function alertsView() {
    return `
      <div class="view">
        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Threat Queue</h2>
              <p class="panel-subtitle">Review suspicious activity, inspect evidence, and block or unblock accounts when needed.</p>
            </div>
            <button class="secondary-btn" data-action="new-alert">Generate alert</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Threat type</th>
                  <th>Severity</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Device</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${mockData.alerts.map(alertRow).join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  function alertRow(alert) {
    const device = getDevice(alert.deviceId);
    const blocked = alert.status === "Blocked";

    return `
      <tr>
        <td><span class="threat-name">${alert.type}</span></td>
        <td><span class="badge ${className(alert.severity)}">${alert.severity}</span></td>
        <td>${alert.timestamp}</td>
        <td><span class="badge ${className(alert.status)}">${alert.status}</span></td>
        <td>${device.name}</td>
        <td>
          <div class="action-row">
            <button class="table-action enquire" data-enquire-alert="${alert.id}">Enquire</button>
            ${blocked
              ? `<button class="table-action unblock" data-unblock="${alert.id}">Unblock</button>`
              : `<button class="table-action block" data-block="${alert.id}">Block</button>`
            }
          </div>
        </td>
      </tr>
    `;
  }

  function recommendationsView() {
    const applied = mockData.recommendations.filter((item) => item.applied).length;

    return `
      <div class="view recommendation-grid">
        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Recommended Actions</h2>
              <p class="panel-subtitle">Actions are generated from active alert patterns, device posture, and insider risk movement.</p>
            </div>
          </div>
          <div class="recommendation-list">
            ${mockData.recommendations.map(recommendationCard).join("")}
          </div>
        </section>
        <aside class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">AI Risk Summary</h2>
              <p class="panel-subtitle">Current simulated model output.</p>
            </div>
          </div>
          <div class="insight-stack">
            <div class="insight"><span class="insight-label">Recommendations applied</span><span class="insight-value">${applied}/${mockData.recommendations.length}</span></div>
            <div class="insight"><span class="insight-label">Projected risk reduction</span><span class="insight-value">${applied * 11}%</span></div>
            <div class="insight"><span class="insight-label">Highest pressure area</span><span class="insight-value">Data Loss</span></div>
          </div>
        </aside>
      </div>
    `;
  }

  function recommendationCard(item) {
    return `
      <article class="recommendation-card ${item.applied ? "applied" : ""}">
        <div class="recommendation-head">
          <div>
            <h3 class="recommendation-title">${item.title}</h3>
          </div>
          <span class="badge ${className(item.severity)}">${item.severity}</span>
        </div>
        <p class="recommendation-copy">${item.explanation}</p>
        <button class="secondary-btn" data-apply="${item.id}" ${item.applied ? "disabled" : ""}>${item.applied ? "Applied" : item.action}</button>
      </article>
    `;
  }

  function bindRouteEvents() {
    applyDynamicWidths();

    document.querySelectorAll("[data-device]").forEach((button) => {
      button.addEventListener("click", () => {
        mockData.selectedDeviceId = button.dataset.device;
        renderRoute();
      });
    });

    document.querySelectorAll("[data-enquire-alert]").forEach((button) => {
      button.addEventListener("click", () => openAlertEnquiry(button.dataset.enquireAlert));
    });

    document.querySelectorAll("[data-block]").forEach((button) => {
      button.addEventListener("click", () => updateAlert(button.dataset.block, "Blocked"));
    });

    document.querySelectorAll("[data-unblock]").forEach((button) => {
      button.addEventListener("click", () => unblockAlert(button.dataset.unblock));
    });

    document.querySelectorAll("[data-apply]").forEach((button) => {
      button.addEventListener("click", () => applyRecommendation(button.dataset.apply));
    });

    const simulateButton = document.querySelector("[data-action='simulate-threat']");
    if (simulateButton) simulateButton.addEventListener("click", simulateThreatUpdate);

    const newAlertButton = document.querySelector("[data-action='new-alert']");
    if (newAlertButton) newAlertButton.addEventListener("click", generateAlert);
  }

  function applyDynamicWidths() {
    document.querySelectorAll("[data-width]").forEach((element) => {
      element.style.width = `${element.dataset.width}%`;
    });
  }

  function updateAlert(id, status) {
    const alert = mockData.alerts.find((item) => item.id === id);
    if (!alert) return;

    alert.status = status;
    const device = getDevice(alert.deviceId);
    if (status === "Blocked") {
      device.status = "Quarantined";
      device.risk = Math.max(25, device.risk - 16);
    } else {
      device.risk = Math.max(15, device.risk - 8);
    }

    mockData.feed.unshift({
      title: status === "Blocked" ? "Threat blocked" : "Alert updated",
      time: currentTime(),
      body: `${alert.type} on ${device.name} was marked ${status.toLowerCase()} by ${mockData.user.name}.`
    });

    renderDashboard();
  }

  function unblockAlert(id) {
    const alert = mockData.alerts.find((item) => item.id === id);
    if (!alert) return;

    alert.status = "Investigating";
    const device = getDevice(alert.deviceId);
    device.status = "Online";
    device.risk = Math.min(96, device.risk + 10);

    mockData.feed.unshift({
      title: "Account unblocked",
      time: currentTime(),
      body: `${device.name} was unblocked after review and returned to investigating status.`
    });

    renderDashboard();
  }

  function openAlertEnquiry(id) {
    const alert = mockData.alerts.find((item) => item.id === id);
    if (!alert) return;

    const device = getDevice(alert.deviceId);
    const existingModal = document.querySelector(".alert-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "alert-modal";
    modal.innerHTML = `
      <div class="alert-dialog" role="dialog" aria-modal="true" aria-labelledby="alert-enquiry-title">
        <button class="alert-close" type="button" aria-label="Close alert details">&times;</button>
        <p class="section-kicker">Suspicious account enquiry</p>
        <h3 id="alert-enquiry-title">${alert.type}</h3>
        <div class="alert-summary-grid">
          <div><span>Device</span><strong>${device.name}</strong></div>
          <div><span>IP address</span><strong>${alert.ipAddress}</strong></div>
          <div><span>Severity</span><strong>${alert.severity}</strong></div>
          <div><span>Status</span><strong>${alert.status}</strong></div>
        </div>
        <div class="alert-detail-block">
          <h4>Tabs opened</h4>
          <ul>${alert.openedTabs.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="alert-detail-block">
          <h4>Suspicious behaviours</h4>
          <ul>${alert.suspiciousBehaviors.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="alert-detail-block">
          <h4>Why this device is on alert</h4>
          <p>${alert.highAlertReason}</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest(".alert-close")) {
        modal.remove();
      }
    });
  }

  function applyRecommendation(id) {
    const recommendation = mockData.recommendations.find((item) => item.id === id);
    if (!recommendation) return;
    recommendation.applied = true;

    mockData.devices = mockData.devices.map((device) => ({
      ...device,
      risk: Math.max(12, device.risk - (recommendation.severity === "Critical" ? 10 : 6))
    }));

    mockData.feed.unshift({
      title: "AI recommendation applied",
      time: currentTime(),
      body: `${recommendation.action} was applied across affected security policies.`
    });

    renderDashboard();
  }

  function simulateThreatUpdate() {
    mockData.simulationTick += 1;
    const target = mockData.devices[mockData.simulationTick % mockData.devices.length];
    target.risk = Math.min(96, target.risk + 7);
    target.lastActivity = "Just now";
    target.logs.unshift({
      time: currentTime(),
      title: "Behavior anomaly detected",
      detail: "Live simulation increased risk due to a rare access pattern against sensitive records.",
      suspicious: true
    });

    mockData.feed.unshift({
      title: "New detection signal",
      time: currentTime(),
      body: `${target.name} generated a behavior anomaly and its risk score increased to ${target.risk}.`
    });

    renderRoute();
  }

  function generateAlert() {
    const device = mockData.devices[Math.floor(Math.random() * mockData.devices.length)];
    const severity = device.risk > 70 ? "High" : "Medium";
    const id = `alt-${String(Date.now()).slice(-6)}`;
    const alert = {
      id,
      type: device.risk > 70 ? "Sensitive data movement" : "Risk policy drift",
      severity,
      timestamp: currentTime(),
      status: "Open",
      deviceId: device.id,
      ipAddress: "192.168.10.24",
      openedTabs: ["Security dashboard", "Shared files", "Browser download history"],
      suspiciousBehaviors: ["Unusual activity spike detected", "Policy deviation observed", "Device behavior differed from its recent baseline"],
      highAlertReason: "Recent behavior crossed the monitoring threshold and requires analyst review."
    };

    mockData.alerts.unshift(alert);
    mockData.feed.unshift({
      title: "New alert generated",
      time: alert.timestamp,
      body: `${alert.type} was created for ${device.name} with ${severity.toLowerCase()} severity.`
    });

    renderDashboard();
  }

  function currentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Keep the prototype alive with a measured, investor-demo friendly live update loop.
  setInterval(() => {
    if (!mockData.user) return;
    mockData.simulationTick += 1;
    const device = mockData.devices[mockData.simulationTick % mockData.devices.length];
    device.lastActivity = "Just now";
    device.risk = Math.min(95, Math.max(18, device.risk + (mockData.simulationTick % 2 === 0 ? 2 : -1)));

    if (mockData.route === "overview" || mockData.route === "devices") {
      renderDashboard();
    }
  }, 11000);

  renderLanding();
})();
