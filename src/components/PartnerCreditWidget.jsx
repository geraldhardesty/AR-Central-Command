import React, { useState } from "react";
import { Search, Loader2, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { YOKOGAWA_YELLOW, YOKOGAWA_BLUE, YOKOGAWA_DARK, DANGER, DANGER_LIGHT, WARNING, WARNING_LIGHT, SUCCESS, SUCCESS_LIGHT, GRAY_LIGHT, GRAY_MEDIUM } from "../data/constants.js";
import { checkOrderCreditRisk } from "../data/sapCreditService.js";

const RISK_DISPLAY = {
  delinquent_hold: { Icon: AlertCircle, bg: DANGER_LIGHT, color: DANGER },
  would_exceed_limit: { Icon: AlertTriangle, bg: WARNING_LIGHT, color: WARNING },
  clear: { Icon: CheckCircle2, bg: SUCCESS_LIGHT, color: SUCCESS },
};

// Standalone, sales-partner-facing widget: enter a customer plus a
// potential order amount, get back a plain go/no-go read on credit
// standing. No dependency on ARDashboard state or the internal
// CreditCheckTool — this is meant to live on its own, possibly outside
// this dashboard entirely, so it only talks to sapCreditService.js.
export default function PartnerCreditWidget() {
  const [query, setQuery] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchedFor, setSearchedFor] = useState("");
  const [error, setError] = useState("");

  const runCheck = async () => {
    if (!query.trim()) {
      setError("Enter a customer name, Customer ID, or address.");
      return;
    }
    if (!orderAmount || Number(orderAmount) <= 0) {
      setError("Enter the potential order amount.");
      return;
    }
    setError("");
    setStatus("loading");
    setSelected(null);
    const result = await checkOrderCreditRisk(query, orderAmount);
    setMatches(result.matches);
    setSearchedFor(result.query);
    setSelected(result.matches.length === 1 ? result.matches[0] : null);
    setStatus("done");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") runCheck();
  };

  return (
    <div style={{ minHeight: "100vh", background: GRAY_LIGHT }}>
      <style>{`
        @keyframes partner-credit-spin { to { transform: rotate(360deg); } }
        .partner-credit-spin { animation: partner-credit-spin 0.8s linear infinite; display: inline-flex; }
      `}</style>

      <div style={{ background: YOKOGAWA_BLUE, color: "white", padding: "8px 24px", textAlign: "center", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
        DEMO — for internal review only. Nothing checked here reaches real SAP yet.
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ width: "20px", height: "20px", background: YOKOGAWA_YELLOW, transform: "rotate(45deg)", display: "inline-block", flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0 }}>Yokogawa Corporation of America</h1>
            <p style={{ fontSize: "13px", color: GRAY_MEDIUM, margin: "2px 0 0" }}>Partner Credit Check</p>
          </div>
        </div>

        <div style={{ height: "3px", background: YOKOGAWA_BLUE, margin: "18px 0 28px" }} />

        <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "24px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: GRAY_MEDIUM, margin: "0 0 20px", lineHeight: 1.6 }}>
            Before submitting a PO, check whether this customer is already on credit hold, or
            whether this order would put them over their credit limit.
          </p>

          <label style={{ fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase", letterSpacing: "0.3px", display: "block", marginBottom: "6px" }}>
            Customer
          </label>
          <div style={{ position: "relative", marginBottom: "16px" }}>
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

          <label style={{ fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase", letterSpacing: "0.3px", display: "block", marginBottom: "6px" }}>
            Potential Order Amount ($)
          </label>
          <input
            type="number"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0d5d9", borderRadius: "4px", fontSize: "13px", marginBottom: "20px" }}
          />

          {error && <p style={{ fontSize: "12px", color: DANGER, margin: "-12px 0 16px" }}>{error}</p>}

          <button
            onClick={runCheck}
            disabled={status === "loading"}
            style={{
              width: "100%", padding: "12px", background: YOKOGAWA_BLUE, color: "white", border: "none",
              borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: status === "loading" ? "default" : "pointer",
              opacity: status === "loading" ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {status === "loading" ? <Loader2 style={{ width: "14px", height: "14px" }} className="partner-credit-spin" /> : null}
            {status === "loading" ? "Checking SAP…" : "Check Credit"}
          </button>
        </div>

        {status === "done" && matches.length === 0 && (
          <div style={{ background: "white", padding: "32px", textAlign: "center", borderRadius: "4px", border: "1px solid #e0e0e0" }}>
            <AlertCircle style={{ width: "36px", height: "36px", margin: "0 auto 12px", color: GRAY_MEDIUM }} />
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

        {selected && <RiskResult result={selected} />}
      </div>
    </div>
  );
}

function RiskResult({ result }) {
  const { Icon, bg, color } = RISK_DISPLAY[result.riskStatus] || RISK_DISPLAY.clear;
  return (
    <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ background: bg, padding: "20px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Icon style={{ width: "22px", height: "22px", color, flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p style={{ fontSize: "15px", fontWeight: 700, color, margin: 0 }}>{result.riskMessage}</p>
          <p style={{ fontSize: "12px", color: YOKOGAWA_DARK, margin: "4px 0 0" }}>{result.customerName} · {result.customerId}</p>
        </div>
      </div>
      <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: GRAY_MEDIUM, textTransform: "uppercase", margin: "0 0 4px" }}>Available Credit</p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0 }}>
            {result.availableCredit < 0 ? "-" : ""}${Math.abs(result.availableCredit).toLocaleString()}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: GRAY_MEDIUM, textTransform: "uppercase", margin: "0 0 4px" }}>This Order</p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0 }}>${Number(result.orderAmount || 0).toLocaleString()}</p>
        </div>
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: GRAY_MEDIUM, textTransform: "uppercase", margin: "0 0 4px" }}>Credit Limit</p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0 }}>${result.creditLimit.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
