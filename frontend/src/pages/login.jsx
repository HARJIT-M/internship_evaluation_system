import { useState } from "react";
import { login } from "../services/authservice";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = await login({ email, password });

      setError("");

      if (role === "intern") navigate("/intern");
      else if (role === "teamlead") navigate("/teamlead");
      else if (role === "admin") navigate("/admin");
      else setError("Invalid role");

    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Sign In Handler
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      // 👉 Replace this with your Google OAuth logic
      //console.log("Google Sign In Clicked");

      // Example redirect (change later)
      // window.location.href = "http://localhost:5000/auth/google";

    } catch (err) {
      setError("Google sign in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="left-overlay" />
        <div className="left-content">
          <div className="left-brand">
            <div className="brand-icon-box">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="brand-name">IES</span>
          </div>

          <h1 className="left-title">
            Internship<br />Evaluation System
          </h1>

          <p className="left-desc">
            Track performance, manage evaluations, and streamline the internship experience.
          </p>

          <div className="left-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Interns</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Team Leads</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">

          <div className="mobile-brand">
            <div className="mobile-brand-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span>Internship Evaluation System</span>
          </div>

          <div className="login_form">
            <h3>Welcome back</h3>
            <p className="login-subtitle">
              Sign in to your account to continue
            </p>

            {error && (
              <div className="error_message">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="input_box">
                <label>Email address</label>
                <div className="input-field">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="input_box">
                <label>Password</label>
                <div className="input-field">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            {/* 🔹 Divider */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* 🔹 Google Button */}
<button
  className="google-btn"
  onClick={handleGoogleSignIn}
  disabled={googleLoading}
>
  {googleLoading ? (
    "Connecting..."
  ) : (
    <>
      <svg
        className="google-icon"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.659 32.657 29.239 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.267 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 16.108 19.007 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.267 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.186 0 9.86-1.977 13.409-5.193l-6.19-5.238C29.191 35.091 26.715 36 24 36c-5.218 0-9.626-3.317-11.284-7.946l-6.523 5.025C9.513 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-1.045 3.042-3.168 5.507-6.084 6.995l6.19 5.238C39.99 36.61 44 30.835 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      <span>Sign in with Google</span>
    </>
  )}
</button>

          </div>

        </div>
      </div>
    </div>
  );
}