import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./evaluateintern.css";

export default function EvaluateIntern() {
  const { projectId, internId } = useParams();
  const navigate = useNavigate();

  const [intern, setIntern] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [marks, setMarks] = useState({
    timeliness: 0,
    behaviour: 0,
    technicalSkills: 0,
    communication: 0,
    teamwork: 0,
  });

  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://internship-evaluation-system.onrender.com/api/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const foundIntern = res.data.interns.find(
          (i) => i._id === internId
        );

        if (!foundIntern) {
          alert("Intern not found");
          navigate(`/evaluateproject/${projectId}`);
          return;
        }

        setProject(res.data);
        setIntern(foundIntern);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [projectId, internId, navigate]);

  const handleChange = (field, value) => {
    setMarks({ ...marks, [field]: Number(value) });
  };

  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://internship-evaluation-system.onrender.com/api/evaluation/update/${projectId}/${internId}`,
      {
        ...marks,
        feedback,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Evaluation updated successfully");
    navigate(`/evaluateproject/${projectId}`);
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  }
};

  if (loading) {
    return (
      <div className="cp-wrapper">
        <div className="cp-right">
          <h2 className="cp-loading">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-wrapper">
      {/* Left panel */}
      <div className="cp-left">
        <div className="cp-left-circle cp-left-circle-top" />
        <div className="cp-left-circle cp-left-circle-bottom" />
        <div className="cp-left-dots" />

        <div className="cp-left-content">
          <div className="cp-left-brand">
            <div className="cp-brand-icon-box">
              <span className="cp-brand-label">IES</span>
            </div>
          </div>

          <h1 className="cp-left-title">
            Evaluate
            <br />
            Intern
          </h1>

          <p className="cp-left-description">
            Provide performance scores and feedback for the assigned intern.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="cp-right">
        <div className="cp-form-container">
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">Intern Evaluation</h2>
              <p className="cp-card-subtitle">
                {intern.name} • {intern.email}
              </p>
              <p className="cp-card-subtitle">
                Project: {project.title}
              </p>
            </div>

            <div className="cp-form">
              {/* Marks */}
              <div className="cp-marks-grid">
                {Object.keys(marks).map((key) => (
                  <div className="cp-form-group" key={key}>
                    <label className="cp-form-label">
                      {key}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={marks[key]}
                      onChange={(e) =>
                        handleChange(key, e.target.value)
                      }
                      className="cp-form-input"
                    />
                  </div>
                ))}
              </div>

              {/* Feedback */}
              <div className="cp-form-group">
                <label className="cp-form-label">
                  Feedback
                </label>
                <textarea
                  placeholder="Write feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="cp-form-textarea"
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="cp-actions">
                <button
                  type="button"
                  className="cp-cancel-btn"
                  onClick={() =>
                    navigate(`/evaluateproject/${projectId}`)
                  }
                >
                  Cancel
                </button>

                <button
                  className="cp-submit-btn"
                  onClick={handleSubmit}
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>

          <p className="cp-footer">
            <button
              className="cp-back-link"
              onClick={() =>
                navigate(`/evaluateproject/${projectId}`)
              }
            >
              &larr; Back to Project
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
