import React, { useState, useMemo } from "react";
import {
  AlertCircle, Building2, FileSearch, ShieldCheck, Plus, CheckCircle2, XCircle,
  Trash2, Loader2, TrendingUp, DollarSign, Clock, Mail, Lock, Unlock, Send,
  Calendar, Phone, FileText, ChevronDown, Settings, RefreshCw, Filter, Search,
  Landmark, ClipboardList, DatabaseZap, Info, ArrowRight, ArrowLeft
} from "lucide-react";

import {
  YOKOGAWA_YELLOW, YOKOGAWA_BLUE, YOKOGAWA_DARK, DANGER, DANGER_LIGHT, WARNING, WARNING_LIGHT,
  SUCCESS, SUCCESS_LIGHT, GRAY_LIGHT, GRAY_MEDIUM,
  AUTO_APPROVE_MIN_SCORE, AUTO_APPROVE_MAX_LIMIT, AUTO_APPROVE_LIST,
} from "../data/constants.js";
import { mockHolds, mockDelinquent } from "../data/mockData.js";
import { emptyForm, findExistingMatch } from "../data/utils.js";
import MetricCard from "./MetricCard.jsx";
import StatusBadge from "./StatusBadge.jsx";

// Main App
export default function ARDashboard() {
  const [mainTab, setMainTab] = useState("holds");
  const [subTab, setSubTab] = useState("holds");
  const [expandedRow, setExpandedRow] = useState(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(emptyForm());
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const [sapRecords, setSapRecords] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [existingMatch, setExistingMatch] = useState(null);

  const handleFormChange = (field, value) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    setExistingMatch(findExistingMatch(newForm));
  };

  const submitForm = () => {
    const errors = {};
    if (!form.submittedBy) errors.submittedBy = "Required";
    if (!form.companyName) errors.companyName = "Required";
    if (!form.dnbNumber) errors.dnbNumber = "Required";
    if (!form.accountingContact) errors.accountingContact = "Required";
    if (!form.creditLimitRequested) errors.creditLimitRequested = "Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const riskScore = Math.floor(Math.random() * 100);
    const newRequest = {
      id: crypto.randomUUID(),
      ...form,
      riskScore,
      status: riskScore >= AUTO_APPROVE_MIN_SCORE && form.creditLimitRequested <= AUTO_APPROVE_MAX_LIMIT ? "auto_approved" : "submitted",
      submittedAt: new Date().toISOString(),
    };

    setSubmittedRequests([newRequest, ...submittedRequests]);
    setForm(emptyForm());
    setFormErrors({});
    setExistingMatch(null);
  };

  const pushToSap = (requestId) => {
    const request = submittedRequests.find(r => r.id === requestId);
    if (!request) return;

    const newSapRecord = {
      id: crypto.randomUUID(),
      sapId: `SAP-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      companyName: request.companyName,
      dnbNumber: request.dnbNumber,
      city: request.city,
      state: request.state,
      creditLimitRequested: request.creditLimitRequested,
      paymentTerms: request.paymentTerms,
      sapPushedAt: new Date().toISOString(),
      autoApproved: request.status === "auto_approved",
    };

    setSapRecords([...sapRecords, newSapRecord]);
  };

  // Calculate metrics
  const totalOnHold = mockHolds.length;
  const totalHoldAmount = mockHolds.reduce((sum, h) => sum + h.amount, 0);
  const autoApproveReady = mockHolds.filter(h => AUTO_APPROVE_LIST.includes(h.rep) && h.status === "pending_approval").length;
  const delinquentCount = mockDelinquent.length;
  const pendingRequests = submittedRequests.filter(r => r.status === "submitted").length;

  const filteredHolds = useMemo(() => {
    if (filter === "all") return mockHolds;
    if (filter === "auto_approve") return mockHolds.filter(h => AUTO_APPROVE_LIST.includes(h.rep));
    return mockHolds;
  }, [filter]);

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        button { cursor: pointer; }
        input, select, textarea { font-family: inherit; }
        a { color: ${YOKOGAWA_BLUE}; text-decoration: none; }
      `}</style>

      {/* Top bar */}
      <div style={{ background: YOKOGAWA_BLUE, color: "white", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <span style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "0.5px" }}>YOKOGAWA</span>
            <span style={{ width: "11px", height: "11px", background: YOKOGAWA_YELLOW, transform: "rotate(45deg)", display: "inline-block", flexShrink: 0 }} />
          </div>
          <span style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.35)" }} />
          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>AR & Credit Management</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "3px",
            padding: "3px 8px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: "rgba(255,255,255,0.85)",
          }}>DEMO DATA</span>
          <a href="#" style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Support</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Docs</a>
        </div>
      </div>
      <div style={{ height: "3px", background: YOKOGAWA_YELLOW }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "white", padding: "40px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0, marginBottom: "8px", letterSpacing: "-0.5px" }}>
                AR & Credit Management
              </h1>
              <p style={{ fontSize: "14px", color: GRAY_MEDIUM, margin: 0 }}>
                Credit holds, collections, auto-approvals, and customer onboarding
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{
                padding: "10px 16px",
                border: `1px solid #d0d5d9`,
                borderRadius: "4px",
                background: "white",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: YOKOGAWA_DARK,
                cursor: "pointer",
              }}>
                <RefreshCw style={{ width: "16px", height: "16px" }} /> Refresh
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <MetricCard icon={AlertCircle} label="On Hold" value={totalOnHold} sublabel={`$${(totalHoldAmount / 1000).toFixed(0)}K`} color="danger" />
            <MetricCard icon={Unlock} label="Auto-Approve Ready" value={autoApproveReady} sublabel={`${AUTO_APPROVE_LIST.length} whitelisted`} color="yellow" />
            <MetricCard icon={Clock} label="Delinquent" value={delinquentCount} sublabel="Aging tracking" color="danger" />
            <MetricCard icon={Plus} label="Pending Onboarding" value={pendingRequests} sublabel="New customer approvals" color="warning" />
          </div>
        </div>

        {/* Main Tabs */}
        <div style={{ background: "white", borderBottom: `1px solid #e0e0e0`, padding: "0 24px", display: "flex", gap: "32px", position: "sticky", top: 0, zIndex: 10 }}>
          {[
            { id: "holds", label: "Credit Holds & Collections" },
            { id: "onboarding", label: "Customer Onboarding" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setMainTab(tab.id);
                setSubTab(tab.id === "holds" ? "holds" : "intake");
              }}
              style={{
                padding: "16px 0",
                border: "none",
                background: "none",
                fontSize: "14px",
                fontWeight: mainTab === tab.id ? 600 : 500,
                color: mainTab === tab.id ? YOKOGAWA_DARK : GRAY_MEDIUM,
                borderBottom: mainTab === tab.id ? `2px solid ${YOKOGAWA_YELLOW}` : "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "24px", background: GRAY_LIGHT }}>
          {/* Credit Holds & Collections Tab */}
          {mainTab === "holds" && (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "20px", background: "white", padding: "12px 16px", borderRadius: "4px", borderBottom: `1px solid #e0e0e0` }}>
                {[
                  { id: "holds", label: "Credit Holds" },
                  { id: "delinquent", label: "Delinquent Aging" },
                  { id: "automation", label: "Email Automation" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSubTab(tab.id)}
                    style={{
                      padding: "8px 12px",
                      border: "none",
                      background: subTab === tab.id ? YOKOGAWA_YELLOW : "transparent",
                      color: subTab === tab.id ? YOKOGAWA_DARK : GRAY_MEDIUM,
                      borderRadius: "3px",
                      fontSize: "13px",
                      fontWeight: subTab === tab.id ? 600 : 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Holds Sub-tab */}
              {subTab === "holds" && (
                <div>
                  <div style={{ 
                    background: "white", 
                    border: `1px solid #e0e0e0`, 
                    borderRadius: "4px", 
                    padding: "16px", 
                    marginBottom: "20px",
                    display: "flex",
                    gap: "12px",
                  }}>
                    <Filter style={{ width: "18px", height: "18px", color: GRAY_MEDIUM }} />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        border: `1px solid #e0e0e0`,
                        borderRadius: "4px",
                        fontSize: "13px",
                        background: "white",
                        color: YOKOGAWA_DARK,
                        cursor: "pointer",
                      }}
                    >
                      <option value="all">All holds</option>
                      <option value="auto_approve">Auto-approve ready</option>
                    </select>
                  </div>

                  {autoApproveReady > 0 && (
                    <div style={{
                      background: YOKOGAWA_YELLOW,
                      border: `1px solid #e6d500`,
                      borderRadius: "4px",
                      padding: "16px",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0, marginBottom: "4px" }}>
                          {autoApproveReady} order{autoApproveReady !== 1 ? "s" : ""} ready to release
                        </p>
                        <p style={{ fontSize: "12px", color: YOKOGAWA_DARK, margin: 0, opacity: 0.8 }}>
                          {AUTO_APPROVE_LIST.join(", ")} — whitelisted for auto-approval
                        </p>
                      </div>
                      <button style={{
                        padding: "10px 16px",
                        background: YOKOGAWA_DARK,
                        color: YOKOGAWA_YELLOW,
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}>
                        Execute Release
                      </button>
                    </div>
                  )}

                  <div style={{ background: "white", border: `1px solid #e0e0e0`, borderRadius: "4px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: GRAY_LIGHT, borderBottom: `1px solid #e0e0e0` }}>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Order</th>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Customer</th>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Amount</th>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Status</th>
                          <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHolds.map((hold) => (
                          <tr key={hold.id} style={{ borderBottom: `1px solid #f0f0f0` }}>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: YOKOGAWA_BLUE }}>{hold.id}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>{hold.customer}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>${hold.amount.toLocaleString()}</td>
                            <td style={{ padding: "14px 16px" }}><StatusBadge status={hold.status} /></td>
                            <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: 600, color: hold.daysOnHold > 7 ? DANGER : WARNING }}>{hold.daysOnHold}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Delinquent Sub-tab */}
              {subTab === "delinquent" && (
                <div>
                  <p style={{ fontSize: "13px", color: GRAY_MEDIUM, marginBottom: "16px" }}>
                    Invoices past due. Auto-reminders sent weekly; escalation at 90+ days.
                  </p>
                  <div style={{ background: "white", border: `1px solid #e0e0e0`, borderRadius: "4px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: GRAY_LIGHT, borderBottom: `1px solid #e0e0e0` }}>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Invoice</th>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Customer</th>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Amount</th>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Days Overdue</th>
                          <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Emails Sent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockDelinquent.map((d) => (
                          <tr key={d.invoiceNumber} style={{ borderBottom: `1px solid #f0f0f0` }}>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: YOKOGAWA_BLUE }}>{d.invoiceNumber}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>{d.customer}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>${d.amount.toLocaleString()}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: d.daysOverdue > 60 ? DANGER : WARNING }}>{d.daysOverdue}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px" }}>{d.emailsSent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Email Automation Sub-tab */}
              {subTab === "automation" && (
                <div>
                  <div style={{
                    background: YOKOGAWA_YELLOW,
                    border: `1px solid #e6d500`,
                    borderRadius: "4px",
                    padding: "16px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: YOKOGAWA_DARK, margin: 0, marginBottom: "4px" }}>
                        3 reminders scheduled for Monday
                      </p>
                      <p style={{ fontSize: "12px", color: YOKOGAWA_DARK, margin: 0, opacity: 0.8 }}>
                        Auto-email workflow active
                      </p>
                    </div>
                    <button style={{
                      padding: "10px 16px",
                      background: YOKOGAWA_DARK,
                      color: YOKOGAWA_YELLOW,
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}>
                      Send Now
                    </button>
                  </div>
                  <p style={{ fontSize: "12px", color: GRAY_MEDIUM, background: "white", padding: "12px", borderRadius: "4px", borderLeft: `4px solid ${YOKOGAWA_YELLOW}`, margin: 0 }}>
                    Email automation configured. Next batch sends Monday 8:00 AM.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Customer Onboarding Tab */}
          {mainTab === "onboarding" && (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "20px", background: "white", padding: "12px 16px", borderRadius: "4px", borderBottom: `1px solid #e0e0e0` }}>
                {[
                  { id: "intake", label: "New Customer Intake" },
                  { id: "queue", label: "Queue" },
                  { id: "approved", label: "Approved" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSubTab(tab.id)}
                    style={{
                      padding: "8px 12px",
                      border: "none",
                      background: subTab === tab.id ? YOKOGAWA_YELLOW : "transparent",
                      color: subTab === tab.id ? YOKOGAWA_DARK : GRAY_MEDIUM,
                      borderRadius: "3px",
                      fontSize: "13px",
                      fontWeight: subTab === tab.id ? 600 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Intake Form Sub-tab */}
              {subTab === "intake" && (
                <div>
                  {existingMatch && (
                    <div style={{
                      background: WARNING_LIGHT,
                      border: `1px solid ${WARNING}`,
                      borderRadius: "4px",
                      padding: "12px 16px",
                      marginBottom: "20px",
                      fontSize: "13px",
                      color: WARNING,
                    }}>
                      ⚠️ Duplicate detected: <strong>{existingMatch.companyName}</strong> already exists in SAP ({existingMatch.sapId})
                    </div>
                  )}

                  <div style={{ background: "white", border: `1px solid #e0e0e0`, borderRadius: "4px", padding: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: YOKOGAWA_DARK, marginBottom: "20px", margin: 0 }}>New Customer Credit Application</h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "6px" }}>
                          Submitted By *
                        </label>
                        <input
                          type="text"
                          value={form.submittedBy}
                          onChange={(e) => handleFormChange("submittedBy", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: `1px solid ${formErrors.submittedBy ? DANGER : "#e0e0e0"}`,
                            borderRadius: "4px",
                            fontSize: "13px",
                          }}
                          placeholder="Sales rep name"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "6px" }}>
                          Company Name *
                        </label>
                        <input
                          type="text"
                          value={form.companyName}
                          onChange={(e) => handleFormChange("companyName", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: `1px solid ${formErrors.companyName ? DANGER : "#e0e0e0"}`,
                            borderRadius: "4px",
                            fontSize: "13px",
                          }}
                          placeholder="Legal company name"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "6px" }}>
                          D&B Number *
                        </label>
                        <input
                          type="text"
                          value={form.dnbNumber}
                          onChange={(e) => handleFormChange("dnbNumber", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: `1px solid ${formErrors.dnbNumber ? DANGER : "#e0e0e0"}`,
                            borderRadius: "4px",
                            fontSize: "13px",
                          }}
                          placeholder="XX-XXX-XXXX"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "6px" }}>
                          Credit Limit Requested *
                        </label>
                        <input
                          type="number"
                          value={form.creditLimitRequested}
                          onChange={(e) => handleFormChange("creditLimitRequested", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: `1px solid ${formErrors.creditLimitRequested ? DANGER : "#e0e0e0"}`,
                            borderRadius: "4px",
                            fontSize: "13px",
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "6px" }}>City</label>
                        <input type="text" value={form.city} onChange={(e) => handleFormChange("city", e.target.value)} style={{ width: "100%", padding: "8px 12px", border: `1px solid #e0e0e0`, borderRadius: "4px", fontSize: "13px" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "6px" }}>State</label>
                        <input type="text" value={form.state} onChange={(e) => handleFormChange("state", e.target.value)} style={{ width: "100%", padding: "8px 12px", border: `1px solid #e0e0e0`, borderRadius: "4px", fontSize: "13px" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: YOKOGAWA_DARK, display: "block", marginBottom: "6px" }}>Zip</label>
                        <input type="text" value={form.zip} onChange={(e) => handleFormChange("zip", e.target.value)} style={{ width: "100%", padding: "8px 12px", border: `1px solid #e0e0e0`, borderRadius: "4px", fontSize: "13px" }} />
                      </div>
                    </div>

                    <button
                      onClick={submitForm}
                      style={{
                        padding: "12px 24px",
                        background: YOKOGAWA_YELLOW,
                        color: YOKOGAWA_DARK,
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              )}

              {/* Queue Sub-tab */}
              {subTab === "queue" && (
                <div>
                  {submittedRequests.length === 0 ? (
                    <div style={{ background: "white", padding: "40px", textAlign: "center", borderRadius: "4px", border: `1px solid #e0e0e0` }}>
                      <ClipboardList style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: GRAY_MEDIUM }} />
                      <p style={{ fontSize: "14px", color: GRAY_MEDIUM }}>No applications in queue</p>
                    </div>
                  ) : (
                    <div style={{ background: "white", border: `1px solid #e0e0e0`, borderRadius: "4px", overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: GRAY_LIGHT, borderBottom: `1px solid #e0e0e0` }}>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Company</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Requested Limit</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Risk Score</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Status</th>
                            <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submittedRequests.map((req) => (
                            <tr key={req.id} style={{ borderBottom: `1px solid #f0f0f0` }}>
                              <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>{req.companyName}</td>
                              <td style={{ padding: "14px 16px", fontSize: "13px" }}>${Number(req.creditLimitRequested).toLocaleString()}</td>
                              <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: req.riskScore >= AUTO_APPROVE_MIN_SCORE ? SUCCESS : WARNING }}>{req.riskScore}</td>
                              <td style={{ padding: "14px 16px" }}>
                                <span style={{
                                  display: "inline-block",
                                  padding: "4px 10px",
                                  borderRadius: "3px",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  background: req.status === "auto_approved" ? YOKOGAWA_YELLOW : WARNING_LIGHT,
                                  color: req.status === "auto_approved" ? YOKOGAWA_DARK : WARNING,
                                  textTransform: "uppercase",
                                }}>
                                  {req.status === "auto_approved" ? "Auto-Approved" : "Submitted"}
                                </span>
                              </td>
                              <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                <button
                                  onClick={() => pushToSap(req.id)}
                                  style={{
                                    padding: "6px 12px",
                                    background: SUCCESS,
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Push to SAP
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Approved Sub-tab (SAP Master) */}
              {subTab === "approved" && (
                <div>
                  {sapRecords.length === 0 ? (
                    <div style={{ background: "white", padding: "40px", textAlign: "center", borderRadius: "4px", border: `1px solid #e0e0e0` }}>
                      <Landmark style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: GRAY_MEDIUM }} />
                      <p style={{ fontSize: "14px", color: GRAY_MEDIUM }}>No customers in SAP yet</p>
                    </div>
                  ) : (
                    <div style={{ background: "white", border: `1px solid #e0e0e0`, borderRadius: "4px", overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: GRAY_LIGHT, borderBottom: `1px solid #e0e0e0` }}>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>SAP ID</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Company</th>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>D&B Number</th>
                            <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Credit Limit</th>
                            <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 700, color: YOKOGAWA_DARK, textTransform: "uppercase" }}>Pushed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sapRecords.map((rec) => (
                            <tr key={rec.id} style={{ borderBottom: `1px solid #f0f0f0` }}>
                              <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: YOKOGAWA_BLUE }}>{rec.sapId}</td>
                              <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>{rec.companyName}</td>
                              <td style={{ padding: "14px 16px", fontSize: "13px" }}>{rec.dnbNumber}</td>
                              <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: 600 }}>${Number(rec.creditLimitRequested).toLocaleString()}</td>
                              <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "11px", color: GRAY_MEDIUM }}>
                                {rec.autoApproved && <span style={{ marginRight: "8px", fontSize: "10px", fontWeight: 700, background: YOKOGAWA_YELLOW, color: YOKOGAWA_DARK, padding: "2px 6px", borderRadius: "2px", textTransform: "uppercase" }}>auto</span>}
                                {new Date(rec.sapPushedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
