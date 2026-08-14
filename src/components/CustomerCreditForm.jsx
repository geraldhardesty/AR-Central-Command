import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { YOKOGAWA_YELLOW, YOKOGAWA_BLUE, YOKOGAWA_DARK, DANGER, GRAY_MEDIUM, WARNING, WARNING_LIGHT } from "../data/constants.js";
import { emptyCreditApplication, emptyTradeRef, emptyBankRef, savePublicApplication, findExistingMatch, todayISO } from "../data/utils.js";
import SignaturePad from "./SignaturePad.jsx";

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "8px 10px",
  border: `1px solid ${hasError ? DANGER : "#d0d5d9"}`,
  borderRadius: "4px",
  fontSize: "13px",
});

const labelStyle = { fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.3px" };

function Field({ label, error, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={{ fontSize: "11px", color: DANGER, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}

function ReferenceCard({ title, fields, value, onChange, errors }) {
  const set = (key, v) => onChange({ ...value, [key]: v });
  return (
    <div style={{ border: "1px solid #e0e0e0", borderRadius: "4px", padding: "16px", background: "#fafbfb" }}>
      <p style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, margin: "0 0 12px" }}>{title}</p>
      <div style={{ display: "grid", gap: "10px" }}>
        {fields.map(({ key, label, half }) => (
          <div key={key || half.map((h) => h.key).join("-")} style={half ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } : undefined}>
            {half ? (
              half.map((h) => (
                <Field key={h.key} label={h.label} error={errors?.[h.key]}>
                  <input type="text" value={value[h.key]} onChange={(e) => set(h.key, e.target.value)} style={inputStyle(errors?.[h.key])} />
                </Field>
              ))
            ) : (
              <Field label={label} error={errors?.[key]}>
                <input type="text" value={value[key]} onChange={(e) => set(key, e.target.value)} style={inputStyle(errors?.[key])} />
              </Field>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const TRADE_REF_FIELDS = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { half: [{ key: "city", label: "City" }, { key: "state", label: "State" }] },
  { half: [{ key: "zip", label: "Zip" }, { key: "phone", label: "Phone" }] },
  { half: [{ key: "fax", label: "Fax" }, { key: "email", label: "Email" }] },
  { key: "contact", label: "Contact" },
];

const BANK_REF_FIELDS = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { half: [{ key: "city", label: "City" }, { key: "state", label: "State" }] },
  { half: [{ key: "zip", label: "Zip" }, { key: "phone", label: "Phone" }] },
  { half: [{ key: "fax", label: "Fax" }, { key: "email", label: "Email" }] },
  { half: [{ key: "contact", label: "Contact" }, { key: "accountNumber", label: "Account #" }] },
];

export default function CustomerCreditForm() {
  const [app, setApp] = useState(emptyCreditApplication());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const existingMatch = findExistingMatch(app);

  const set = (key, v) => setApp({ ...app, [key]: v });
  const setTradeRef = (idx, next) => {
    const tradeRefs = [...app.tradeRefs];
    tradeRefs[idx] = next;
    set("tradeRefs", tradeRefs);
  };
  const setBankRef = (idx, next) => {
    const bankRefs = [...app.bankRefs];
    bankRefs[idx] = next;
    set("bankRefs", bankRefs);
  };

  const validate = () => {
    const e = {};
    if (!app.companyName) e.companyName = "Required";
    if (!app.address) e.address = "Required";
    if (!app.city) e.city = "Required";
    if (!app.state) e.state = "Required";
    if (!app.zip) e.zip = "Required";
    if (!app.accountingContact) e.accountingContact = "Required";
    if (!app.accountingPhone) e.accountingPhone = "Required";
    if (!app.accountingEmail) e.accountingEmail = "Required";
    if (!app.dnbNumber) e.dnbNumber = "Required";
    if (!app.creditLimitRequested) e.creditLimitRequested = "Required";
    if (!app.agreedToTerms) e.agreedToTerms = "You must agree to the terms to submit";
    if (!app.signerName) e.signerName = "Required";
    if (!app.signerTitle) e.signerTitle = "Required";
    if (!app.signatureDataUrl) e.signatureDataUrl = "A signature is required";
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const record = {
      id: crypto.randomUUID(),
      ...app,
      riskScore: Math.floor(Math.random() * 100),
      status: "submitted",
      source: "customer_link",
      submittedAt: new Date().toISOString(),
    };
    savePublicApplication(record);
    setSubmitted(record);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f8f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "6px", padding: "48px", maxWidth: "480px", textAlign: "center" }}>
          <CheckCircle2 style={{ width: "48px", height: "48px", color: "#00a04c", margin: "0 auto 20px" }} />
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: YOKOGAWA_DARK, margin: "0 0 12px" }}>Application submitted</h1>
          <p style={{ fontSize: "14px", color: GRAY_MEDIUM, lineHeight: 1.6, margin: "0 0 20px" }}>
            Thank you. Yokogawa's AR team has received {app.companyName}'s credit application and will follow up shortly.
          </p>
          <p style={{ fontSize: "12px", color: GRAY_MEDIUM, fontFamily: "monospace" }}>Reference: {submitted.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6" }}>
      <div style={{ background: YOKOGAWA_BLUE, color: "white", padding: "8px 24px", textAlign: "center", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
        DEMO — for internal review only. Nothing submitted here reaches a real AR system yet.
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "4px" }}>
          <span style={{ width: "26px", height: "26px", background: YOKOGAWA_YELLOW, transform: "rotate(45deg)", display: "inline-block", flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0 }}>Yokogawa Corporation of America</h1>
            <p style={{ fontSize: "14px", color: GRAY_MEDIUM, margin: "2px 0 0" }}>Customer Credit Information Form</p>
          </div>
        </div>

        <div style={{ height: "3px", background: YOKOGAWA_YELLOW, margin: "20px 0 32px" }} />

        {existingMatch && (
          <div style={{ background: WARNING_LIGHT, border: `1px solid ${WARNING}`, borderRadius: "4px", padding: "12px 16px", marginBottom: "24px", fontSize: "13px", color: WARNING }}>
            A customer matching this name or D&amp;B number already has an account with Yokogawa ({existingMatch.sapId}). You can still submit — the AR team will confirm.
          </div>
        )}

        {/* Company info */}
        <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Company Name" error={errors.companyName}>
              <input type="text" value={app.companyName} onChange={(e) => set("companyName", e.target.value)} style={inputStyle(errors.companyName)} />
            </Field>
            <Field label="D&B Number (Dun &amp; Bradstreet #)" error={errors.dnbNumber}>
              <input type="text" value={app.dnbNumber} onChange={(e) => set("dnbNumber", e.target.value)} placeholder="XX-XXX-XXXX" style={inputStyle(errors.dnbNumber)} />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Customer Address" error={errors.address}>
                <input type="text" value={app.address} onChange={(e) => set("address", e.target.value)} style={inputStyle(errors.address)} />
              </Field>
            </div>
            <Field label="City" error={errors.city}>
              <input type="text" value={app.city} onChange={(e) => set("city", e.target.value)} style={inputStyle(errors.city)} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Field label="State" error={errors.state}>
                <input type="text" value={app.state} onChange={(e) => set("state", e.target.value)} style={inputStyle(errors.state)} />
              </Field>
              <Field label="Zip Code" error={errors.zip}>
                <input type="text" value={app.zip} onChange={(e) => set("zip", e.target.value)} style={inputStyle(errors.zip)} />
              </Field>
            </div>
            <Field label="Accounting Contact" error={errors.accountingContact}>
              <input type="text" value={app.accountingContact} onChange={(e) => set("accountingContact", e.target.value)} style={inputStyle(errors.accountingContact)} />
            </Field>
            <Field label="Accounting Phone #" error={errors.accountingPhone}>
              <input type="text" value={app.accountingPhone} onChange={(e) => set("accountingPhone", e.target.value)} style={inputStyle(errors.accountingPhone)} />
            </Field>
            <Field label="Accounting Fax">
              <input type="text" value={app.accountingFax} onChange={(e) => set("accountingFax", e.target.value)} style={inputStyle(false)} />
            </Field>
            <Field label="Accounting Email" error={errors.accountingEmail}>
              <input type="email" value={app.accountingEmail} onChange={(e) => set("accountingEmail", e.target.value)} style={inputStyle(errors.accountingEmail)} />
            </Field>
          </div>
        </div>

        {/* Trade references */}
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "white", background: YOKOGAWA_DARK, padding: "8px 12px", borderRadius: "3px", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Trade References
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {app.tradeRefs.map((ref, idx) => (
            <ReferenceCard key={ref.id} title={`Reference ${idx + 1}`} fields={TRADE_REF_FIELDS} value={ref} onChange={(next) => setTradeRef(idx, next)} />
          ))}
        </div>

        {/* Bank references */}
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "white", background: YOKOGAWA_DARK, padding: "8px 12px", borderRadius: "3px", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Bank References
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {app.bankRefs.map((ref, idx) => (
            <ReferenceCard key={ref.id} title={`Bank Reference ${idx + 1}`} fields={BANK_REF_FIELDS} value={ref} onChange={(next) => setBankRef(idx, next)} />
          ))}
        </div>

        {/* Credit terms */}
        <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: YOKOGAWA_DARK, margin: "0 0 16px" }}>
            Yokogawa's standard payment terms are Net 30 upon credit approval.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Credit Limit Requested ($)" error={errors.creditLimitRequested}>
              <input type="number" value={app.creditLimitRequested} onChange={(e) => set("creditLimitRequested", e.target.value)} style={inputStyle(errors.creditLimitRequested)} />
            </Field>
            <Field label="Finance / Account Contact">
              <input type="text" value={app.financeContact} onChange={(e) => set("financeContact", e.target.value)} style={inputStyle(false)} />
            </Field>
          </div>
        </div>

        {/* Terms + signature */}
        <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "24px" }}>
          <p style={{ fontSize: "11px", color: GRAY_MEDIUM, lineHeight: 1.6, margin: "0 0 16px" }}>
            We authorize the above references to release account information to Yokogawa Corporation of America.
            Yokogawa Corporation of America's standard terms apply. Find them at{" "}
            <a href="https://www.yokogawa.com/us/terms/" target="_blank" rel="noreferrer">yokogawa.com/us/terms</a>.
            We reserve the right to offer different credit terms upon receipt of your credit request. Accounts beyond
            60 days may result in withdrawal of credit approval or restrictions on future orders. In the event a suit
            is necessary to collect any amount, the customer agrees to pay the seller's reasonable attorney fees and costs.
          </p>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: YOKOGAWA_DARK, marginBottom: "20px", cursor: "pointer" }}>
            <input type="checkbox" checked={app.agreedToTerms} onChange={(e) => set("agreedToTerms", e.target.checked)} style={{ marginTop: "2px" }} />
            I have read and agree to the terms above
          </label>
          {errors.agreedToTerms && <p style={{ fontSize: "11px", color: DANGER, margin: "-14px 0 20px" }}>{errors.agreedToTerms}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <Field label="Signature (type your name)" error={errors.signerName}>
              <input type="text" value={app.signerName} onChange={(e) => set("signerName", e.target.value)} style={inputStyle(errors.signerName)} />
            </Field>
            <Field label="Title" error={errors.signerTitle}>
              <input type="text" value={app.signerTitle} onChange={(e) => set("signerTitle", e.target.value)} style={inputStyle(errors.signerTitle)} />
            </Field>
          </div>

          <Field label="Date">
            <input type="text" value={app.signedDate ?? todayISO()} readOnly style={{ ...inputStyle(false), maxWidth: "160px", background: "#f8f8f6", color: GRAY_MEDIUM }} />
          </Field>

          <div style={{ marginTop: "16px" }}>
            <label style={labelStyle}>Draw your signature</label>
            <SignaturePad value={app.signatureDataUrl} onChange={(dataUrl) => set("signatureDataUrl", dataUrl)} />
            {errors.signatureDataUrl && <p style={{ fontSize: "11px", color: DANGER, margin: "6px 0 0" }}>{errors.signatureDataUrl}</p>}
          </div>
        </div>

        <button
          onClick={submit}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "14px",
            background: YOKOGAWA_YELLOW,
            color: YOKOGAWA_DARK,
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
