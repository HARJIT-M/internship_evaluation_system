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
  User,
  MessageSquare,
  FolderKanban,
  Eye,
  X,
  CalendarCheck,
  AlertCircle
} from "lucide-react";

import "./viewevaluation.css";

export default function ViewEvaluation() {

  const [evaluations, setEvaluations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
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
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/evaluation/intern",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEvaluations(res.data.data || []);
      //console.log(res.data);
    }
    catch (err) {
      console.error(err);
    }
  };

  const completedCount = evaluations.filter(e => e.status === "completed").length;
  const ongoingCount = evaluations.filter(e => e.status === "ongoing").length;

  const filteredEvaluations =
    filter === "all"
      ? evaluations
      : evaluations.filter(e => e.status === filter);

  return (
    <div className="ve-dashboard">

      {/* SIDEBAR */}
      <div className="ve-sidebar">
        <div className="ve-sidebar-brand">
          <div className="ve-brand-icon">
            <LayoutDashboard size={18} />
          </div>
          <span className="ve-brand-text">Intern Panel</span>
        </div>

        <div className="ve-sidebar-nav">
          <div className="ve-nav-item" onClick={() => navigate("/intern")}>
            <LayoutDashboard size={18} />
            Dashboard
          </div>
          <div className="ve-nav-item" onClick={() => navigate("/taskstatus")}>
            <ClipboardList size={18} />
            Task Status
          </div>
          <div className="ve-nav-item active">
            <FileCheck size={18} />
            View Evaluation
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="ve-main">

        {/* TOPBAR */}
        <div className="ve-topbar">
          <div>
            <div className="ve-greeting">Evaluation Status</div>
            <div className="ve-greeting-sub">View your project evaluation results</div>
          </div>
          <div className="ve-avatar-wrapper">
  <div
    className="ve-topbar-avatar"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    {internName.charAt(0).toUpperCase()}
  </div>

  {showDropdown && (
    <div className="ve-avatar-dropdown">
      <button
        className="ve-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </div>

        {/* FILTER PILLS */}
        <div className="ve-filter-row">
          <button
            className={`ve-pill ${filter === "all" ? "ve-pill--active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <span className="ve-pill-dot ve-pill-dot--all" />
            All
            <span className="ve-pill-count">{evaluations.length}</span>
          </button>

          <button
            className={`ve-pill ${filter === "completed" ? "ve-pill--active ve-pill--completed" : ""}`}
            onClick={() => setFilter("completed")}
          >
            <CheckCircle size={13} />
            Completed
            <span className="ve-pill-count">{completedCount}</span>
          </button>

          <button
            className={`ve-pill ${filter === "ongoing" ? "ve-pill--active ve-pill--ongoing" : ""}`}
            onClick={() => setFilter("ongoing")}
          >
            <Clock size={13} />
            Ongoing
            <span className="ve-pill-count">{ongoingCount}</span>
          </button>
        </div>

        {/* GRID CARDS */}
        <div className="ve-card-grid">
          {filteredEvaluations.length === 0 ? (
            <div className="ve-empty">
              <AlertCircle size={32} />
              <span>No evaluations found</span>
            </div>
          ) : (
            filteredEvaluations.map((item, index) => (
              <div
                key={item.evaluationId}
                className={`ve-grid-card ve-grid-card--${item.status}`}
                style={{ animationDelay: `${index * 0.07}s` }}
              >

                {/* TOP GRADIENT STRIPE */}
                <div className="ve-card-stripe" />

                {/* CARD CONTENT */}
                <div className="ve-card-content">

                  <div className="ve-card-icon-row">
                    <div className="ve-card-folder-icon">
                      <FolderKanban size={18} />
                    </div>
                    <div className={`ve-status-chip ve-status-chip--${item.status}`}>
                      {item.status === "completed"
                        ? <><CheckCircle size={11} />Completed</>
                        : <><Clock size={11} />Ongoing</>
                      }
                    </div>
                  </div>

                  <h3 className="ve-card-title">{item.projectName}</h3>

                  <div className="ve-card-evaluator">
                    <User size={12} />
                    <span>{item.evaluatedBy || "Not assigned"}</span>
                  </div>

                  {item.status === "ongoing" && (
                    <div className="ve-card-progress-bar">
                      <div className="ve-card-progress-fill" />
                    </div>
                  )}

                </div>

                <button
                  className="ve-view-btn"
                  onClick={() => setSelectedEvaluation(item)}
                >
                  <Eye size={14} />
                  View Details
                </button>

              </div>
            ))
          )}
        </div>

      </div>

      {/* POPUP MODAL */}
      {selectedEvaluation && (
        <div
          className="ve-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelectedEvaluation(null)}
        >
          <div className="ve-modal">

            {/* MODAL HEADER */}
            <div className={`ve-modal-header ve-modal-header--${selectedEvaluation.status}`}>
              <div className="ve-modal-header-left">
                <div className="ve-modal-header-icon">
                  <FolderKanban size={20} />
                </div>
                <div>
                  <p className="ve-modal-label">Project Evaluation</p>
                  <h3 className="ve-modal-title">{selectedEvaluation.projectName}</h3>
                </div>
              </div>
              <button className="ve-close-btn" onClick={() => setSelectedEvaluation(null)}>
                <X size={16} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="ve-modal-body">

              {/* STATUS ROW */}
              <div className="ve-modal-status-row">
                <div className={`ve-modal-status-badge ve-status-chip--${selectedEvaluation.status}`}>
                  {selectedEvaluation.status === "completed"
                    ? <><CheckCircle size={13} /> Completed</>
                    : <><Clock size={13} /> Ongoing</>
                  }
                </div>
              </div>

              {/* INFO FIELDS */}
              <div className="ve-modal-fields">

                <div className="ve-modal-field">
                  <div className="ve-modal-field-label">
                    <User size={13} />
                    Evaluated By
                  </div>
                  <div className="ve-modal-field-value">
                    {selectedEvaluation.evaluatedBy || "Not available"}
                  </div>
                </div>

                <div className="ve-modal-field">
                  <div className="ve-modal-field-label">
                    <MessageSquare size={13} />
                    Description
                  </div>
                  <div className="ve-modal-field-value ve-modal-field-value--block">
                    {selectedEvaluation.description || "No description available"}
                  </div>
                </div>

                {selectedEvaluation.status === "completed" && (
                  <div className="ve-modal-field">
                    <div className="ve-modal-field-label">
                      <CalendarCheck size={13} />
                      Feedback
                    </div>
                    <div className="ve-modal-field-value ve-modal-field-value--block ve-modal-field-value--feedback">
                      {selectedEvaluation.feedback}
                    </div>
                  </div>
                )}

                {selectedEvaluation.status === "ongoing" && (
                  <div className="ve-modal-pending-notice">
                    <Clock size={15} />
                    Evaluation is still in progress. Results will appear here once completed.
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}