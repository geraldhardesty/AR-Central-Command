// -----------------------------------------------------------------------
// Brand / design tokens — Yokogawa corporate palette
// Yellow: Pantone 108C · Blue: Pantone 2145C · Green: Pantone 7482C
// -----------------------------------------------------------------------
export const YOKOGAWA_YELLOW = "#ffee00";
export const YOKOGAWA_BLUE = "#004f9b";
export const YOKOGAWA_GREEN = "#00a04c";
export const YOKOGAWA_DARK = "#231f20";
export const DANGER = "#d32f2f";
export const DANGER_LIGHT = "#ffebee";
export const WARNING = "#f57c00";
export const WARNING_LIGHT = "#fff3e0";
export const SUCCESS = YOKOGAWA_GREEN;
export const SUCCESS_LIGHT = "#e3f7ec";
export const GRAY_LIGHT = "#f8f8f6";
export const GRAY_MEDIUM = "#9e9e9e";

// -----------------------------------------------------------------------
// Business rules — credit onboarding
// -----------------------------------------------------------------------
export const AUTO_APPROVE_MIN_SCORE = 70;
export const AUTO_APPROVE_MAX_LIMIT = 25000;
export const LOW_RISK_MAX_SCORE = 35;

// -----------------------------------------------------------------------
// Whitelisted reps / accounts — always auto-approved for release
// TODO: move to a configurable admin setting instead of a fixed list
// -----------------------------------------------------------------------
export const AUTO_APPROVE_LIST = ["BBP", "TechStar", "GridTech", "Vertex"];
