import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./evaluateproject.css";

export default function EvaluateProject() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://internship-evaluation-system.onrender.com/api/project/teamlead/projects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects
  .filter((project) => project.status !== "completed")  // only not completed
  .filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ep-wrapper">
        <div className="ep-right">
          <h2 className="ep-loading">Loading projects...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="ep-wrapper">
      {/* Left Panel */}
      <div className="ep-left">
        <div className="ep-left-content">
          <h1 className="ep-left-title">
            Evaluate
            <br />
            Projects
          </h1>
          <p className="ep-left-description">
            Select a project and evaluate the assigned interns.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="ep-right">
        <div className="ep-form-container">
          <div className="ep-card">
            <div className="ep-card-header">
              <h2 className="ep-card-title">
                Select Project to Evaluate
              </h2>
              <p className="ep-card-subtitle">
                Choose a project to view and evaluate interns
              </p>
            </div>

            {/* Search bar */}
            <div className="ep-search-wrapper">
              <input
                type="text"
                placeholder="Search project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ep-search-input"
              />
            </div>

            {filteredProjects.length === 0 ? (
              <p className="ep-empty-text">
                No matching projects
              </p>
            ) : (
              <div className="ep-project-list">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="ep-project-item"
                  >
                    <div className="ep-project-info">
                      <h3 className="ep-project-title">
                        {project.title}
                      </h3>
                      <p className="ep-project-meta">
                        {project.interns.length} interns assigned
                      </p>
                    </div>

                    <button
                      className="ep-submit-btn"
                      onClick={() =>
                        navigate(`/evaluateproject/${project._id}`)
                      }
                    >
                      Open Project
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="ep-footer">
            <button
              className="ep-back-link"
              onClick={() => navigate("/teamlead")}
            >
              &larr; Back to Dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
