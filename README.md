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
  App.jsx                    # routes ?apply -> CustomerCreditForm, ?docs -> DocsPage, else ARDashboard
  components/
    ARDashboard.jsx           # internal AR staff portal: tabs, state, layout
    CustomerCreditForm.jsx     # standalone, shareable customer credit application
    DocsPage.jsx                # internal reference page (whitelisted accounts)
    CreditCheckTool.jsx           # standalone customer credit lookup
    SignaturePad.jsx                # canvas-based digital signature capture
    RiskBadge.jsx                     # risk score pill + recommendation badge
    MetricCard.jsx                      # summary metric tile
    StatusBadge.jsx                      # SAP hold-reason pill (Static / Oldest)
  data/
    constants.js                      # design tokens + business rule constants
    mockData.js                         # mock holds / delinquent / whitelist / credit balances
    riskScoring.js                        # calculated risk score + recommendation
    sapCreditService.js                     # placeholder SAP credit-check call
    utils.js                                 # form helpers, duplicate-match logic, localStorage bridge
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

## Credit Holds

Each hold's `holdReason` mirrors a real SAP credit management check type:

- **`static`** — this order's value exceeds the account's static credit limit
- **`oldest`** — the account has a past-due invoice (oldest open item check)

An account is highlighted as **auto-approve ready** only when it's on
`WHITELISTED_ACCOUNTS` (matched by Customer ID, in `mockData.js`) *and* the
hold reason is `static` — a whitelisted account with a genuinely overdue
invoice is never auto-approved. The whitelist itself is viewable at `?docs`,
which stands in for a future admin-configurable settings screen.

Customers can also land on the credit-hold list without a blocked order, if
they're carrying a credit balance (overpayment or credit memo) that needs
review — that's the separate **Existing Credit** tab, backed by
`mockExistingCredit`.

### Risk score & recommendation

Expanding a hold row shows the customer's recent payment history (past
orders, payment amounts, on-time vs. days-late) and an AR risk assessment —
the same investigation an AR rep does manually today. `riskScoring.js`
calculates a 0–100 risk score from that history plus the current hold
(late-payment rate, average days late, hold reason, over-limit severity,
whitelist status) and maps it to a recommendation:

- `< 30` → **Release**
- `30–59` → **Find More Info**
- `≥ 60` → **Keep on Hold**

Both the score and recommendation also appear as columns on the main table.
Click "Risk Score" in the header to sort by it — since recommendation is a
direct function of score, sorting by score also clusters and orders the
recommendations. The row expansion additionally lists the plain-language
factors behind the score, so a reviewer isn't just trusting a number.

This is entirely mocked today (`paymentHistory` is hand-authored per
account in `mockData.js`) — the eventual agent that pulls real payment
history from SAP is still to be built; the scoring function itself doesn't
change, just its input.

## Credit Check

The **Credit Check** tab is a rep-facing lookup, separate from the Credit
Holds workflow: type a customer name, Customer ID, or billing address into
one search field, and get back (a) whether the account is currently on a
delinquency credit hold, and (b) its current available credit — credit
limit minus open POs not yet paid, **not** counting any credit balance on
the account.

It's built as a self-contained module on purpose — `CreditCheckTool.jsx`
holds no dependency on `ARDashboard` state, and all data comes through one
function, `checkCustomerCredit()` in `sapCreditService.js`. Both are
designed to be lifted out of this dashboard into wherever this tool
eventually lives, without needing to untangle it from the rest of the app.
`sapCreditService.js` simulates the latency of a real SAP round-trip
(rather than resolving instantly) so the loading state is exercised too —
in production this becomes a real call, most likely `BAPI_CUSTOMER_GETDETAIL`
for master data plus a credit management read (FSCM or FD32 /
S_ALR_87012218) for open exposure.

## Known TODOs / next steps

- [ ] **Real SAP credit check** — `checkCustomerCredit()` in
      `sapCreditService.js` is a placeholder over hand-authored mock data.
      Wire it to a real SAP call.
- [ ] **AR agent** — submissions land in the Queue as a to-do, but nothing
      triages them yet. Build the agent that picks them up.
- [ ] **Real payment history** — `calculateRiskScore()` in `riskScoring.js`
      is real logic, but its input (`hold.paymentHistory`) is hand-authored
      mock data. Build the agent that pulls actual payment history from SAP.
- [ ] **Real backend for applications** — replace the `localStorage` bridge
      in `utils.js` with an API so a customer's submission actually reaches
      AR staff on a different machine.
- [ ] **SPFx packaging** — `CustomerCreditForm.jsx` is written with no
      dependency on `ARDashboard` state specifically so it can be lifted
      into an SPFx web part for the Rep Portal with minimal changes.
- [ ] **Replace mock data with real sources** (`src/data/mockData.js`):
  - `mockHolds` → SAP Credit Hold Report
  - `mockDelinquent` → Collections Report (overdue invoices)
  - `mockExistingCredit` → SAP customer credit balance report
  - `EXISTING_CUSTOMERS` → SAP customer master / CRM lookup
- [ ] **Whitelist config** — `WHITELISTED_ACCOUNTS` in `mockData.js` is a
      fixed array, currently viewable (not editable) at `?docs`. Move this to
      a real admin-configurable setting (backend/API-driven).
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
