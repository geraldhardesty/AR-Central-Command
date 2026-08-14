// -----------------------------------------------------------------------
// Mock data — stand-ins for real integrations.
//
// TODO: replace each of these with real data sources:
//   - mockHolds          -> SAP Credit Hold Report
//   - mockDelinquent     -> Collections Report (overdue invoices)
//   - mockExistingCredit -> SAP customer credit balance report
//   - EXISTING_CUSTOMERS -> SAP customer master / CRM lookup
//   - WHITELISTED_ACCOUNTS -> admin-configurable setting (see Docs page)
// -----------------------------------------------------------------------

// Accounts trusted enough that a "static" credit-limit hold on their order
// is treated as a formality rather than a risk signal. Matched by Customer
// ID (SAP sold-to party), not name, since names can collide or change.
export const WHITELISTED_ACCOUNTS = [
  { customerId: "0010045821", customerName: "BBP Manufacturing" },
  { customerId: "0010045892", customerName: "TechStar Solutions" },
  { customerId: "0010046013", customerName: "GridTech Industries" },
  { customerId: "0010046205", customerName: "Vertex Energy" },
];

// holdReason mirrors SAP credit management check types:
//   "static" -> static credit limit check (this order exceeds the limit)
//   "oldest" -> oldest open item check (an invoice is past due)
//
// paymentHistory is this customer's last few *closed* orders (not the one
// currently on hold) — what AR actually looks at when deciding whether to
// release, keep holding, or dig further. daysLate is 0 for on-time payment.
export const mockHolds = [
  {
    id: "SO-001847",
    customerId: "0010045821",
    customer: "BBP Manufacturing",
    orderDate: "2026-08-10",
    amount: 28500,
    creditLimit: 100000,
    availableCredit: -3500,
    holdReason: "static",
    daysOnHold: 3,
    paymentHistory: [
      { orderId: "SO-001623", orderDate: "2026-05-02", amount: 31200, dueDate: "2026-06-01", paidDate: "2026-05-30", paidAmount: 31200, daysLate: 0 },
      { orderId: "SO-001701", orderDate: "2026-06-04", amount: 18400, dueDate: "2026-07-04", paidDate: "2026-07-02", paidAmount: 18400, daysLate: 0 },
      { orderId: "SO-001765", orderDate: "2026-06-28", amount: 26900, dueDate: "2026-07-28", paidDate: "2026-07-26", paidAmount: 26900, daysLate: 0 },
      { orderId: "SO-001802", orderDate: "2026-07-15", amount: 22750, dueDate: "2026-08-14", paidDate: "2026-08-11", paidAmount: 22750, daysLate: 0 },
    ],
  },
  {
    id: "SO-001912",
    customerId: "0010045892",
    customer: "TechStar Solutions",
    orderDate: "2026-07-30",
    amount: 42000,
    creditLimit: 150000,
    availableCredit: 55000,
    holdReason: "oldest",
    daysOnHold: 12,
    invoiceNumber: "INV-2026-5421",
    daysOverdue: 5,
    paymentHistory: [
      { orderId: "SO-001588", orderDate: "2026-04-20", amount: 39500, dueDate: "2026-05-20", paidDate: "2026-06-03", paidAmount: 39500, daysLate: 14 },
      { orderId: "SO-001654", orderDate: "2026-05-18", amount: 27800, dueDate: "2026-06-17", paidDate: "2026-06-17", paidAmount: 27800, daysLate: 0 },
      { orderId: "SO-001739", orderDate: "2026-06-22", amount: 45200, dueDate: "2026-07-22", paidDate: "2026-08-01", paidAmount: 45200, daysLate: 10 },
      { orderId: "SO-001820", orderDate: "2026-07-20", amount: 33100, dueDate: "2026-08-19", paidDate: "2026-08-15", paidAmount: 33100, daysLate: 0 },
    ],
  },
  {
    id: "SO-002003",
    customerId: "0010051188",
    customer: "Pinnacle Corp",
    orderDate: "2026-08-05",
    amount: 61000,
    creditLimit: 50000,
    availableCredit: -11000,
    holdReason: "static",
    daysOnHold: 7,
    paymentHistory: [
      { orderId: "SO-001611", orderDate: "2026-04-10", amount: 52000, dueDate: "2026-05-10", paidDate: "2026-06-24", paidAmount: 52000, daysLate: 45 },
      { orderId: "SO-001688", orderDate: "2026-05-25", amount: 38700, dueDate: "2026-06-24", paidDate: "2026-07-14", paidAmount: 38700, daysLate: 20 },
      { orderId: "SO-001755", orderDate: "2026-06-30", amount: 41200, dueDate: "2026-07-30", paidDate: "2026-07-29", paidAmount: 41200, daysLate: 0 },
    ],
  },
  {
    id: "SO-002041",
    customerId: "0010052390",
    customer: "Meridian Fabrication",
    orderDate: "2026-08-01",
    amount: 15750,
    creditLimit: 80000,
    availableCredit: 22000,
    holdReason: "oldest",
    daysOnHold: 9,
    invoiceNumber: "INV-2026-5390",
    daysOverdue: 18,
    paymentHistory: [
      { orderId: "SO-001640", orderDate: "2026-04-28", amount: 19800, dueDate: "2026-05-28", paidDate: "2026-06-07", paidAmount: 19800, daysLate: 10 },
      { orderId: "SO-001719", orderDate: "2026-06-01", amount: 24300, dueDate: "2026-07-01", paidDate: "2026-06-29", paidAmount: 24300, daysLate: 0 },
      { orderId: "SO-001788", orderDate: "2026-07-10", amount: 16900, dueDate: "2026-08-09", paidDate: "2026-08-07", paidAmount: 16900, daysLate: 0 },
    ],
  },
];

// Customers on the hold list not because an order is blocked, but because
// they're carrying a credit balance (overpayment / credit memo) that needs
// review — refund, or apply to a future invoice.
export const mockExistingCredit = [
  {
    customerId: "0010046013",
    customer: "GridTech Industries",
    creditBalance: 8200,
    reason: "Overpayment on INV-2026-5103",
    since: "2026-07-22",
  },
  {
    customerId: "0010053077",
    customer: "Harborview Instruments",
    creditBalance: 3400,
    reason: "Returned goods credit memo CM-2026-0091",
    since: "2026-08-02",
  },
];

export const mockDelinquent = [
  {
    invoiceNumber: "INV-2026-5401",
    customer: "TechStar Solutions",
    amount: 42000,
    dueDate: "2026-08-10",
    daysOverdue: 5,
    agingBucket: "30-60",
    emailsSent: 2,
    lastEmailDate: "2026-08-11",
    nextAutoEmailDate: "2026-08-19",
  },
  {
    invoiceNumber: "INV-2026-5312",
    customer: "Pinnacle Corp",
    amount: 78000,
    dueDate: "2026-07-20",
    daysOverdue: 24,
    agingBucket: "30-60",
    emailsSent: 3,
    lastEmailDate: "2026-08-09",
    nextAutoEmailDate: "2026-08-16",
  },
];

export const EXISTING_CUSTOMERS = [
  { sapId: "SAP-100132", companyName: "Acme Industrial Supply", dnbNumber: "07-842-1490", creditLimit: 40000 },
  { sapId: "SAP-100210", companyName: "Beacon Process Controls", dnbNumber: "11-203-5567", creditLimit: 75000 },
];
