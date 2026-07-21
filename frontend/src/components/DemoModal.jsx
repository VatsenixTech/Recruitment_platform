import { useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { submitDemoRequest } from "../services/recruiterPublicApi";

const initialForm = {
  fullName: "",
  workEmail: "",
  companyName: "",
  companySize: "",
  phoneNumber: "",
};

function DemoModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
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

      const result = await submitDemoRequest(form);

      setMessage(result.message);
      setForm(initialForm);
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

        <span className="npj-modal-eyebrow">Personalized walkthrough</span>
        <h2>Book your recruiter demo</h2>
        <p>
          See sourcing, application tracking, interview management and hiring
          analytics in one workspace.
        </p>

        {message ? (
          <div className="npj-success-box">
            <strong>Request received</strong>
            <p>{message}</p>

            <button
              type="button"
              className="npj-primary-button"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
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
                required
              />
            </label>

            <label>
              Company name
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Company size
              <select
                name="companySize"
                value={form.companySize}
                onChange={handleChange}
                required
              >
                <option value="">Select company size</option>
                <option value="1-10">1–10 employees</option>
                <option value="11-50">11–50 employees</option>
                <option value="51-200">51–200 employees</option>
                <option value="201-500">201–500 employees</option>
                <option value="501-1000">501–1,000 employees</option>
                <option value="1000+">1,000+ employees</option>
              </select>
            </label>

            <label>
              Phone number
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
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
                  Sending request...
                </>
              ) : (
                "Request my demo"
              )}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default DemoModal;