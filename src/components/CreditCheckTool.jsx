import React, { useState } from "react";
import { Search, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { YOKOGAWA_BLUE, YOKOGAWA_DARK, DANGER, DANGER_LIGHT, SUCCESS, SUCCESS_LIGHT, GRAY_LIGHT, GRAY_MEDIUM } from "../data/constants.js";
import { checkCustomerCredit } from "../data/sapCreditService.js";

// Rep-facing lookup: type a customer name, Customer ID, or address, and
// find out (a) whether they're currently on a delinquency credit hold and
// (b) their current available credit. No dependency on ARDashboard state —
// built this way on purpose, since this tool may migrate out of this
// dashboard into its own home later.
export default function CreditCheckTool() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchedFor, setSearchedFor] = useState("");

  const runSearch = async () => {
    if (!query.trim()) return;
    setStatus("loading");
    setSelected(null);
    const result = await checkCustomerCredit(query);
    setMatches(result.matches);
    setSearchedFor(result.query);
    setSelected(result.matches.length === 1 ? result.matches[0] : null);
    setStatus("done");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") runSearch();
  };

  return (
    <div>
      <style>{`
        @keyframes credit-check-spin { to { transform: rotate(360deg); } }
        .credit-check-spin { animation: credit-check-spin 0.8s linear infinite; display: inline-flex; }
      `}</style>

      <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "24px", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: YOKOGAWA_DARK, margin: "0 0 8px" }}>Customer Credit Check</h3>
        <p style={{ fontSize: "13px", color: GRAY_MEDIUM, margin: "0 0 20px", lineHeight: 1.6 }}>
          Look up whether a customer is currently on a delinquency credit hold, and their current
          available credit — credit limit minus open POs not yet paid, not counting any credit
          balance on the account. Search by Customer ID, company name, or billing address.
        </p>

        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: GRAY_MEDIUM }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Customer name, Customer ID, or address"
              style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #d0d5d9", borderRadius: "4px", fontSize: "13px" }}
            />
          </div>
          <button
            onClick={runSearch}
            disabled={status === "loading" || !query.trim()}
            style={{
              padding: "10px 20px", background: YOKOGAWA_BLUE, color: "white", border: "none",
              borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: status === "loading" ? "default" : "pointer",
              opacity: status === "loading" || !query.trim() ? 0.7 : 1, display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap",
            }}
          >
            {status === "loading" ? <Loader2 style={{ width: "14px", height: "14px" }} className="credit-check-spin" /> : null}
            {status === "loading" ? "Checking SAP…" : "Check Credit"}
          </button>
        </div>
      </div>

      {status === "done" && matches.length === 0 && (
        <div style={{ background: "white", padding: "40px", textAlign: "center", borderRadius: "4px", border: "1px solid #e0e0e0" }}>
          <AlertCircle style={{ width: "40px", height: "40px", margin: "0 auto 16px", color: GRAY_MEDIUM }} />
          <p style={{ fontSize: "14px", color: YOKOGAWA_DARK, fontWeight: 600, marginBottom: "4px" }}>No customer found matching "{searchedFor}"</p>
          <p style={{ fontSize: "13px", color: GRAY_MEDIUM }}>Try the Customer ID, full company name, or billing address.</p>
        </div>
      )}

      {status === "done" && matches.length > 1 && (
        <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden", marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: GRAY_MEDIUM, padding: "12px 16px", margin: 0, borderBottom: "1px solid #e0e0e0" }}>
            {matches.length} customers matched "{searchedFor}" — select one:
          </p>
          {matches.map((m) => (
            <button
              key={m.customerId}
              onClick={() => setSelected(m)}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
                padding: "12px 16px", border: "none", borderBottom: "1px solid #f0f0f0",
                background: selected?.customerId === m.customerId ? GRAY_LIGHT : "white",
                cursor: "pointer", textAlign: "left", fontSize: "13px",
              }}
            >
              <span style={{ fontWeight: 600, color: YOKOGAWA_DARK }}>{m.customerName}</span>
              <span style={{ color: GRAY_MEDIUM, fontFamily: "monospace", fontSize: "12px" }}>{m.customerId}</span>
            </button>
          ))}
        </div>
      )}

      {selected && <CreditResultCard result={selected} />}
    </div>
  );
}

function CreditResultCard({ result }) {
  const isNegative = result.availableCredit < 0;
  return (
    <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "16px", fontWeight: 700, color: YOKOGAWA_DARK, margin: "0 0 4px" }}>{result.customerName}</p>
          <p style={{ fontSize: "12px", color: GRAY_MEDIUM, margin: 0, fontFamily: "monospace" }}>{result.customerId}</p>
          <p style={{ fontSize: "12px", color: GRAY_MEDIUM, margin: "4px 0 0" }}>{result.address}</p>
        </div>
        {result.onDelinquencyHold ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, background: DANGER_LIGHT, color: DANGER, textTransform: "uppercase", letterSpacing: "0.3px" }}>
            <AlertCircle style={{ width: "14px", height: "14px" }} /> On Credit Hold — Delinquent
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, background: SUCCESS_LIGHT, color: SUCCESS, textTransform: "uppercase", letterSpacing: "0.3px" }}>
            <ShieldCheck style={{ width: "14px", height: "14px" }} /> Not on Delinquency Hold
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: GRAY_MEDIUM, textTransform: "uppercase", margin: "0 0 6px" }}>Credit Limit</p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0 }}>${result.creditLimit.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: GRAY_MEDIUM, textTransform: "uppercase", margin: "0 0 6px" }}>Open POs (Unpaid)</p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0 }}>${result.openExposure.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: GRAY_MEDIUM, textTransform: "uppercase", margin: "0 0 6px" }}>Available Credit</p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: isNegative ? DANGER : SUCCESS, margin: 0 }}>
            {isNegative ? "-" : ""}${Math.abs(result.availableCredit).toLocaleString()}
          </p>
        </div>
      </div>

      {result.openPOs.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase", margin: "0 0 8px" }}>Open POs contributing to exposure</p>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
            {result.openPOs.map((po) => (
              <div key={po.poNumber} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #f0f0f0", fontSize: "13px" }}>
                <span style={{ color: YOKOGAWA_BLUE, fontWeight: 600 }}>{po.poNumber}</span>
                <span>${po.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.creditBalance > 0 && (
        <p style={{ fontSize: "12px", color: GRAY_MEDIUM, background: GRAY_LIGHT, padding: "12px", borderRadius: "4px", borderLeft: `4px solid ${YOKOGAWA_BLUE}`, margin: 0 }}>
          This account also has a ${result.creditBalance.toLocaleString()} credit balance, not applied to the available credit above.
        </p>
      )}
    </div>
  );
}
