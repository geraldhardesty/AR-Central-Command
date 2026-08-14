import React from "react";
import { DANGER, WARNING, GRAY_MEDIUM } from "../data/constants.js";

// SAP credit management hold reasons: "static" (this order exceeds the
// static credit limit) or "oldest" (an open item / invoice is past due).
// Stacked two lines, same pattern as a shipping carrier column: the
// human-readable status on top, the raw SAP code underneath in gray.
export default function StatusBadge({ status }) {
  const statusMap = {
    static: { label: "Limit Exceeded", code: "Static", color: DANGER },
    oldest: { label: "Delinquent", code: "Oldest", color: WARNING },
  };
  const m = statusMap[status] || { label: status || "Unknown", code: "", color: GRAY_MEDIUM };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", lineHeight: 1.3 }}>
      <span style={{ fontSize: "13px", fontWeight: 700, color: m.color, whiteSpace: "nowrap" }}>{m.label}</span>
      {m.code && <span style={{ fontSize: "11px", fontWeight: 600, color: GRAY_MEDIUM, whiteSpace: "nowrap" }}>{m.code}</span>}
    </div>
  );
}
