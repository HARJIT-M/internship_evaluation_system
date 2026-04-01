import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./teamleaddashboard.css";
import { logout } from "../../services/authservice";

export default function TeamLeadDashboard() {
  const [projects, setProjects] = useState([]);
  const [topInterns, setTopInterns] = useState([]);
  const [teamLeadName, setTeamLeadName] = useState("Team Lead");
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate("/");
};

  useEffect(() => {

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const dashboardRes = await axios.get(
          "https://internship-evaluation-system.onrender.com/api/teamlead/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProjects(dashboardRes.data.projects || []);
        setTeamLeadName(dashboardRes.data.teamLead || "Team Lead");

        const topRes = await axios.get(
  "https://internship-evaluation-system.onrender.com/api/evaluation/top",
  { headers: { Authorization: `Bearer ${token}` } }
);

// ✅ FILTER OUT deleted projects
const validTopInterns = (topRes.data || []).filter(
  (item) => item.project !== null
);

setTopInterns(validTopInterns);

      } catch (err) {
        console.error("Dashboard error", err);
      }
    };

    fetchDashboard();
  }, []);

  const totalProjects = projects.length;
  const allInterns = projects.flatMap((p) => p.interns || []);
  const totalInterns = new Set(allInterns.map((i) => i._id)).size;

  const completedEvaluations = projects
    .map((project) => {
      const evaluatedCount =
        project.interns?.filter((i) => i.evaluated).length || 0;
      return evaluatedCount > 0
        ? { title: project.title, count: evaluatedCount }
        : null;
    })
    .filter(Boolean);

  return (
    <div className="tl-dashboard">
      <aside className={`tl-sidebar ${showMenu ? "open" : ""}`}>
        <div className="tl-sidebar-header">
          <div className="tl-sidebar-brand">
            <div className="tl-brand-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="tl-brand-text">IES</span>
          </div>
          <button className="tl-sidebar-close" onClick={() => setShowMenu(false)}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="tl-sidebar-nav">
          <div className="tl-nav-item active">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span>Dashboard</span>
          </div>
          <div className="tl-nav-item" onClick={() => { navigate("/createproject"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Project</span>
          </div>
          <div className="tl-nav-item" onClick={() => { navigate("/viewproject"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
            <span>View Projects</span>
          </div>
          <div className="tl-nav-item" onClick={() => { navigate("/evaluateproject"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
            <span>Evaluate Project</span>
          </div>
          <div className="tl-nav-item" onClick={() => { navigate("/addtask"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Task</span>
          </div>
          <div className="tl-nav-item" onClick={() => { navigate("/viewtasks"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
            <span>View Tasks</span>
          </div>
          <div className="tl-nav-item" onClick={() => { navigate("/internranking"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M4 20V10m6 10V4m6 16v-7"
  />
</svg>
            <span>Intern Ranking</span>
          </div>
        </nav>
      </aside>

      {showMenu && <div className="tl-overlay" onClick={() => setShowMenu(false)} />}

      <main className="tl-main">
        <header className="tl-topbar">
          <div className="tl-topbar-left">
            <button className="tl-hamburger" onClick={() => setShowMenu(!showMenu)}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div>
              <h1 className="tl-greeting">Welcome back, {teamLeadName}</h1>
              <p className="tl-greeting-sub">Here's an overview of your internship program</p>
            </div>
          </div>
          <div className="tl-avatar-wrapper">
  <div
    className="tl-topbar-avatar"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    {teamLeadName.charAt(0).toUpperCase()}
  </div>

  {showDropdown && (
    <div className="tl-avatar-dropdown">
      <button
        className="tl-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </header>

        <div className="tl-stats-row">
          <div className="tl-stat-card" data-value={totalProjects}>
            <div className="tl-stat-icon tl-stat-icon--projects">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <div className="tl-stat-info">
              <span className="tl-stat-label">Total Projects</span>
              <span className="tl-stat-value">{totalProjects}</span>
            </div>
          </div>

          <div className="tl-stat-card" data-value={totalInterns}>
            <div className="tl-stat-icon tl-stat-icon--interns">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="tl-stat-info">
              <span className="tl-stat-label">Total Interns</span>
              <span className="tl-stat-value">{totalInterns}</span>
            </div>
          </div>

          <div className="tl-stat-card" data-value={completedEvaluations.reduce((sum, e) => sum + e.count, 0)}>
            <div className="tl-stat-icon tl-stat-icon--evaluations">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div className="tl-stat-info">
              <span className="tl-stat-label">Evaluations Done</span>
              <span className="tl-stat-value">{completedEvaluations.reduce((sum, e) => sum + e.count, 0)}</span>
            </div>
          </div>
        </div>

        <section className="tl-section">
          <div className="tl-section-header">
            <h2 className="tl-section-title">Top 5 Interns</h2>
            <span className="tl-section-badge">{topInterns.length} ranked</span>
          </div>

          {topInterns.length === 0 ? (
            <div className="tl-empty-state">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-7.54 0" />
              </svg>
              <p>No evaluations yet.</p>
            </div>
          ) : (
            <div className="tl-top-interns">
              {topInterns.map((item, index) => (
                <div key={item._id} className="tl-intern-row">
                  <div className="tl-intern-left">
                    <div className={`tl-rank tl-rank--${index + 1}`}>
                      {index < 3 ? (
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-7.54 0" />
                        </svg>
                      ) : (
                        <span>#{index + 1}</span>
                      )}
                    </div>
                    <div className="tl-intern-info">
                      <span className="tl-intern-name">{item.intern?.name || "Unknown Intern"}</span>
                      <span className="tl-intern-email">{item.intern?.email || ""}</span>

                    </div>
                  </div>
                  <div className="tl-intern-project">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                    <span>{item.project?.title || "Deleted Project"}</span>
                  </div>
                  <div className="tl-intern-right">
                    {/* <span className="tl-score">{item.totalScore}</span> */}
                    <span className={`tl-grade tl-grade--${item.grade}`}>{item.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="tl-section">
          <div className="tl-section-header">
            <h2 className="tl-section-title">Completed Evaluations</h2>
            <span className="tl-section-badge">{completedEvaluations.length} projects</span>
          </div>

          {completedEvaluations.length === 0 ? (
            <div className="tl-empty-state">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p>No evaluations completed yet.</p>
            </div>
          ) : (
            <div className="tl-eval-grid">
              {completedEvaluations.map((p, idx) => (
                <div key={idx} className="tl-eval-card">
                  <div className="tl-eval-card-top">
                    <div className="tl-eval-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="tl-eval-title">{p.title}</span>
                  </div>
                  <div className="tl-eval-card-bottom">
                    <span className="tl-eval-count">{p.count}</span>
                    <span className="tl-eval-label">intern{p.count !== 1 ? "s" : ""} evaluated</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

