import React from "react";
import ARDashboard from "./components/ARDashboard.jsx";
import CustomerCreditForm from "./components/CustomerCreditForm.jsx";
import DocsPage from "./components/DocsPage.jsx";

// ?apply opens the standalone customer credit application — the link reps
// send to customers. ?docs opens the internal reference page. Everything
// else is the internal AR staff portal.
export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("apply")) return <CustomerCreditForm />;
  if (params.has("docs")) return <DocsPage />;
  return <ARDashboard />;
}
