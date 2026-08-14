import React from "react";
import { DANGER, DANGER_LIGHT, WARNING, WARNING_LIGHT, SUCCESS, SUCCESS_LIGHT, GRAY_LIGHT, GRAY_MEDIUM } from "../data/constants.js";
import { RECOMMENDATION_LABELS } from "../data/riskScoring.js";

export function RiskScorePill({ score }) {
  const { bg, text } = score >= 60
    ? { bg: DANGER_LIGHT, text: DANGER }
    : score >= 30
    ? { bg: WARNING_LIGHT, text: WARNING }
    : { bg: SUCCESS_LIGHT, text: SUCCESS };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: "30px", padding: "4px 8px", borderRadius: "3px",
      fontSize: "12px", fontWeight: 700, background: bg, color: text,
    }}>
      {score}
    </span>
  );
}

const RECOMMENDATION_STYLES = {
  release: { bg: SUCCESS_LIGHT, text: SUCCESS },
  more_info: { bg: WARNING_LIGHT, text: WARNING },
  hold: { bg: DANGER_LIGHT, text: DANGER },
};

export function RecommendationBadge({ recommendation }) {
  const s = RECOMMENDATION_STYLES[recommendation] || { bg: GRAY_LIGHT, text: GRAY_MEDIUM };
  return (
    <span style={{
      display: "inline-block", padding: "4px 10px", borderRadius: "3px",
      fontSize: "11px", fontWeight: 700, background: s.bg, color: s.text,
      textTransform: "uppercase", letterSpacing: "0.3px", whiteSpace: "nowrap",
    }}>
      {RECOMMENDATION_LABELS[recommendation] || recommendation}
    </span>
  );
}
