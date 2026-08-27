import React from "react";
import ARDashboard from "./components/ARDashboard.jsx";
import CustomerCreditForm from "./components/CustomerCreditForm.jsx";
import DocsPage from "./components/DocsPage.jsx";
import PartnerCreditWidget from "./components/PartnerCreditWidget.jsx";

// ?apply opens the standalone customer credit application — the link reps
// send to customers. ?docs opens the internal reference page. ?widget opens
// the sales-partner credit check widget. Everything else is the internal
// AR staff portal.
export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("apply")) return <CustomerCreditForm />;
  if (params.has("docs")) return <DocsPage />;
  if (params.has("widget")) return <PartnerCreditWidget />;
  return <ARDashboard />;
}
