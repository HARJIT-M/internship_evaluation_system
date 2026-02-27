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
  ChevronDown,
  Hourglass
} from "lucide-react";

import "./taskstatus.css";

export default function TaskStatus() {

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
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/task/my",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
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

  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const pendingTasks = tasks.filter(t => t.status !== "Completed").length;

  const getStatusIcon = (status) => {
    if (status === "Completed") return <CheckCircle size={14} />;
    if (status === "In Progress") return <Clock size={14} />;
    return <Hourglass size={14} />;
  };

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
      <button
        className="ts-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </div>

        {/* STATS */}
        <div className="ts-stats-row">

          <div className="ts-stat-card ts-stat-card--total">
            <div className="ts-stat-icon-wrap ts-stat-icon--total">
              <ClipboardList size={20} />
            </div>
            <div className="ts-stat-text">
              <div className="ts-stat-label">Total Tasks</div>
              <div className="ts-stat-value">{tasks.length}</div>
            </div>
            <div className="ts-stat-bg-number">{tasks.length}</div>
          </div>

          <div className="ts-stat-card ts-stat-card--completed">
            <div className="ts-stat-icon-wrap ts-stat-icon--completed">
              <CheckCircle size={20} />
            </div>
            <div className="ts-stat-text">
              <div className="ts-stat-label">Completed</div>
              <div className="ts-stat-value">{completedTasks}</div>
            </div>
            <div className="ts-stat-bg-number">{completedTasks}</div>
          </div>

          <div className="ts-stat-card ts-stat-card--pending">
            <div className="ts-stat-icon-wrap ts-stat-icon--pending">
              <Clock size={20} />
            </div>
            <div className="ts-stat-text">
              <div className="ts-stat-label">Pending</div>
              <div className="ts-stat-value">{pendingTasks}</div>
            </div>
            <div className="ts-stat-bg-number">{pendingTasks}</div>
          </div>

        </div>

        {/* TASK LIST */}
        <div className="ts-task-container">
          {tasks.map((task, index) => (
            <div
              key={task._id}
              className={`ts-task-card ts-task-card--${
                task.status === "Completed" ? "completed"
                : task.status === "In Progress" ? "inprogress"
                : "pending"
              }`}
              style={{ animationDelay: `${index * 0.06}s` }}
            >

              {/* LEFT STRIPE */}
              <div className="ts-task-stripe" />

              {/* TASK INFO */}
              <div className="ts-task-info">
                <div className="ts-task-title">{task.title}</div>
                <div className="ts-task-desc">{task.description}</div>
              </div>

              {/* STATUS SELECT */}
              <div className="ts-select-wrapper">
                <span className="ts-select-icon">
                  {getStatusIcon(task.status)}
                </span>
                <select
                  className={`ts-status-select ${
                    task.status === "Completed" ? "ts-status-completed"
                    : task.status === "In Progress" ? "ts-status-ongoing"
                    : "ts-status-pending"
                  }`}
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
          ))}

          {tasks.length === 0 && (
            <div className="ts-empty">
              <ClipboardList size={32} />
              <span>No tasks assigned yet</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}