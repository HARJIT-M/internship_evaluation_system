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
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProjectBased, setIsProjectBased] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/project/teamlead/projects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects", err);
      }
    };

    const fetchInterns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/intern/totalinterns",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInterns(res.data);
      } catch (err) {
        console.error("Error fetching interns", err);
      }
    };

    fetchProjects();
    fetchInterns();
  }, []);

  const filteredInterns = interns.filter((intern) =>
    `${intern.name} ${intern.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (!title) return alert("Please enter a task title");
    if (!description) return alert("Please enter a description");
    if (isProjectBased === null) return alert("Please select if this is a project based task");
    if (isProjectBased && !selectedProject) return alert("Please select a project");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern) return alert("Please select an intern");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/task/assign",
        {
          title,
          description,
          internId: selectedIntern,
          isProjectBased,
          projectId: selectedProject
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
            Assign<br />Daily Task
          </h1>
          <p className="at-left-description">
            Assign daily work to interns and track their progress easily.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="at-right">
        <div className="at-form-container">

          {/* STEP INDICATOR */}
          <div className="at-steps">
            <div className={`at-step ${step === 1 ? "at-step--active" : "at-step--done"}`}>
              <div className="at-step-circle">
                {step > 1 ? "✓" : "1"}
              </div>
              <span>Task Details</span>
            </div>
            <div className="at-step-line" />
            <div className={`at-step ${step === 2 ? "at-step--active" : ""}`}>
              <div className="at-step-circle">2</div>
              <span>Assign Intern</span>
            </div>
          </div>

          <div className="at-card">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className="at-card-header">
                  <h2 className="at-card-title">Task Details</h2>
                  <p className="at-card-subtitle">Fill in the task info and project</p>
                </div>

                <div className="at-form">
                  {/* Title */}
                  <div className="at-form-group">
                    <label className="at-form-label">Task Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter task title"
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
                      rows={3}
                    />
                  </div>

                  {/* Project Based Toggle Buttons */}
                  <div className="at-form-group">
                    <label className="at-form-label">Project Based Task?</label>
                    <div className="at-toggle-btns">
                      <button
                        type="button"
                        className={`at-toggle-btn ${isProjectBased === false ? "at-toggle-btn--active at-toggle-btn--no" : ""}`}
                        onClick={() => { setIsProjectBased(false); setSelectedProject(""); }}
                      >
                        📝 No — General Task
                      </button>
                      <button
                        type="button"
                        className={`at-toggle-btn ${isProjectBased === true ? "at-toggle-btn--active at-toggle-btn--yes" : ""}`}
                        onClick={() => setIsProjectBased(true)}
                      >
                        📁 Yes — Project Task
                      </button>
                    </div>
                  </div>

                  {/* Select Project */}
                  {isProjectBased === true && (
                    <div className="at-form-group">
                      <label className="at-form-label">Select Project</label>

                      <div className="at-search-wrapper">
                        <input
                          type="text"
                          placeholder="Search projects..."
                          value={projectSearchTerm}
                          onChange={(e) => setProjectSearchTerm(e.target.value)}
                          className="at-search-input"
                        />
                        <span className="at-search-icon">🔍</span>
                      </div>

                      <div className="at-intern-list-scroll">
                        {filteredProjects.length === 0 ? (
                          <div className="at-intern-empty">No projects found</div>
                        ) : (
                          filteredProjects.map((p) => (
                            <label
                              key={p._id}
                              className={`at-intern-item ${selectedProject === p._id ? "checked" : ""}`}
                            >
                              <input
                                type="radio"
                                name="project"
                                value={p._id}
                                onChange={() => setSelectedProject(p._id)}
                                className="at-radio"
                              />
                              <div className="at-intern-avatar at-project-avatar">
                                📁
                              </div>
                              <div className="at-intern-info">
                                <span className="at-intern-name">{p.title}</span>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Next Button */}
                  <div className="at-actions">
                    <button
                      type="button"
                      className="at-cancel-btn"
                      onClick={() => navigate("/teamlead")}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="at-submit-btn"
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
                <div className="at-card-header">
                  <h2 className="at-card-title">Assign Intern</h2>
                  <p className="at-card-subtitle">Search and select an intern for this task</p>
                </div>

                <form onSubmit={handleSubmit} className="at-form">
                  <div className="at-form-group">
                    <label className="at-form-label">Search Intern</label>
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
                      {filteredInterns.length === 0 ? (
                        <div className="at-intern-empty">No interns found</div>
                      ) : (
                        filteredInterns.map((intern) => (
                          <label
                            key={intern._id}
                            className={`at-intern-item ${selectedIntern === intern._id ? "checked" : ""}`}
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
                              <span className="at-intern-name">{intern.name}</span>
                              <span className="at-intern-email">{intern.email}</span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="at-actions">
                    <button
                      type="button"
                      className="at-cancel-btn"
                      onClick={() => setStep(1)}
                    >
                      ← Back
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
              </>
            )}

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