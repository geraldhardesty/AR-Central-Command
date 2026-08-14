import React from "react";
import { YOKOGAWA_YELLOW, YOKOGAWA_DARK, GRAY_LIGHT, GRAY_MEDIUM, SUCCESS_LIGHT, SUCCESS } from "../data/constants.js";

export default function StatusBadge({ status }) {
  const statusMap = {
    pending_approval: { label: "Ready", bg: YOKOGAWA_YELLOW, text: YOKOGAWA_DARK, weight: 700 },
    review: { label: "Review", bg: GRAY_LIGHT, text: GRAY_MEDIUM },
    pending_action: { label: "Action", bg: GRAY_LIGHT, text: GRAY_MEDIUM },
    approved: { label: "Approved", bg: SUCCESS_LIGHT, text: SUCCESS },
  };
  const m = statusMap[status] || statusMap.review;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "3px",
      fontSize: "11px",
      fontWeight: m.weight || 500,
      background: m.bg,
      color: m.text,
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    }}>
      {m.label}
    </span>
  );
}
