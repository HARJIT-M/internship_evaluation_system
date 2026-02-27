import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./viewproject.css";
import "./teamleaddashboard.css";
import { logout } from "../../services/authservice";

export default function ViewProjects() {

  const [projects, setProjects] = useState([]);
  const [teamLeadName, setTeamLeadName] = useState("Team Lead");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);


  const navigate = useNavigate();
  const handleLogout = () => {
  logout();
  navigate("/");
};

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/teamlead/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(res.data.projects || []);
        setTeamLeadName(res.data.teamLead || "Team Lead");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const completedCount = projects.filter(p => p.status === "completed").length;
  const ongoingCount = projects.filter(p => p.status === "ongoing").length;

  return (
    <div className="tl-dashboard">

      {/* SIDEBAR (unchanged) */}
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

    <div className="tl-nav-item" onClick={() => { navigate("/teamlead"); setShowMenu(false); }}>
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

    <div className="tl-nav-item active">
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

      {showMenu && (
        <div className="vp-overlay" onClick={() => setShowMenu(false)} />
      )}

      {/* MAIN */}
      <main className="vp-main">

        {/* TOPBAR */}
        <header className="vp-topbar">
          <button className="vp-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="vp-topbar-text">
            <h1 className="vp-topbar-title">View Projects</h1>
            <p className="vp-topbar-sub">All projects assigned to your team</p>
          </div>
          <div className="vp-avatar-wrapper">
  <div
    className="vp-topbar-avatar"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    {teamLeadName.charAt(0).toUpperCase()}
  </div>

  {showDropdown && (
    <div className="vp-avatar-dropdown">
      <button
        className="vp-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </header>

        {/* STAT CARDS */}
        <section className="vp-stats">

          <div className="vp-stat-card vp-stat-card--indigo">
            <div className="vp-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="vp-stat-text">
              <div className="vp-stat-label">Total Projects</div>
              <div className="vp-stat-value">{projects.length}</div>
            </div>
            <div className="vp-stat-bg-num">{projects.length}</div>
          </div>

          <div className="vp-stat-card vp-stat-card--green">
            <div className="vp-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="vp-stat-text">
              <div className="vp-stat-label">Completed</div>
              <div className="vp-stat-value">{completedCount}</div>
            </div>
            <div className="vp-stat-bg-num">{completedCount}</div>
          </div>

          <div className="vp-stat-card vp-stat-card--amber">
            <div className="vp-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="vp-stat-text">
              <div className="vp-stat-label">Ongoing</div>
              <div className="vp-stat-value">{ongoingCount}</div>
            </div>
            <div className="vp-stat-bg-num">{ongoingCount}</div>
          </div>

        </section>

        {/* PROJECT GRID */}
        {projects.length === 0 ? (
          <div className="vp-empty">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>No projects found</span>
          </div>
        ) : (
          <div className="vp-grid">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className={`vp-card vp-card--${project.status || "ongoing"}`}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                {/* TOP STRIPE */}
                <div className="vp-card-stripe" />

                <div className="vp-card-body">

                  {/* TITLE ROW */}
                  <div className="vp-card-top">
                    <div className="vp-card-icon">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    {project.status && (
                      <span className={`vp-chip ${project.status === "completed" ? "vp-chip--completed" : "vp-chip--ongoing"}`}>
                        {project.status === "completed" ? "Completed" : "Ongoing"}
                      </span>
                    )}
                  </div>

                  <h3 className="vp-title">{project.title}</h3>

                  <div className="vp-card-divider" />

                  {/* INTERNS */}
                  <div className="vp-section">
                    <div className="vp-section-label">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Interns
                    </div>
                    <div className="vp-intern-list">
                      {project.interns?.length > 0 ? (
                        project.interns.map((intern) => (
                          <span key={intern._id} className="vp-intern-tag">
                            <span className="vp-intern-avatar">
                              {intern.name.charAt(0).toUpperCase()}
                            </span>
                            {intern.name}
                          </span>
                        ))
                      ) : (
                        <span className="vp-no-data">No interns assigned</span>
                      )}
                    </div>
                  </div>

                  {/* EVALUATED BY */}
                  <div className="vp-section">
                    <div className="vp-section-label">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Evaluated By
                    </div>
                    <div className="vp-evaluator">
                      {project.teamLead?.name || "Not available"}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}