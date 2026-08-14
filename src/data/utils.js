import { EXISTING_CUSTOMERS, WHITELISTED_ACCOUNTS } from "./mockData.js";

const PUBLIC_APPLICATIONS_KEY = "ar_credit_applications";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const emptyTradeRef = () => ({
  id: crypto.randomUUID(),
  name: "", address: "", city: "", state: "", zip: "",
  phone: "", fax: "", email: "", contact: "",
});

export const emptyBankRef = () => ({
  id: crypto.randomUUID(),
  name: "", address: "", city: "", state: "", zip: "",
  phone: "", fax: "", email: "", contact: "", accountNumber: "",
});

// Matches the fields on the Yokogawa Corporation of America
// Customer Credit Information Form (paper intake form).
export const emptyCreditApplication = () => ({
  companyName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  accountingContact: "",
  accountingPhone: "",
  accountingFax: "",
  accountingEmail: "",
  dnbNumber: "",
  tradeRefs: [emptyTradeRef(), emptyTradeRef(), emptyTradeRef()],
  bankRefs: [emptyBankRef(), emptyBankRef()],
  creditLimitRequested: "",
  financeContact: "",
  agreedToTerms: false,
  signerName: "",
  signerTitle: "",
  signedDate: todayISO(),
  signatureDataUrl: "",
});

// -----------------------------------------------------------------------
// Public submissions storage
// TODO: replace with a real API once the AR agent backend exists. This
// uses localStorage only so a full demo (send link -> customer submits ->
// shows up in the internal Queue) works within one browser.
// -----------------------------------------------------------------------
export function loadPublicApplications() {
  try {
    return JSON.parse(localStorage.getItem(PUBLIC_APPLICATIONS_KEY)) || [];
  } catch {
    return [];
  }
}

export function savePublicApplication(application) {
  const all = loadPublicApplications();
  all.push(application);
  localStorage.setItem(PUBLIC_APPLICATIONS_KEY, JSON.stringify(all));
}

export function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\b(inc|llc|corp|co|ltd|company)\b\.?/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function normalizeDuns(v) {
  return String(v || "").replace(/\D/g, "");
}

export function findExistingMatch(form) {
  const duns = normalizeDuns(form.dnbNumber);
  const name = normalizeName(form.companyName);
  return (
    EXISTING_CUSTOMERS.find((c) => duns && normalizeDuns(c.dnbNumber) === duns) ||
    EXISTING_CUSTOMERS.find((c) => name && normalizeName(c.companyName) === name) ||
    null
  );
}

// Whitelist match is by Customer ID (SAP sold-to party), not name — see
// the Docs page (?docs) for the account list and why static-limit holds
// on these accounts are treated as auto-approve ready.
export function isWhitelisted(customerId) {
  return WHITELISTED_ACCOUNTS.some((a) => a.customerId === customerId);
}
