import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  Check,
  ChevronDown,
  Headphones,
  LockKeyhole,
  Menu,
  Rocket,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WandSparkles,
  X,
} from "lucide-react";

import DashboardPreview from "../components/DashboardPreview";
import DemoModal from "../components/DemoModal";
import TrialModal from "../components/TrialModal";
import { getRecruiterLandingMetrics } from "../services/recruiterPublicApi";
import "./RecruiterLandingPage.css";

const features = [
  {
    title: "AI-powered screening",
    description:
      "Prioritize candidates using job requirements, skills, experience and screening outcomes.",
    icon: WandSparkles,
    tone: "purple",
  },
  {
    title: "Collaborative hiring",
    description:
      "Coordinate recruiters, interviewers and hiring managers from one shared workspace.",
    icon: UsersRound,
    tone: "green",
  },
  {
    title: "Smart job posting",
    description:
      "Create consistent job descriptions and manage active openings efficiently.",
    icon: CalendarCheck2,
    tone: "blue",
  },
  {
    title: "Analytics and insights",
    description:
      "Measure application flow, source performance and stage conversion using live data.",
    icon: BarChart3,
    tone: "orange",
  },
  {
    title: "Reusable talent pool",
    description:
      "Keep qualified candidates organized for upcoming roles and future opportunities.",
    icon: Sparkles,
    tone: "violet",
  },
];

const benefits = [
  {
    title: "Enterprise-ready security",
    description: "Role-based access and secure data handling.",
    icon: ShieldCheck,
  },
  {
    title: "Privacy-focused",
    description: "Built for responsible candidate-data management.",
    icon: LockKeyhole,
  },
  {
    title: "Recruiter support",
    description: "Product assistance for your hiring team.",
    icon: Headphones,
  },
  {
    title: "Scalable hiring",
    description: "Suitable for startups, agencies and growing teams.",
    icon: Rocket,
  },
];

function RecruiterLandingPage() {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMetrics() {
      try {
        const result = await getRecruiterLandingMetrics();

        if (active) {
          setMetrics(result);
        }
      } catch (error) {
        if (active) {
          setMetricsError(error.message);
        }
      } finally {
        if (active) {
          setMetricsLoading(false);
        }
      }
    }

    loadMetrics();

    return () => {
      active = false;
    };
  }, []);

  const handleTrialSuccess = (trialData) => {
    sessionStorage.setItem(
      "nopromptjobs_trial",
      JSON.stringify(trialData)
    );

    setTrialOpen(false);

    navigate("/recruiter/register", {
      state: {
        trialData,
      },
    });
  };

  return (
    <main className="npj-recruiter-page">
      <header className="npj-header">
        <button
          type="button"
          className="npj-brand"
          onClick={() => navigate("/")}
        >
          <span>⚡</span>
          <strong>NoPromptJobs</strong>
        </button>

        <nav
          className={
            mobileMenuOpen
              ? "npj-navigation npj-navigation-open"
              : "npj-navigation"
          }
        >
          <button type="button">
            Product <ChevronDown size={14} />
          </button>

          <button type="button">
            Solutions <ChevronDown size={14} />
          </button>

          <button type="button" onClick={() => navigate("/pricing")}>
            Pricing
          </button>

          <button type="button">
            Resources <ChevronDown size={14} />
          </button>

          <button type="button">
            Company <ChevronDown size={14} />
          </button>
        </nav>

        <div className="npj-header-actions">
          <button
            type="button"
            className="npj-login-button"
            onClick={() => navigate("/recruiter/login")}
          >
            Log in
          </button>

          <button
            type="button"
            className="npj-secondary-button"
            onClick={() => setDemoOpen(true)}
          >
            Book a Demo
          </button>

          <button
            type="button"
            className="npj-primary-button"
            onClick={() => setTrialOpen(true)}
          >
            Start Free Trial
          </button>

          <button
            type="button"
            className="npj-mobile-menu"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="npj-hero">
        <div className="npj-hero-copy">
          <span className="npj-hero-badge">
            <UsersRound size={17} />
            For recruiters and hiring teams
          </span>

          <h1>
            Hire top talent
            <span>without the hassle</span>
          </h1>

          <p>
            NoPromptJobs helps recruiters attract, evaluate and hire the right
            candidates faster. Manage jobs, applications, interviews and
            hiring analytics from one recruiter workspace.
          </p>

          <div className="npj-hero-actions">
            <button
              type="button"
              className="npj-primary-button npj-large-button"
              onClick={() => setTrialOpen(true)}
            >
              Start Free Trial
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="npj-outline-light-button npj-large-button"
              onClick={() => setDemoOpen(true)}
            >
              Book a Demo
              <CalendarCheck2 size={18} />
            </button>
          </div>

          <div className="npj-trial-points">
            <span>
              <Check size={15} />
              14-day trial
            </span>

            <span>
              <Check size={15} />
              No credit card required
            </span>

            <span>
              <Check size={15} />
              Cancel anytime
            </span>
          </div>

          {metricsError && (
            <p className="npj-metrics-warning">
              Dashboard preview is temporarily unavailable: {metricsError}
            </p>
          )}
        </div>

        <div className="npj-hero-dashboard">
          <DashboardPreview
            metrics={metrics}
            loading={metricsLoading}
          />
        </div>
      </section>

      <section className="npj-trusted-section">
        <span>Built for modern hiring teams</span>

        <div>
          <strong>Technology</strong>
          <strong>Recruitment agencies</strong>
          <strong>Startups</strong>
          <strong>Professional services</strong>
          <strong>Enterprise teams</strong>
        </div>
      </section>

      <section className="npj-features-section">
        <div className="npj-section-heading">
          <span>Recruiter workspace</span>
          <h2>Everything you need to hire better</h2>
          <p>
            Practical recruitment tools for finding, evaluating and hiring
            qualified candidates.
          </p>
        </div>

        <div className="npj-features-grid">
          {features.map(({ title, description, icon: Icon, tone }) => (
            <article className="npj-feature-card" key={title}>
              <span className={`npj-feature-icon npj-tone-${tone}`}>
                <Icon size={23} />
              </span>

              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="npj-benefits-section">
        {benefits.map(({ title, description, icon: Icon }) => (
          <article key={title}>
            <Icon size={30} />

            <span>
              <strong>{title}</strong>
              <p>{description}</p>
            </span>
          </article>
        ))}
      </section>

      <TrialModal
        open={trialOpen}
        onClose={() => setTrialOpen(false)}
        onSuccess={handleTrialSuccess}
      />

      <DemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </main>
  );
}

export default RecruiterLandingPage;