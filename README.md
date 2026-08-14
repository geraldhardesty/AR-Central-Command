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
  App.jsx                    # routes ?apply -> CustomerCreditForm, else ARDashboard
  components/
    ARDashboard.jsx           # internal AR staff portal: tabs, state, layout
    CustomerCreditForm.jsx     # standalone, shareable customer credit application
    SignaturePad.jsx            # canvas-based digital signature capture
    MetricCard.jsx               # summary metric tile
    StatusBadge.jsx               # status pill used in tables
  data/
    constants.js               # design tokens + business rule constants
    mockData.js                 # mock holds / delinquent / customer data
    utils.js                    # form helpers, duplicate-match logic, localStorage bridge
  main.jsx
  index.css
```

## Customer credit application

The application form (`CustomerCreditForm.jsx`) matches Yokogawa's paper
Customer Credit Information Form field-for-field — company info, three trade
references, two bank references, and a signature — and is intentionally a
standalone page rather than a tab inside the internal portal, since a
customer (not AR staff) fills it out.

- **Link:** the "New Customer Intake" tab in Customer Onboarding shows a
  `?apply` link reps can copy and send directly to a customer.
- **Submission:** on submit the application is written to `localStorage`
  (`ar_credit_applications`) and a confirmation screen is shown. There's no
  backend yet, so this only round-trips within one browser — open the link,
  submit, then switch back to the dashboard tab to see it land in the Queue.
- **Queue:** `ARDashboard.jsx` reads `loadPublicApplications()` on mount and
  merges any new ones into the Queue, tagged "Customer link" as the source.
  Click a row to expand full reference/signature detail.

## Known TODOs / next steps

- [ ] **AR agent** — submissions land in the Queue as a to-do, but nothing
      triages them yet. Build the agent that picks them up.
- [ ] **Real backend for applications** — replace the `localStorage` bridge
      in `utils.js` with an API so a customer's submission actually reaches
      AR staff on a different machine.
- [ ] **SPFx packaging** — `CustomerCreditForm.jsx` is written with no
      dependency on `ARDashboard` state specifically so it can be lifted
      into an SPFx web part for the Rep Portal with minimal changes.
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
