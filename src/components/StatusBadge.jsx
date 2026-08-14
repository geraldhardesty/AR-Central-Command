import React from "react";
import { DANGER, DANGER_LIGHT, WARNING, WARNING_LIGHT, GRAY_LIGHT, GRAY_MEDIUM } from "../data/constants.js";

// SAP credit management hold reasons: "static" (this order exceeds the
// static credit limit) or "oldest" (an open item / invoice is past due).
export default function StatusBadge({ status }) {
  const statusMap = {
    static: { label: "Static Limit", bg: DANGER_LIGHT, text: DANGER },
    oldest: { label: "Oldest Open Item", bg: WARNING_LIGHT, text: WARNING },
  };
  const m = statusMap[status] || { label: status || "Unknown", bg: GRAY_LIGHT, text: GRAY_MEDIUM };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "3px",
      fontSize: "11px",
      fontWeight: 700,
      background: m.bg,
      color: m.text,
      textTransform: "uppercase",
      letterSpacing: "0.3px",
      whiteSpace: "nowrap",
    }}>
      {m.label}
    </span>
  );
}
