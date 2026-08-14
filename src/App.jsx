import React from "react";
import ARDashboard from "./components/ARDashboard.jsx";
import CustomerCreditForm from "./components/CustomerCreditForm.jsx";

// ?apply opens the standalone customer credit application — the link reps
// send to customers. Everything else is the internal AR staff portal.
export default function App() {
  const isApplyView = new URLSearchParams(window.location.search).has("apply");
  return isApplyView ? <CustomerCreditForm /> : <ARDashboard />;
}
