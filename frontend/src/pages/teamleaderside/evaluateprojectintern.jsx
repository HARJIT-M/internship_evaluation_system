import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./evaluateprojectintern.css";

export default function EvaluateProjectInterns() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://internship-evaluation-system.onrender.com/api/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProject(res.data);
      } catch (err) {
        console.error("Error loading project", err);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return (
      <div className="epi-wrapper">
        <div className="epi-right">
          <h2 className="epi-loading">Loading interns...</h2>
        </div>
      </div>
    );
  }

  const markProjectCompleted = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://internship-evaluation-system.onrender.com/api/project/${projectId}/complete`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Project marked as completed");

  } catch (error) {
    console.error("Error updating project:", error);
  }
};


  const filteredInterns = project.interns.filter((intern) =>
  `${intern.name} ${intern.email}`
    .toLowerCase()
    .includes(search.toLowerCase())
);
  const allEvaluated = project.interns.every(
  (intern) => intern.status === "completed"
);
  return (
    <div className="epi-wrapper">
      {/* Left panel */}
      <div className="epi-left">
        <div className="epi-left-content">
          <h1 className="epi-left-title">
            Evaluate
            <br />
            Interns
          </h1>
          <p className="epi-left-description">
            Select an intern from the project and submit their evaluation.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="epi-right">
        <div className="epi-form-container">
          <div className="epi-card">
            <div className="epi-card-header">
              <h2 className="epi-card-title">{project.title}</h2>
              <p className="epi-card-subtitle">
                Assigned Interns
              </p>
            </div>

            {/* Search */}
            <div className="epi-search-wrapper">
              <input
                type="text"
                placeholder="Search interns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="epi-search-input"
              />
            </div>

            {filteredInterns.length === 0 ? (
              <p className="epi-empty-text">No interns found</p>
            ) : (
              <div className="epi-intern-list">
                {filteredInterns.map((intern) => (
                  <div
                    key={intern._id}
                    className="epi-intern-item"
                  >
                    <div className="epi-intern-info">
                      <div className="epi-avatar">
                        {intern.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="epi-intern-name">
                          {intern.name}
                        </p>
                        <p className="epi-intern-email">
                          {intern.email}
                        </p>
                      </div>
                    </div>

                    <button
  className={`epi-evaluate-btn ${
    intern.status === "completed" ? "evaluated-btn" : ""
  }`}
  disabled={intern.status === "completed"}
  onClick={() =>
    intern.status !== "completed" &&
    navigate(`/evaluateintern/${project._id}/${intern._id}`)
  }
>
  {intern.status === "completed" ? "Evaluated" : "Evaluate"}
</button>
                  </div>
                  
                ))}
                <button
  className="epi-complete-project-btn"
  onClick={markProjectCompleted}
>
  Mark Project as Completed
</button>

              </div>
            )}
          </div>

          <p className="epi-footer">
            <button
              className="epi-back-link"
              onClick={() =>
                navigate("/evaluateproject")
              }
            >
              &larr; Back to Projects
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
