# AR Central Command

Unified AR operations console: credit hold management, delinquent collections,
email automation, and new customer credit onboarding — all in one app.

## Stack

- React 18 + Vite
- Plain inline styles (no CSS framework) — easy to swap for Tailwind later
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  components/
    ARDashboard.jsx      # main app: tabs, state, layout
    MetricCard.jsx        # summary metric tile
    StatusBadge.jsx        # status pill used in tables
  data/
    constants.js          # design tokens + business rule constants
    mockData.js            # mock holds / delinquent / customer data
    utils.js               # form helpers, duplicate-match logic
  main.jsx
  index.css
```

## Known TODOs / next steps

- [ ] **Replace mock data with real sources** (`src/data/mockData.js`):
  - `mockHolds` → SAP Credit Hold Report
  - `mockDelinquent` → Collections Report (overdue invoices)
  - `EXISTING_CUSTOMERS` → SAP customer master / CRM lookup
- [ ] **Whitelist config** — `AUTO_APPROVE_LIST` in `constants.js` is a fixed
      array. Move this to an admin-configurable setting (backend/API-driven).
- [ ] **SAP push** — `pushToSap()` in `ARDashboard.jsx` currently fakes a SAP
      customer number. Wire this to the real XD01 integration layer.
- [ ] **Email automation** — the "Send Now" / weekly scheduler UI is
      currently static. Needs to call a real email service and persist
      send history.
- [ ] **Auth / roles** — no login or permission model yet.

## Background

This app combines what were originally two separate prototypes:
1. A credit onboarding console (new customer intake → risk scoring →
   SAP push)
2. An AR credit hold dashboard (SAP credit holds + collections aging +
   email automation)

They're now one app with two top-level tabs so AR staff don't have to
context-switch between tools.
