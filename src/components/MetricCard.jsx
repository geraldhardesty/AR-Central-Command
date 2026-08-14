import React from "react";
import {
  YOKOGAWA_BLUE, DANGER_LIGHT, WARNING_LIGHT, SUCCESS_LIGHT,
  DANGER, WARNING, SUCCESS, GRAY_MEDIUM,
} from "../data/constants.js";

export default function MetricCard({ icon: Icon, label, value, sublabel, color = "blue" }) {
  const bgMap = {
    blue: YOKOGAWA_BLUE + "1a",
    danger: DANGER_LIGHT,
    warning: WARNING_LIGHT,
    success: SUCCESS_LIGHT,
  };
  const colorMap = {
    blue: YOKOGAWA_BLUE,
    danger: DANGER,
    warning: WARNING,
    success: SUCCESS,
  };
  return (
    <div style={{
      background: "white",
      border: `1px solid #e0e0e0`,
      borderRadius: "4px",
      padding: "20px",
      display: "flex",
      gap: "16px",
      alignItems: "flex-start",
      transition: "all 0.2s",
    }}>
      <div style={{
        background: bgMap[color],
        borderRadius: "4px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Icon style={{ color: colorMap[color], width: "24px", height: "24px" }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "11px", color: GRAY_MEDIUM, fontWeight: 700, textTransform: "uppercase", margin: 0, marginBottom: "6px", letterSpacing: "0.5px" }}>
          {label}
        </p>
        <p style={{ fontSize: "28px", fontWeight: 700, color: colorMap[color], margin: "4px 0" }}>
          {value}
        </p>
        {sublabel && <p style={{ fontSize: "12px", color: GRAY_MEDIUM, margin: 0 }}>{sublabel}</p>}
      </div>
    </div>
  );
}
