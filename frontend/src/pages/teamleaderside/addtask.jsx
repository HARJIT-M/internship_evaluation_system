import { useState, useEffect } from "react";
import axios from "axios";
import "./addtask.css";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/intern/totalinterns",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInterns(res.data);
      } catch (err) {
        console.error("Error fetching interns", err);
      }
    };

    fetchInterns();
  }, []);

  const filteredInterns = interns.filter((intern) =>
    `${intern.name} ${intern.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern) {
      alert("Please select an intern");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/task/assign",
        {
          title,
          description,
          internId: selectedIntern,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Task assigned successfully!");
      navigate("/teamlead");
    } catch (err) {
      console.error("Assign task error", err);
      alert("Error assigning task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="at-wrapper">
      {/* LEFT PANEL */}
      <div className="at-left">
        <div className="at-left-circle at-left-circle-top" />
        <div className="at-left-circle at-left-circle-bottom" />
        <div className="at-left-dots" />

        <div className="at-left-content">
          <div className="at-left-brand">
            <div className="at-brand-icon-box">✔</div>
            <span className="at-brand-label">IES</span>
          </div>

          <h1 className="at-left-title">
            Assign
            <br />
            Daily Task
          </h1>

          <p className="at-left-description">
            Assign daily work to interns and track their progress easily.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="at-right">
        <div className="at-form-container">
          <div className="at-card">
            <div className="at-card-header">
              <h2 className="at-card-title">New Task</h2>
              <p className="at-card-subtitle">
                Fill in task details and assign an intern
              </p>
            </div>

            <form onSubmit={handleSubmit} className="at-form">
              {/* Title */}
              <div className="at-form-group">
                <label className="at-form-label">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                  className="at-form-input"
                />
              </div>

              {/* Description */}
              <div className="at-form-group">
                <label className="at-form-label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="at-form-textarea"
                  rows={4}
                />
              </div>

              {/* Assign Intern */}
              <div className="at-form-group">
                <label className="at-form-label">
                  Assign Intern
                </label>

                <div className="at-search-wrapper">
                  <input
                    type="text"
                    placeholder="Search interns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="at-search-input"
                  />
                  <span className="at-search-icon">🔍</span>
                </div>

                <div className="at-intern-list-scroll">
                  {filteredInterns.length === 0 && (
                    <div className="at-intern-empty">
                      No interns found
                    </div>
                  )}

                  {filteredInterns.map((intern) => (
                    <label
                      key={intern._id}
                      className={`at-intern-item ${
                        selectedIntern === intern._id ? "checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="intern"
                        value={intern._id}
                        onChange={() => setSelectedIntern(intern._id)}
                        className="at-radio"
                      />

                      <div className="at-intern-avatar">
                        {intern.name?.charAt(0).toUpperCase()}
                      </div>

                      <div className="at-intern-info">
                        <span className="at-intern-name">
                          {intern.name}
                        </span>
                        <span className="at-intern-email">
                          {intern.email}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="at-actions">
                <button
                  type="button"
                  className="at-cancel-btn"
                  onClick={() => navigate("/teamlead")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="at-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </form>
          </div>

          <p className="at-footer">
            <button
              type="button"
              className="at-back-link"
              onClick={() => navigate("/teamlead")}
            >
              ← Back to Dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
