/*taskstatus.jsx*/
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authservice";
import {
  LayoutDashboard,
  ClipboardList,
  FileCheck,
  CheckCircle,
  Clock,
  Hourglass,
  AlertCircle,
  ChevronDown
} from "lucide-react";

import "./taskstatus.css";

export default function TaskStatus() {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
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
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/task/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/task/update-status/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const inProgressCount = tasks.filter(t => t.status === "In Progress").length;
  const pendingCount = tasks.filter(t => t.status === "Pending").length;

  const filteredTasks =
    filter === "all" ? tasks
    : filter === "completed" ? tasks.filter(t => t.status === "Completed")
    : filter === "inprogress" ? tasks.filter(t => t.status === "In Progress")
    : tasks.filter(t => t.status === "Pending");

  return (
    <div className="ts-dashboard">

      {/* SIDEBAR */}
      <div className="ts-sidebar">
        <div className="ts-sidebar-header">
          <div className="ts-sidebar-brand">
            <div className="ts-brand-icon">
              <LayoutDashboard size={18} />
            </div>
            <span className="ts-brand-text">Intern Panel</span>
          </div>
        </div>

        <div className="ts-sidebar-nav">
          <div className="ts-nav-item" onClick={() => navigate("/intern")}>
            <LayoutDashboard size={18} />
            Dashboard
          </div>
          <div className="ts-nav-item active">
            <ClipboardList size={18} />
            Task Status
          </div>
          <div className="ts-nav-item" onClick={() => navigate("/viewevaluation")}>
            <FileCheck size={18} />
            View Evaluation
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="ts-main">

        {/* TOPBAR */}
        <div className="ts-topbar">
          <div>
            <div className="ts-greeting">Task Status</div>
            <div className="ts-greeting-sub">Manage and update your assigned tasks</div>
          </div>
          <div className="ts-avatar-wrapper">
            <div
              className="ts-topbar-avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {internName.charAt(0).toUpperCase()}
            </div>
            {showDropdown && (
              <div className="ts-avatar-dropdown">
                <button className="ts-dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="ts-filter-row">
          <button
            className={`ts-pill ${filter === "all" ? "ts-pill--active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <span className="ts-pill-dot ts-pill-dot--all" />
            All
            <span className="ts-pill-count">{tasks.length}</span>
          </button>

          <button
            className={`ts-pill ${filter === "completed" ? "ts-pill--active ts-pill--completed" : ""}`}
            onClick={() => setFilter("completed")}
          >
            <CheckCircle size={13} />
            Completed
            <span className="ts-pill-count">{completedCount}</span>
          </button>

          <button
            className={`ts-pill ${filter === "inprogress" ? "ts-pill--active ts-pill--inprogress" : ""}`}
            onClick={() => setFilter("inprogress")}
          >
            <Clock size={13} />
            In Progress
            <span className="ts-pill-count">{inProgressCount}</span>
          </button>

          <button
            className={`ts-pill ${filter === "pending" ? "ts-pill--active ts-pill--pending" : ""}`}
            onClick={() => setFilter("pending")}
          >
            <Hourglass size={13} />
            Pending
            <span className="ts-pill-count">{pendingCount}</span>
          </button>
        </div>

        {/* CARD GRID */}
        <div className="ts-card-grid">
          {filteredTasks.length === 0 ? (
            <div className="ts-empty">
              <AlertCircle size={32} />
              <span>No tasks found</span>
            </div>
          ) : (
            filteredTasks.map((task, index) => {
              const statusKey =
                task.status === "Completed" ? "completed"
                : task.status === "In Progress" ? "inprogress"
                : "pending";

              return (
                <div
                  key={task._id}
                  className={`ts-grid-card ts-grid-card--${statusKey}`}
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  {/* TOP STRIPE */}
                  <div className="ts-card-stripe" />

                  {/* CARD CONTENT */}
                  <div className="ts-card-content">

                    <div className="ts-card-icon-row">
                      <div className="ts-card-task-icon">
                        <ClipboardList size={18} />
                      </div>
                      <div className={`ts-status-chip ts-status-chip--${statusKey}`}>
                        {task.status === "Completed"
                          ? <><CheckCircle size={11} />Completed</>
                          : task.status === "In Progress"
                          ? <><Clock size={11} />In Progress</>
                          : <><Hourglass size={11} />Pending</>
                        }
                      </div>
                    </div>

                    <h3 className="ts-card-title">{task.title}</h3>
                    <div className="ts-task-meta">
  {task.isProjectBased ? (
    <span className={`ts-project-badge ${task.status === "Completed" ? "ts-project-badge--completed" : ""}`}>
      <span className="ts-badge-icon">{task.status === "Completed" ? "✅" : "⚠️"}</span> Project Task
    </span>
  ) : (
    <span className="ts-general-badge">
      <span className="ts-badge-icon">📝</span> General Task
    </span>
  )}

  {/* {task.isProjectBased && task.projectId && (
    <span className={`ts-project-name ${task.status === "Completed" ? "ts-project-name--completed" : ""}`}>
      📁 {task.projectId.title}
    </span>
  )} */}

  {task.isProjectBased && task.projectId && (
  <span className="ts-project-name">
    📁 {task.projectId.title}
  </span>
)}

</div>

                    <div className="ts-card-desc">{task.description}</div>

                    {task.status === "In Progress" && (
                      <div className="ts-card-progress-bar">
                        <div className="ts-card-progress-fill" />
                      </div>
                    )}

                  </div>

                  {/* STATUS SELECT */}
                  <div className="ts-card-footer">
                    <div className="ts-select-wrapper">
                      <select
                        className={`ts-status-select ts-status-select--${statusKey}`}
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <ChevronDown size={13} className="ts-select-chevron" />
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}