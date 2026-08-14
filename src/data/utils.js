import { EXISTING_CUSTOMERS } from "./mockData.js";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const emptyForm = () => ({
  submittedBy: "",
  submissionDate: todayISO(),
  companyName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  dnbNumber: "",
  accountingContact: "",
  accountingPhone: "",
  accountingEmail: "",
  creditLimitRequested: "",
  paymentTerms: "Net 30",
  tradeRefs: [{ id: crypto.randomUUID(), name: "", phone: "", contact: "" }],
  bankRef: { name: "", contact: "", phone: "" },
  comments: "",
});

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
