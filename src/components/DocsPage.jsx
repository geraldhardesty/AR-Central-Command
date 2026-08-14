import React from "react";
import { ArrowLeft } from "lucide-react";
import { YOKOGAWA_YELLOW, YOKOGAWA_BLUE, YOKOGAWA_DARK, GRAY_LIGHT, GRAY_MEDIUM } from "../data/constants.js";
import { WHITELISTED_ACCOUNTS } from "../data/mockData.js";

// Stand-in for a real admin/config screen. This is the "backend" for the
// whitelist the Credit Holds dashboard uses to highlight auto-approve-ready
// accounts, until that list is moved to an actual API.
export default function DocsPage() {
  return (
    <div style={{ minHeight: "100vh", background: GRAY_LIGHT }}>
      <div style={{ background: YOKOGAWA_BLUE, color: "white", padding: "14px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "0.5px" }}>YOKOGAWA</span>
        <span style={{ width: "11px", height: "11px", background: YOKOGAWA_YELLOW, transform: "rotate(45deg)", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.35)" }} />
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>AR & Credit Management — Docs</span>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
        <a href="." style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: YOKOGAWA_BLUE, marginBottom: "24px", textDecoration: "none" }}>
          <ArrowLeft style={{ width: "14px", height: "14px" }} /> Back to dashboard
        </a>

        <h1 style={{ fontSize: "22px", fontWeight: 700, color: YOKOGAWA_DARK, margin: "0 0 8px" }}>Whitelisted Accounts</h1>
        <p style={{ fontSize: "13px", color: GRAY_MEDIUM, margin: "0 0 24px", lineHeight: 1.6 }}>
          Accounts below are matched by Customer ID against SAP credit holds. A hold on a whitelisted
          account is highlighted on the dashboard as auto-approve ready when the hold reason is a static
          credit limit check — the assumption being these are trusted accounts where an over-limit order
          is a formality, not a risk signal. An account on hold for a genuinely overdue invoice ("Oldest
          Open Item") is never auto-approved, whitelisted or not.
        </p>

        <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden", marginBottom: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: GRAY_LIGHT, borderBottom: "1px solid #e0e0e0" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Customer ID</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Customer Name</th>
              </tr>
            </thead>
            <tbody>
              {WHITELISTED_ACCOUNTS.map((a) => (
                <tr key={a.customerId} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontFamily: "monospace", color: GRAY_MEDIUM }}>{a.customerId}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: YOKOGAWA_DARK }}>{a.customerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: "12px", color: GRAY_MEDIUM, background: "white", padding: "12px", borderRadius: "4px", borderLeft: `4px solid ${YOKOGAWA_BLUE}`, margin: 0 }}>
          TODO: this is a stand-in for a real backend. Move this list to an admin-configurable setting
          (backend/API-driven) so AR managers can add or remove accounts without a code change.
        </p>
      </div>
    </div>
  );
}
