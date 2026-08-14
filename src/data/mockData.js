// -----------------------------------------------------------------------
// Mock data — stand-ins for real integrations.
//
// TODO: replace each of these with real data sources:
//   - mockHolds        -> SAP Credit Hold Report
//   - mockDelinquent   -> Collections Report (overdue invoices)
//   - EXISTING_CUSTOMERS -> SAP customer master / CRM lookup
// -----------------------------------------------------------------------

export const mockHolds = [
  {
    id: "SO-001847",
    customer: "BBP Manufacturing",
    rep: "BBP",
    amount: 28500,
    creditLimit: 100000,
    holdReason: "exceeded_limit",
    daysOnHold: 3,
    createdOn: "2026-08-10",
    lastPaymentDate: "2026-07-15",
    lastPaymentAmount: 25000,
    status: "pending_approval",
    poUrl: "https://example.com/po/PO-2026-0847",
  },
  {
    id: "SO-001912",
    customer: "TechStar Solutions",
    rep: "TechStar",
    amount: 42000,
    creditLimit: 150000,
    holdReason: "delinquent_payment",
    daysOnHold: 12,
    createdOn: "2026-07-30",
    invoiceNumber: "INV-2026-5421",
    daysOverdue: 5,
    status: "pending_approval",
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
