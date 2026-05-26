# Phantom Shield frontend migration

Production-oriented frontend migration of the original HTML/CSS/Vanilla JavaScript prototype into Next.js App Router + React + TypeScript + TailwindCSS + Zustand.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the local Next.js URL, then follow the original workflow: landing page → auth page → dashboard.

## Migration notes

- Product flows, labels, visual styling, risk rules, alert mutations, recommendation effects, and simulated activity behavior were preserved from the prototype.
- `globals.css` intentionally keeps reusable theme tokens and the existing class system because a full one-shot utility-class conversion would add noise without improving maintainability. Tailwind remains configured for incremental adoption.
- All data now starts in `constants/mockData.ts`; services expose mock-backed async functions with `TODO: Replace with backend API` seams for later replacement.
- Zustand stores isolate user, devices, alerts, and recommendations so local mutations only rerender subscribed components.
- Dashboard navigation now uses App Router routes instead of string-based manual rendering.
