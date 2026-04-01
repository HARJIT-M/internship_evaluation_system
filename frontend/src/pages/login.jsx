import { useState, useEffect, useRef } from "react";
import { login } from "../services/authservice";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y
          );
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="login-left">

        <canvas ref={canvasRef} className="particles-canvas" />
        <div className="grid-lines" />
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
        <div className="blob blob--4" />

        <div className="rings-wrap">
          <div className="ring ring--1" />
          <div className="ring ring--2" />
          <div className="ring ring--3" />
        </div>

        <div className="beams-wrap">
          <div className="beam beam--1" />
          <div className="beam beam--2" />
          <div className="beam beam--3" />
          <div className="beam beam--4" />
          <div className="beam beam--5" />
        </div>

        <div className="left-overlay" />

        <div className="left-content">
          <div className={`left-brand ${mounted ? "animate-in" : ""}`}>
            <div className="brand-icon-box">
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="brand-name">IES</span>
          </div>

          <h1
            className={`left-title ${mounted ? "animate-in" : ""}`}
            style={{ animationDelay: "0.1s" }}
          >
            Internship<br />Evaluation<br />System
          </h1>

          <p
            className={`left-desc ${mounted ? "animate-in" : ""}`}
            style={{ animationDelay: "0.2s" }}
          >
            Track performance, manage evaluations, and streamline the internship experience for your entire team.
          </p>

          <div
            className={`left-stats ${mounted ? "animate-in" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
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

      {/* RIGHT PANEL */}
      <div className="login-right">

        <div className="right-orb right-orb--1" />
        <div className="right-orb right-orb--2" />
        <div className="right-grid" />

        <div className={`login-form-wrapper ${mounted ? "form-animate-in" : ""}`}>

          <div className="mobile-brand">
            <div className="mobile-brand-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span>Internship Evaluation System</span>
          </div>

          <div className="login_form">

            <div className="form-top">
              <div className="form-avatar-icon">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3>Welcome back</h3>
              <p className="login-subtitle">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="error_message">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input_box" style={{ animationDelay: "0.15s" }}>
                <label>Email address</label>
                <div className="input-field">
                  <svg className="field-icon" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="input_box" style={{ animationDelay: "0.22s" }}>
                <label>Password</label>
                <div className="input-field">
                  <svg className="field-icon" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span className="btn-loading">
                    <svg className="spinner" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="btn-content">
                    Sign in
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
}