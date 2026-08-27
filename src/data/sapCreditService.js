// -----------------------------------------------------------------------
// Placeholder for a real SAP integration.
//
// TODO: replace with a real call — customer master + address from
// BAPI_CUSTOMER_GETDETAIL, credit limit and exposure from FSCM credit
// management (or the classic FD32 / S_ALR_87012218 credit exposure view).
// The rest of the app — and wherever these tools end up living once they
// migrate out of this dashboard — only depends on checkCustomerCredit()
// and checkOrderCreditRisk() below, not on how the SAP call is actually
// made.
// -----------------------------------------------------------------------

const SIMULATED_LATENCY_MS = 600;

// Mock customer master + open-item snapshot, standing in for what a real
// SAP credit check would return. Deliberately separate from mockHolds /
// mockDelinquent / mockExistingCredit in mockData.js — those model
// specific report extracts at a point in time; this models a live
// per-account snapshot, which is what this tool actually needs.
const MOCK_CUSTOMER_MASTER = [
  {
    customerId: "0010045821",
    customerName: "BBP Manufacturing",
    address: "1180 Meridian Ave, Springfield, IL 62704",
    creditLimit: 100000,
    openPOs: [
      { poNumber: "SO-001847", amount: 28500, paid: false },
      { poNumber: "SO-001899", amount: 79000, paid: false },
    ],
    creditBalance: 0,
    delinquentHold: false,
  },
  {
    customerId: "0010045892",
    customerName: "TechStar Solutions",
    address: "455 Innovation Pkwy, Austin, TX 78701",
    creditLimit: 150000,
    openPOs: [
      { poNumber: "SO-001912", amount: 42000, paid: false },
    ],
    creditBalance: 0,
    delinquentHold: true,
  },
  {
    customerId: "0010051188",
    customerName: "Pinnacle Corp",
    address: "902 Harbor Blvd, Charleston, SC 29401",
    creditLimit: 50000,
    openPOs: [
      { poNumber: "SO-002003", amount: 61000, paid: false },
    ],
    creditBalance: 0,
    delinquentHold: true,
  },
  {
    customerId: "0010052390",
    customerName: "Meridian Fabrication",
    address: "77 Foundry Row, Toledo, OH 43604",
    creditLimit: 80000,
    openPOs: [
      { poNumber: "SO-002041", amount: 15750, paid: false },
    ],
    creditBalance: 0,
    delinquentHold: true,
  },
  {
    customerId: "0010046013",
    customerName: "GridTech Industries",
    address: "310 Circuit Dr, Boise, ID 83702",
    creditLimit: 120000,
    openPOs: [],
    creditBalance: 8200,
    delinquentHold: false,
  },
  {
    customerId: "0010046205",
    customerName: "Vertex Energy",
    address: "48 Turbine Way, Tulsa, OK 74103",
    creditLimit: 200000,
    openPOs: [
      { poNumber: "SO-002105", amount: 35000, paid: false },
    ],
    creditBalance: 0,
    delinquentHold: false,
  },
  {
    customerId: "0010053077",
    customerName: "Harborview Instruments",
    address: "19 Pier St, Norfolk, VA 23510",
    creditLimit: 60000,
    openPOs: [],
    creditBalance: 3400,
    delinquentHold: false,
  },
  {
    customerId: "0010054412",
    customerName: "Redstone Analytics",
    address: "220 Summit Ave, Denver, CO 80202",
    creditLimit: 45000,
    openPOs: [],
    creditBalance: 0,
    delinquentHold: false,
  },
];

function matches(customer, query) {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (
    customer.customerId.toLowerCase().includes(q) ||
    customer.customerName.toLowerCase().includes(q) ||
    customer.address.toLowerCase().includes(q)
  );
}

function buildResult(customer) {
  const openUnpaid = customer.openPOs.filter((po) => !po.paid);
  const openExposure = openUnpaid.reduce((sum, po) => sum + po.amount, 0);
  return {
    customerId: customer.customerId,
    customerName: customer.customerName,
    address: customer.address,
    creditLimit: customer.creditLimit,
    openPOs: openUnpaid,
    openExposure,
    // Available credit intentionally excludes any credit balance — a
    // credit memo sitting on the account doesn't offset open exposure
    // for this check.
    availableCredit: customer.creditLimit - openExposure,
    creditBalance: customer.creditBalance,
    onDelinquencyHold: customer.delinquentHold,
  };
}

// Simulates an async SAP round-trip (a real call is a network request,
// not instant). Resolves to { query, matches } — zero, one, or more
// results depending on how many customers match customer ID, name, or
// address against the free-text query.
export function checkCustomerCredit(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = MOCK_CUSTOMER_MASTER.filter((c) => matches(c, query));
      resolve({ query, matches: found.map(buildResult) });
    }, SIMULATED_LATENCY_MS);
  });
}

// Checks whether a specific upcoming order would put the account on (or
// keep it on) credit hold — for the sales-partner-facing widget. Order of
// checks matches how AR actually reasons about it: an existing delinquency
// hold is reported first, regardless of the new order's size, since that's
// already blocking; only if the account is clear of that does the order
// amount get compared to available credit.
export function checkOrderCreditRisk(query, orderAmount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const amount = Number(orderAmount) || 0;
      const found = MOCK_CUSTOMER_MASTER.filter((c) => matches(c, query));
      resolve({
        query,
        orderAmount: amount,
        matches: found.map((c) => {
          const result = buildResult(c);
          return { ...result, orderAmount: amount, ...assessOrderRisk(result, amount) };
        }),
      });
    }, SIMULATED_LATENCY_MS);
  });
}

function assessOrderRisk(result, orderAmount) {
  if (result.onDelinquencyHold) {
    return {
      riskStatus: "delinquent_hold",
      riskMessage: "On credit hold - overdue invoice.",
    };
  }
  if (orderAmount > result.availableCredit) {
    return {
      riskStatus: "would_exceed_limit",
      riskMessage: "Credit hold warning - this PO amount will exceed customer's credit limit.",
    };
  }
  return {
    riskStatus: "clear",
    riskMessage: "Clear to proceed - order is within available credit.",
  };
}
