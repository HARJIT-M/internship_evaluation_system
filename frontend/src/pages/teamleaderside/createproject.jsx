import { useState, useEffect } from "react";
import axios from "axios";
import "./createproject.css";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [interns, setInterns] = useState([]);
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://internship-evaluation-system.onrender.com/api/intern/totalinterns",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInterns(res.data);
      } catch (err) {
        console.error("Error fetching interns:", err);
      }
    };
    fetchInterns();
  }, []);

  const handleCheckboxChange = (e) => {
    const internId = e.target.value;
    if (e.target.checked) {
      setSelectedInterns((prev) => [...prev, internId]);
    } else {
      setSelectedInterns((prev) => prev.filter((id) => id !== internId));
    }
  };

  const filteredInterns = interns.filter((intern) =>
    `${intern.name} ${intern.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (!title) return alert("Please enter a project title");
    if (!description) return alert("Please enter a description");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://internship-evaluation-system.onrender.com/api/project/create",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const projectId = res.data._id;

      if (selectedInterns.length > 0) {
        await axios.put(
          `https://internship-evaluation-system.onrender.com/api/project/assign-interns/${projectId}`,
          { internIds: selectedInterns },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("Project created successfully!");
      navigate("/teamlead");
    } catch (err) {
      console.error("Create project error:", err);
      alert("Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-wrapper">
      {/* LEFT PANEL */}
      <div className="cp-left">
        <div className="cp-left-circle cp-left-circle-top" />
        <div className="cp-left-circle cp-left-circle-bottom" />
        <div className="cp-left-dots" />
        <div className="cp-left-content">
          <div className="cp-left-brand">
            <div className="cp-brand-icon-box">
              <svg className="cp-brand-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="cp-brand-label">IES</span>
          </div>
          <h1 className="cp-left-title">
            Create a<br />New Project
          </h1>
          <p className="cp-left-description">
            Set up a new project, write a description, and assign interns to get started right away.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="cp-right">
        <div className="cp-form-container">

          {/* STEP INDICATOR */}
          <div className="cp-steps">
            <div className={`cp-step ${step === 1 ? "cp-step--active" : "cp-step--done"}`}>
              <div className="cp-step-circle">
                {step > 1 ? "✓" : "1"}
              </div>
              <span>Project Details</span>
            </div>
            <div className="cp-step-line" />
            <div className={`cp-step ${step === 2 ? "cp-step--active" : ""}`}>
              <div className="cp-step-circle">2</div>
              <span>Assign Interns</span>
            </div>
          </div>

          <div className="cp-card">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className="cp-card-header">
                  <h2 className="cp-card-title">Project Details</h2>
                  <p className="cp-card-subtitle">Enter the project title and description</p>
                </div>

                <div className="cp-form">
                  <div className="cp-form-group">
                    <label className="cp-form-label">Project Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter project title"
                      className="cp-form-input"
                    />
                  </div>

                  <div className="cp-form-group">
                    <label className="cp-form-label">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter project description"
                      className="cp-form-textarea"
                      rows={4}
                    />
                  </div>

                  <div className="cp-actions">
                    <button
                      type="button"
                      className="cp-cancel-btn"
                      onClick={() => navigate("/teamlead")}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="cp-submit-btn"
                      onClick={handleNext}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div className="cp-card-header">
                  <h2 className="cp-card-title">Assign Interns</h2>
                  <p className="cp-card-subtitle">
                    Search and select interns for this project
                    {selectedInterns.length > 0 && (
                      <span className="cp-selected-badge">{selectedInterns.length} selected</span>
                    )}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="cp-form">
                  <div className="cp-form-group">
                    <div className="cp-search-wrapper">
                      <input
                        type="text"
                        placeholder="Search interns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="cp-search-input"
                      />
                      <span className="cp-search-icon">🔍</span>
                    </div>

                    <div className="cp-intern-list-scroll">
                      {filteredInterns.length === 0 ? (
                        <div className="cp-intern-empty">No interns found</div>
                      ) : (
                        filteredInterns.map((intern) => (
                          <label
                            key={intern._id}
                            className={`cp-intern-item ${selectedInterns.includes(intern._id) ? "checked" : ""}`}
                          >
                            <input
                              type="checkbox"
                              value={intern._id}
                              onChange={handleCheckboxChange}
                              className="cp-checkbox"
                            />
                            <div className="cp-intern-avatar">
                              {intern.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="cp-intern-info">
                              <span className="cp-intern-name">{intern.name}</span>
                              <span className="cp-intern-email">{intern.email}</span>
                            </div>
                            <div className="cp-check-indicator">
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="cp-actions">
                    <button
                      type="button"
                      className="cp-cancel-btn"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="cp-submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Project"}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>

          <p className="cp-footer">
            <button
              type="button"
              className="cp-back-link"
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