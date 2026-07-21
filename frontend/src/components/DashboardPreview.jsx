import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Clock3,
  Menu,
  Search,
  Settings,
  UsersRound,
} from "lucide-react";

function MetricCard({ label, value, suffix, icon: Icon }) {
  return (
    <article className="npj-preview-metric">
      <span className="npj-preview-metric-icon">
        <Icon size={18} />
      </span>

      <span>
        <small>{label}</small>
        <strong>
          {Number(value || 0).toLocaleString()}
          {suffix || ""}
        </strong>
        <em>Live database value</em>
      </span>
    </article>
  );
}

function DashboardPreview({ metrics, loading }) {
  const totals = metrics?.totals || {};
  const stages = metrics?.stages || {};
  const topJobs = metrics?.topJobs || [];

  const pipeline = [
    {
      label: "Applied",
      value: stages.applied || 0,
    },
    {
      label: "Screening",
      value: stages.screening || 0,
    },
    {
      label: "Interview",
      value: stages.interview || 0,
    },
    {
      label: "Offered",
      value: stages.offered || 0,
    },
    {
      label: "Hired",
      value: stages.hired || 0,
    },
  ];

  const maximum = Math.max(...pipeline.map((item) => item.value), 1);

  return (
    <section className="npj-dashboard-preview">
      <aside className="npj-preview-sidebar">
        <div className="npj-preview-logo">
          <span>⚡</span>
          <strong>NoPromptJobs</strong>
        </div>

        <nav>
          <button className="active" type="button">
            <ChartNoAxesCombined size={14} />
            Dashboard
          </button>

          <button type="button">
            <BriefcaseBusiness size={14} />
            Jobs
          </button>

          <button type="button">
            <UsersRound size={14} />
            Candidates
          </button>

          <button type="button">
            <Clock3 size={14} />
            Interviews
          </button>

          <button type="button">
            <Settings size={14} />
            Settings
          </button>
        </nav>
      </aside>

      <div className="npj-preview-main">
        <div className="npj-preview-topbar">
          <div className="npj-preview-search">
            <Search size={14} />
            Search candidates, jobs and skills
          </div>

          <Menu size={18} />
          <span className="npj-preview-avatar">V</span>
        </div>

        <div className="npj-preview-content">
          <div className="npj-preview-title-row">
            <div>
              <h3>Recruiter dashboard</h3>
              <p>Live hiring performance from MongoDB</p>
            </div>

            {loading && <span className="npj-live-badge">Loading</span>}
            {!loading && <span className="npj-live-badge">Live</span>}
          </div>

          <div className="npj-preview-metric-grid">
            <MetricCard
              label="Total candidates"
              value={totals.candidates}
              icon={UsersRound}
            />

            <MetricCard
              label="Active jobs"
              value={totals.activeJobs}
              icon={BriefcaseBusiness}
            />

            <MetricCard
              label="Applications"
              value={totals.applications}
              icon={ChartNoAxesCombined}
            />

            <MetricCard
              label="Hires"
              value={totals.hires}
              icon={UsersRound}
            />
          </div>

          <div className="npj-preview-lower-grid">
            <section className="npj-pipeline-card">
              <div className="npj-card-heading">
                <div>
                  <h4>Candidate pipeline</h4>
                  <p>Application movement across hiring stages</p>
                </div>
              </div>

              <div className="npj-pipeline-bars">
                {pipeline.map((item) => {
                  const relativeHeight = Math.max(
                    16,
                    (item.value / maximum) * 100
                  );

                  return (
                    <div className="npj-pipeline-stage" key={item.label}>
                      <div className="npj-pipeline-bar-area">
                        <span
                          style={{
                            height: `${relativeHeight}%`,
                          }}
                        />
                      </div>

                      <strong>
                        {Number(item.value).toLocaleString()}
                      </strong>
                      <small>{item.label}</small>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="npj-top-jobs-card">
              <div className="npj-card-heading">
                <div>
                  <h4>Top performing jobs</h4>
                  <p>Ranked using real application totals</p>
                </div>
              </div>

              <div className="npj-top-job-list">
                {topJobs.length === 0 && (
                  <div className="npj-empty-preview">
                    Post jobs and receive applications to populate this list.
                  </div>
                )}

                {topJobs.map((job) => (
                  <article key={job.jobId}>
                    <span>
                      <strong>{job.title}</strong>
                      <small>{job.location}</small>
                    </span>

                    <strong>
                      {Number(job.applications).toLocaleString()}
                    </strong>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;