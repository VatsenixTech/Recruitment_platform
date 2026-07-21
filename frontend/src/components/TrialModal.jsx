import { useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { startRecruiterTrial } from "../services/recruiterPublicApi";

const initialForm = {
  fullName: "",
  workEmail: "",
  companyName: "",
};

function TrialModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const result = await startRecruiterTrial(form);

      setForm(initialForm);
      onSuccess(result.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="npj-modal-backdrop">
      <section className="npj-modal">
        <button
          type="button"
          className="npj-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <span className="npj-modal-eyebrow">14-day recruiter trial</span>
        <h2>Start hiring with NoPromptJobs</h2>
        <p>
          Create your recruiter trial. No payment details are required.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label>
            Work email
            <input
              name="workEmail"
              type="email"
              value={form.workEmail}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
          </label>

          <label>
            Company name
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Your company"
              required
            />
          </label>

          {error && <div className="npj-form-error">{error}</div>}

          <button
            type="submit"
            className="npj-primary-button npj-modal-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoaderCircle className="npj-spinner" size={18} />
                Starting trial...
              </>
            ) : (
              "Continue to registration"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

export default TrialModal;