import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./internranking.css";
import { logout } from "../../services/authservice";

export default function InternRanking() {
  const [ranking, setRanking] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate("/");
};

  const limit = 6;

  useEffect(() => {
    fetchRanking(page);
  }, [page]);

  useEffect(() => {
    if (!search) {
      setFiltered(ranking);
    } else {
      setFiltered(
        ranking.filter(
          (i) =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, ranking]);

  const fetchRanking = async (pageNum) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://internship-evaluation-system.onrender.com/api/evaluation/ranking?page=${pageNum}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sorted = [...res.data.data].sort((a, b) => b.avgScore - a.avgScore);

    const ranked = sorted.map((intern, index) => ({
      ...intern,
      rank: index + 1
    }));
      setRanking(res.data.data);
      setFiltered(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Ranking error", err);
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return "ir-medal--gold";
    if (rank === 2) return "ir-medal--silver";
    if (rank === 3) return "ir-medal--bronze";
    return "";
  };

  return (
    <div className="ir-layout">

      {/* SIDEBAR (unchanged) */}
      <aside className={`ir-sidebar ${showMenu ? "open" : ""}`}>
        <div className="ir-sidebar-header">
          <div className="ir-sidebar-brand">
            <div className="ir-brand-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="ir-brand-text">IES</span>
          </div>
          <button className="ir-sidebar-close" onClick={() => setShowMenu(false)}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="ir-nav">
          <div className="ir-nav-item" onClick={() => navigate("/teamlead")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span>Dashboard</span>
          </div>

          <div className="ir-nav-item" onClick={() => navigate("/createproject")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Project</span>
          </div>


          <div className="ir-nav-item" onClick={() => navigate("/viewproject")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
            <span>View Projects</span>
          </div>

          <div className="ir-nav-item" onClick={() => navigate("/evaluateproject")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
            <span>Evaluate Project</span>
          </div>

          <div className="tl-nav-item" onClick={() => { navigate("/addtask"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Task</span>
          </div>

          <div className="tl-nav-item" onClick={() => { navigate("/viewtasks"); setShowMenu(false); }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
            <span>View Tasks</span>
          </div>


          <div className="ir-nav-item active">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M4 20V10m6 10V4m6 16v-7"
  />
</svg>
            <span>Intern Ranking</span>
          </div>
        </nav>
      </aside>

      {showMenu && (
        <div className="ir-overlay" onClick={() => setShowMenu(false)} />
      )}

      {/* MAIN */}
      <main className="ir-main">

        {/* TOPBAR */}
        <header className="ir-topbar">
          <button className="ir-menu-btn" onClick={() => setShowMenu(true)}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="ir-topbar-text">
            <h1 className="ir-topbar-title">Intern Ranking</h1>
            <p className="ir-topbar-sub">Overall intern performance overview</p>
          </div>
          <div className="ir-avatar-wrapper">
  <div
    className="ir-topbar-avatar"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    R
  </div>

  {showDropdown && (
    <div className="ir-avatar-dropdown">
      <button
        className="ir-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </header>

        {/* STAT CARDS */}
        <section className="ir-stats">

          <div className="ir-stat-card ir-stat-card--indigo">
            <div className="ir-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ir-stat-text">
              <div className="ir-stat-label">Total Interns</div>
              <div className="ir-stat-value">{ranking.length}</div>
            </div>
            <div className="ir-stat-bg-num">{ranking.length}</div>
          </div>

          <div className="ir-stat-card ir-stat-card--amber">
            <div className="ir-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="ir-stat-text">
              <div className="ir-stat-label">Top Performer</div>
              <div className="ir-stat-value ir-stat-value--name">{ranking[0]?.name || "—"}</div>
            </div>
          </div>

          <div className="ir-stat-card ir-stat-card--green">
            <div className="ir-stat-icon-wrap">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ir-stat-text">
              <div className="ir-stat-label">Highest Avg Score</div>
              <div className="ir-stat-value">{ranking[0]?.avgScore || "—"}</div>
            </div>
            <div className="ir-stat-bg-num">{ranking[0]?.avgScore || ""}</div>
          </div>

        </section>

        {/* RANKING TABLE PANEL */}
        <section className="ir-panel">

          <div className="ir-panel-topbar">
            <div>
              <h2 className="ir-panel-title">Intern Rankings</h2>
              <p className="ir-panel-sub">Sorted by overall performance score</p>
            </div>

            <div className="ir-search-wrap">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="ir-search"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ir-table-wrap">
            <table className="ir-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Score</th>
                  <th>Average</th>
                  <th>Projects</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ir-empty-row">No results found</td>
                  </tr>
                ) : (
                  filtered.map((intern, index) => (
                    <tr
                      key={intern.internId}
                      className={`ir-table-row ${intern.rank <= 3 ? "ir-row--top" : ""}`}
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <td>
                        <div className={`ir-rank-badge ${getMedalColor(intern.rank)}`}>
                          {intern.rank <= 3 ? (
                            intern.rank === 1 ? "🥇" : intern.rank === 2 ? "🥈" : "🥉"
                          ) : (
                            `#${intern.rank}`
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="ir-name-cell">
                          <div className="ir-avatar">
                            {intern.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{intern.name}</span>
                        </div>
                      </td>
                      <td className="ir-email-cell">{intern.email}</td>
                      <td>
                        <span className="ir-score-pill">{intern.totalScore}</span>
                      </td>
                      <td className="ir-avg-cell">{intern.avgScore}</td>
                      <td>{intern.evaluations}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </section>

        {/* PAGINATION */}
        <section className="ir-pagination-wrap">
          <button
            className="ir-page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div className="ir-page-info">
            Page <span>{page}</span> of <span>{totalPages}</span>
          </div>

          <button
            className="ir-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

      </main>
    </div>
  );
}