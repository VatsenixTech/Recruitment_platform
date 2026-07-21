import { Navigate, Route, Routes } from "react-router-dom";
import RecruiterLandingPage from "./pages/RecruiterLandingPage.jsx";

function PlaceholderPage({ title }) {
  return (
    <main className="placeholder-page">
      <section className="placeholder-card">
        <h1>{title}</h1>
        <p>This page will be developed in the next step.</p>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RecruiterLandingPage />} />

      <Route
        path="/recruiter"
        element={<RecruiterLandingPage />}
      />

      <Route
        path="/recruiter/login"
        element={<PlaceholderPage title="Recruiter Login" />}
      />

      <Route
        path="/recruiter/register"
        element={<PlaceholderPage title="Recruiter Registration" />}
      />

      <Route
        path="/pricing"
        element={<PlaceholderPage title="Recruiter Pricing" />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;