import { isWhitelisted } from "./utils.js";

// Stand-in for a future agent that pulls real payment history from SAP.
// The score is calculated from that history plus the current hold — not
// hand-set per record — so an AR reviewer can see exactly why it landed
// where it did (see riskFactors below).
export function calculateRiskScore(hold) {
  const history = hold.paymentHistory || [];
  const totalOrders = history.length;
  const lateOrders = history.filter((o) => o.daysLate > 0).length;
  const lateRate = totalOrders ? lateOrders / totalOrders : 0;
  const avgDaysLate = totalOrders
    ? history.reduce((sum, o) => sum + Math.max(0, o.daysLate), 0) / totalOrders
    : 0;
  const overLimitPct = hold.availableCredit < 0
    ? Math.min((-hold.availableCredit / hold.creditLimit) * 100, 15)
    : 0;

  let score = 0;
  score += lateRate * 40;
  score += Math.min(avgDaysLate, 30);
  score += hold.holdReason === "oldest" ? 20 : 5;
  score += overLimitPct;
  if (isWhitelisted(hold.customerId)) score -= 15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function recommendationFor(riskScore) {
  if (riskScore < 30) return "release";
  if (riskScore < 60) return "more_info";
  return "hold";
}

export const RECOMMENDATION_LABELS = {
  release: "Release",
  more_info: "Find More Info",
  hold: "Keep on Hold",
};

// Plain-language breakdown of what drove the score, for the AR reviewer.
export function riskFactors(hold) {
  const history = hold.paymentHistory || [];
  const totalOrders = history.length;
  const lateOrders = history.filter((o) => o.daysLate > 0).length;
  const factors = [];

  factors.push(
    totalOrders
      ? `${lateOrders} of ${totalOrders} past order${totalOrders !== 1 ? "s" : ""} paid late`
      : "No payment history on file"
  );
  factors.push(
    hold.holdReason === "oldest"
      ? "Active hold: oldest open item (past-due invoice)"
      : "Active hold: static credit limit exceeded"
  );
  if (hold.availableCredit < 0) {
    factors.push(`Order exceeds credit limit by $${Math.abs(hold.availableCredit).toLocaleString()}`);
  }
  if (isWhitelisted(hold.customerId)) {
    factors.push("Whitelisted account — trusted-history discount applied");
  }
  return factors;
}

export function assessHold(hold) {
  const riskScore = calculateRiskScore(hold);
  return {
    riskScore,
    recommendation: recommendationFor(riskScore),
    factors: riskFactors(hold),
  };
}
