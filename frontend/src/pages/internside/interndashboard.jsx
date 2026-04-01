import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authservice";
import {
  LayoutDashboard,
  ClipboardList,
  FileCheck,
  FolderKanban,
  CheckCircle,
  Clock,
  ChevronRight,
  User,
  CalendarDays,
  Zap,
  ArrowRight
} from "lucide-react";
import "./interndashboard.css";

export default function InternDashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const internName = user?.name || "Intern";

  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate("/");
};

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "https://internship-evaluation-system.onrender.com/api/project/fetch",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(res.data || []);
    } catch {
      setProjects([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "https://internship-evaluation-system.onrender.com/api/task/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data || []);
    } catch {
      setTasks([]);
    }
  };

  const completedProjects = projects.filter(p => p.status === "completed").length;
  const ongoingProjects = projects.filter(p => p.status === "ongoing").length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const pendingTasks = tasks.filter(t => t.status !== "Completed").length;

  const getTaskStatusClass = (status) => {
    if (status === "Completed") return "in-chip--completed";
    if (status === "In Progress") return "in-chip--inprogress";
    return "in-chip--pending";
  };

  return (
    <div className="in-dashboard">

      {/* SIDEBAR */}
      <div className="in-sidebar">
        <div className="in-sidebar-header">
          <div className="in-sidebar-brand">
            <div className="in-brand-icon">
              <LayoutDashboard size={18} />
            </div>
            <span className="in-brand-text">Intern Panel</span>
          </div>
        </div>

        <div className="in-sidebar-nav">
          <div className="in-nav-item active" onClick={() => navigate("/intern")}>
            <LayoutDashboard size={18} />
            Dashboard
          </div>
          <div className="in-nav-item" onClick={() => navigate("/taskstatus")}>
            <ClipboardList size={18} />
            Task Status
          </div>
          <div className="in-nav-item" onClick={() => navigate("/viewevaluation")}>
            <FileCheck size={18} />
            View Evaluation
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="in-main">

        {/* TOPBAR — TaskStatus style */}
        <div className="in-topbar">
          <div>
            <div className="in-greeting">Welcome, {internName}</div>
            <div className="in-greeting-sub">Here's your performance overview</div>
          </div>
          <div className="in-avatar-wrapper">
  <div
    className="in-topbar-avatar"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    {internName.charAt(0).toUpperCase()}
  </div>

  {showDropdown && (
    <div className="in-avatar-dropdown">
      <button
        className="in-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </div>

        {/* STAT CARDS */}
        <div className="in-stats-row">

          <div className="in-stat-card in-stat-card--indigo">
            <div className="in-stat-icon-wrap">
              <FolderKanban size={20} />
            </div>
            <div className="in-stat-text">
              <div className="in-stat-label">Total Projects</div>
              <div className="in-stat-value">{projects.length}</div>
            </div>
            <div className="in-stat-bg-number">{projects.length}</div>
          </div>

          <div className="in-stat-card in-stat-card--green">
            <div className="in-stat-icon-wrap">
              <CheckCircle size={20} />
            </div>
            <div className="in-stat-text">
              <div className="in-stat-label">Completed Projects</div>
              <div className="in-stat-value">{completedProjects}</div>
            </div>
            <div className="in-stat-bg-number">{completedProjects}</div>
          </div>

          <div className="in-stat-card in-stat-card--amber">
            <div className="in-stat-icon-wrap">
              <Clock size={20} />
            </div>
            <div className="in-stat-text">
              <div className="in-stat-label">Pending Tasks</div>
              <div className="in-stat-value">{pendingTasks}</div>
            </div>
            <div className="in-stat-bg-number">{pendingTasks}</div>
          </div>

        </div>

        {/* BOTTOM GRID */}
        <div className="in-bottom-grid">

          {/* LEFT: Recent Projects */}
          <div className="in-panel">
            <div className="in-panel-header">
              <div className="in-panel-title">
                <FolderKanban size={15} />
                Recent Projects
              </div>
            </div>

            <div className="in-project-list">
              {projects.slice(0, 3).length === 0 ? (
                <div className="in-empty">No projects found</div>
              ) : (
                projects.slice(0, 4).map((project, index) => (
                  <div
                    key={project._id}
                    className={`in-project-card in-project-card--${project.status}`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="in-project-stripe" />
                    <div className="in-project-body">
                      <div className="in-project-top">
                        <span className="in-project-title">
                          {project.title}
                        </span>
                        <span className={`in-chip ${project.status === "completed" ? "in-chip--completed" : "in-chip--inprogress"}`}>
                          {project.status === "completed"
                            ? <><CheckCircle size={10} />Completed</>
                            : <><Clock size={10} />Ongoing</>
                          }
                        </span>
                      </div>
                      <p className="in-project-desc">
                        {project.description || "No description available"}
                      </p>
                      <div className="in-project-meta">
                        <User size={11} />
                        <span>
                        {project.teamLead?.name ||
                        project.assignedBy?.name ||
                        project.teamLead ||
                        project.assignedBy ||
                        "Not assigned"}
                      </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="in-right-col">

            {/* Recent Tasks */}
            <div className="in-panel">
              <div className="in-panel-header">
                <div className="in-panel-title">
                  <ClipboardList size={15} />
                  Recent Tasks
                </div>
              </div>

              <div className="in-task-list">
                {tasks.slice(0, 5).length === 0 ? (
                  <div className="in-empty">No tasks found</div>
                ) : (
                  tasks.slice(0, 5).map((task, index) => (
                    <div
                      key={task._id}
                      className="in-task-row"
                      style={{ animationDelay: `${index * 0.06}s` }}
                    >
                      <div className={`in-task-dot in-task-dot--${
                        task.status === "Completed" ? "completed"
                        : task.status === "In Progress" ? "inprogress"
                        : "pending"
                      }`} />
                      <div className="in-task-info">
                        <span className="in-task-title">{task.title}</span>
                        <span className="in-task-project">
                          {task.projectName || task.project || "—"}
                        </span>
                      </div>
                      <div className="in-task-right">
                        <span className={`in-chip ${getTaskStatusClass(task.status)}`}>
                          {task.status}
                        </span>
                        {task.dueDate && (
                          <span className="in-task-due">
                            <CalendarDays size={10} />
                            {new Date(task.dueDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric"
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="in-panel">
              <div className="in-panel-header">
                <div className="in-panel-title">
                  <Zap size={15} />
                  Quick Actions
                </div>
              </div>

              <div className="in-action-buttons">
                <button
                  className="in-action-btn in-action-btn--primary"
                  onClick={() => navigate("/taskstatus")}
                >
                  <ClipboardList size={15} />
                  Go to Task Status
                  <ChevronRight size={15} className="in-btn-arrow" />
                </button>

                <button
                  className="in-action-btn in-action-btn--secondary"
                  onClick={() => navigate("/viewevaluation")}
                >
                  <FileCheck size={15} />
                  View Evaluation
                  <ChevronRight size={15} className="in-btn-arrow" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}