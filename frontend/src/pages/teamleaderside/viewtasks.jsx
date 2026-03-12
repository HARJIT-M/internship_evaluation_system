import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./viewtasks.css";
import { logout } from "../../services/authservice";

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");

  const navigate = useNavigate();
  const limit = 5;


  const handleLogout = () => {
  logout();
  navigate("/");
};

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  useEffect(() => {

  let filteredTasks = tasks;

  // SEARCH
  if (search) {
  const s = search.toLowerCase();

  filteredTasks = filteredTasks.filter(
    (t) =>
      t.title?.toLowerCase().includes(s) ||
      t.assignedTo?.name?.toLowerCase().includes(s) ||
      t.assignedTo?.email?.toLowerCase().includes(s) ||
      t.projectId?.title?.toLowerCase().includes(s)
  );
}

  // PROJECT FILTER
  if (taskFilter === "project") {
    filteredTasks = filteredTasks.filter((t) => t.isProjectBased);
  }

  if (taskFilter === "general") {
    filteredTasks = filteredTasks.filter((t) => !t.isProjectBased);
  }

  // CALCULATE TOTAL PAGES
  const pages = Math.ceil(filteredTasks.length / limit);
  setTotalPages(pages || 1);

  // PAGINATION
  const start = (page - 1) * limit;
  const end = start + limit;

  setFiltered(filteredTasks.slice(start, end));

}, [search, tasks, taskFilter, page]);
useEffect(() => {
  setPage(1);
}, [search, taskFilter]);
  const fetchTasks = async (pageNum) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/task/teamlead`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Task fetch error", err);
      setTasks([]);
      setFiltered([]);
      setTotalPages(1);
    }
  };

  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const pendingCount = tasks.filter(t => t.status !== "Completed").length;
  const projectCount = tasks.filter(t => t.isProjectBased).length;
const generalCount = tasks.filter(t => !t.isProjectBased).length;

  const getStatusClass = (status) => {
    if (status === "Completed") return "vt-chip--completed";
    if (status === "In Progress") return "vt-chip--inprogress";
    return "vt-chip--pending";
  };

  return (
    <div className="vt-layout">

      {/* SIDEBAR (unchanged) */}
      {/* ✅ VIEW TASKS SIDEBAR */}
<aside className={`vt-sidebar ${showMenu ? "open" : ""}`}>
  <div className="vt-sidebar-header">
    <div className="vt-sidebar-brand">
      <div className="vt-brand-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <span className="vt-brand-text">IES</span>
    </div>

    <button className="vt-sidebar-close" onClick={() => setShowMenu(false)}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <nav className="vt-sidebar-nav">

    <div className="vt-nav-item" onClick={() => navigate("/teamlead")}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
      <span>Dashboard</span>
    </div>

    <div className="vt-nav-item" onClick={() => navigate("/createproject")}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Add Project</span>
    </div>

    <div className="vt-nav-item" onClick={() => navigate("/viewproject")}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
      <span>View Projects</span>
    </div>

    <div className="vt-nav-item" onClick={() => navigate("/evaluateproject")}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Evaluate Project</span>
    </div>

    <div className="vt-nav-item" onClick={() => navigate("/addtask")}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Add Task</span>
    </div>

    {/* ACTIVE PAGE */}
    <div className="vt-nav-item active">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
      <span>View Tasks</span>
    </div>

    <div className="vt-nav-item" onClick={() => navigate("/internranking")}>
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
        <div className="vt-overlay" onClick={() => setShowMenu(false)} />
      )}

      {/* MAIN */}
      <main className="vt-main">

        {/* TOPBAR */}
        <header className="vt-topbar">
          <button className="vt-menu-btn" onClick={() => setShowMenu(true)}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="vt-topbar-text">
            <h1 className="vt-topbar-title">Intern Task Status</h1>
            <p className="vt-topbar-sub">Track daily task progress of interns</p>
          </div>
          <div className="vt-avatar-wrapper">
  <div
    className="vt-topbar-avatar"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    T
  </div>

  {showDropdown && (
    <div className="vt-avatar-dropdown">
      <button
        className="vt-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </header>

        {/* STAT CARDS */}
        <section className="vt-stats">

          <div className="vt-stat-card vt-stat-card--indigo">
            <div className="vt-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="vt-stat-text">
              <div className="vt-stat-label">Total Tasks</div>
              <div className="vt-stat-value">{tasks.length}</div>
            </div>
            <div className="vt-stat-bg-num">{tasks.length}</div>
          </div>

          <div className="vt-stat-card vt-stat-card--green">
            <div className="vt-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="vt-stat-text">
              <div className="vt-stat-label">Completed</div>
              <div className="vt-stat-value">{completedCount}</div>
            </div>
            <div className="vt-stat-bg-num">{completedCount}</div>
          </div>

          <div className="vt-stat-card vt-stat-card--amber">
            <div className="vt-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="vt-stat-text">
              <div className="vt-stat-label">Pending</div>
              <div className="vt-stat-value">{pendingCount}</div>
            </div>
            <div className="vt-stat-bg-num">{pendingCount}</div>
          </div>

        </section>

        {/* TABLE PANEL */}
        <section className="vt-panel">

          <div className="vt-panel-topbar">
  <div>
    <h2 className="vt-panel-title">Assigned Tasks</h2>
    <p className="vt-panel-sub">Status updated by interns</p>

    {/* FILTER BUTTONS */}
    <div className="vt-filter-row">

  <button
    className={`vt-pill ${taskFilter === "all" ? "vt-pill--active" : ""}`}
    onClick={() => setTaskFilter("all")}
  >
    <span className="vt-pill-dot" />
    All
    <span className="vt-pill-count">{tasks.length}</span>
  </button>

  <button
    className={`vt-pill ${
      taskFilter === "project" ? "vt-pill--active vt-pill--project" : ""
    }`}
    onClick={() => setTaskFilter("project")}
  >
    Project Tasks
    <span className="vt-pill-count">{projectCount}</span>
  </button>

  <button
    className={`vt-pill ${
      taskFilter === "general" ? "vt-pill--active vt-pill--general" : ""
    }`}
    onClick={() => setTaskFilter("general")}
  >
    General Tasks
    <span className="vt-pill-count">{generalCount}</span>
  </button>

</div>
  </div>
            <div className="vt-search-wrap">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="vt-search"
                placeholder="Search task or intern or project"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="vt-table-wrap">
            <table className="vt-table">
              <thead>
  <tr>
    <th>Task</th>
    <th>Project</th>
    <th>Intern</th>
    <th>Email</th>
    <th>Status</th>
    <th>Date</th>
  </tr>
</thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((task, index) => (
                    <tr
                      key={task._id}
                      className="vt-table-row"
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <td className="vt-task-title-cell">{task.title}</td>
                      <td>
  {task.isProjectBased ? (
    <div className="vt-project-cell">
      <div className="vt-project-type vt-project-task">
        Project Task
      </div>
      <div className="vt-project-name">
        {task.projectId?.title || "—"}
      </div>
    </div>
  ) : (
    <div className="vt-project-type vt-general-task">
      General Task
    </div>
  )}
</td>
                      <td>
                        <div className="vt-intern-cell">
                          <div className="vt-avatar">
                            {task.assignedTo?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span>{task.assignedTo?.name || "—"}</span>
                        </div>
                      </td>
                      <td className="vt-email-cell">
                        {task.assignedTo?.email || "—"}
                      </td>
                      <td>
                        <span className={`vt-chip ${getStatusClass(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="vt-date-cell">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="vt-empty-row">No tasks found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

        {/* PAGINATION */}
        <section className="vt-pagination-wrap">
          <button
            className="vt-page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div className="vt-page-info">
            Page <span>{page}</span> of <span>{totalPages}</span>
          </div>

          <button
            className="vt-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

      </main>
    </div>
  );
}