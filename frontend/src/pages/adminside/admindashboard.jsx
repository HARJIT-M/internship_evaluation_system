/*Admindashboard.jsx */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authservice";
import {
  getInterns,
  getTeamleads,
  addUser,
  deleteUser
} from "../../services/adminservice";

import "./AdminDashboard.css";

export default function AdminDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [interns, setInterns] = useState([]);
  const [teamleads, setTeamleads] = useState([]);

  const [filteredInterns, setFilteredInterns] = useState([]);
  const [filteredTeamleads, setFilteredTeamleads] = useState([]);

  const [internSearch, setInternSearch] = useState("");
  const [teamleadSearch, setTeamleadSearch] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popupRole, setPopupRole] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [internPage, setInternPage] = useState(1);
  const [teamleadPage, setTeamleadPage] = useState(1);

  const rowsPerPage = 5;

  const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/");
};


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterInterns();
  }, [internSearch, interns]);

  useEffect(() => {
    filterTeamleads();
  }, [teamleadSearch, teamleads]);

  const fetchData = async () => {
    const internData = await getInterns();
    const teamleadData = await getTeamleads();
    setInterns(internData);
    setTeamleads(teamleadData);
    setFilteredInterns(internData);
    setFilteredTeamleads(teamleadData);
  };

  const filterInterns = () => {
    const result = interns.filter(i =>
      i.name.toLowerCase().includes(internSearch.toLowerCase()) ||
      i.email.toLowerCase().includes(internSearch.toLowerCase())
    );
    setFilteredInterns(result);
    setInternPage(1);
  };

  const filterTeamleads = () => {
    const result = teamleads.filter(t =>
      t.name.toLowerCase().includes(teamleadSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(teamleadSearch.toLowerCase())
    );
    setFilteredTeamleads(result);
    setTeamleadPage(1);
  };

  const openPopup = (role) => {
    setPopupRole(role);
    setForm({ name: "", email: "", password: "", role });
    setShowPopup(true);
  };

  const handleAddUser = async () => {
    await addUser(form);
    setShowPopup(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchData();
  };

  const paginate = (data, page) => {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  };

  const internPages = Math.ceil(filteredInterns.length / rowsPerPage);
  const teamleadPages = Math.ceil(filteredTeamleads.length / rowsPerPage);

  return (
    <div className="ad-dashboard">

      <main className="ad-main">

        {/* TOPBAR */}
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <div className="ad-brand">
              <div className="ad-brand-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ad-brand-text">IES</span>
            </div>
            <div>
              <h1 className="ad-greeting">Welcome back, {user?.name}</h1>
              <p className="ad-greeting-sub">Manage your interns and team leads</p>
            </div>
          </div>
          <div className="ad-avatar-wrapper">
  <div
    className="ad-topbar-avatar"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    {user?.name?.charAt(0).toUpperCase()}
  </div>

  {showDropdown && (
    <div className="ad-avatar-dropdown">
      <button
        className="ad-dropdown-item"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </header>

        {/* STAT CARDS */}
        <div className="ad-stats-row">
          <div className="ad-stat-card">
            <div className="ad-stat-icon ad-stat-icon--interns">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="ad-stat-info">
              <span className="ad-stat-label">Total Interns</span>
              <span className="ad-stat-value">{interns.length}</span>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon ad-stat-icon--leads">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="ad-stat-info">
              <span className="ad-stat-label">Total Team Leads</span>
              <span className="ad-stat-value">{teamleads.length}</span>
            </div>
          </div>

          <div className="ad-stat-card">
            <div className="ad-stat-icon ad-stat-icon--total">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <div className="ad-stat-info">
              <span className="ad-stat-label">Total Users</span>
              <span className="ad-stat-value">{interns.length + teamleads.length}</span>
            </div>
          </div>
        </div>

        {/* TEAMLEAD SECTION */}
        <section className="ad-section">
          <div className="ad-section-header">
            <div className="ad-section-title-group">
              <h2 className="ad-section-title">Team Leaders</h2>
              <span className="ad-section-badge">{filteredTeamleads.length} members</span>
            </div>
            <div className="ad-section-actions">
              <div className="ad-search-wrapper">
                <svg className="ad-search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  className="ad-search"
                  placeholder="Search team leads..."
                  value={teamleadSearch}
                  onChange={(e) => setTeamleadSearch(e.target.value)}
                />
              </div>
              <button className="ad-add-btn" onClick={() => openPopup("teamlead")}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Lead
              </button>
            </div>
          </div>

          <div className="ad-table-wrapper">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginate(filteredTeamleads, teamleadPage).length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="ad-empty-row">No team leads found.</div>
                    </td>
                  </tr>
                ) : (
                  paginate(filteredTeamleads, teamleadPage).map((t, idx) => (
                    <tr key={t._id}>
                      <td className="ad-td-num">{(teamleadPage - 1) * rowsPerPage + idx + 1}</td>
                      <td>
                        <div className="ad-user-cell">
                          <div className="ad-user-avatar">{t.name.charAt(0).toUpperCase()}</div>
                          <span className="ad-user-name">{t.name}</span>
                        </div>
                      </td>
                      <td className="ad-td-email">{t.email}</td>
                      <td><span className="ad-role-badge ad-role-badge--lead">{t.role}</span></td>
                      <td>
                        <button className="ad-delete-btn" onClick={() => handleDelete(t._id)}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="ad-pagination">
            <button
              className="ad-page-btn"
              disabled={teamleadPage === 1}
              onClick={() => setTeamleadPage(teamleadPage - 1)}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Prev
            </button>
            <div className="ad-page-info">
              <span className="ad-page-current">{teamleadPage}</span>
              <span className="ad-page-sep">of</span>
              <span className="ad-page-total">{teamleadPages || 1}</span>
            </div>
            <button
              className="ad-page-btn"
              disabled={teamleadPage === teamleadPages || teamleadPages === 0}
              onClick={() => setTeamleadPage(teamleadPage + 1)}
            >
              Next
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </section>

        {/* INTERN SECTION */}
        <section className="ad-section">
          <div className="ad-section-header">
            <div className="ad-section-title-group">
              <h2 className="ad-section-title">Interns</h2>
              <span className="ad-section-badge">{filteredInterns.length} members</span>
            </div>
            <div className="ad-section-actions">
              <div className="ad-search-wrapper">
                <svg className="ad-search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  className="ad-search"
                  placeholder="Search interns..."
                  value={internSearch}
                  onChange={(e) => setInternSearch(e.target.value)}
                />
              </div>
              <button className="ad-add-btn" onClick={() => openPopup("intern")}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Intern
              </button>
            </div>
          </div>

          <div className="ad-table-wrapper">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginate(filteredInterns, internPage).length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="ad-empty-row">No interns found.</div>
                    </td>
                  </tr>
                ) : (
                  paginate(filteredInterns, internPage).map((i, idx) => (
                    <tr key={i._id}>
                      <td className="ad-td-num">{(internPage - 1) * rowsPerPage + idx + 1}</td>
                      <td>
                        <div className="ad-user-cell">
                          <div className="ad-user-avatar ad-user-avatar--intern">{i.name.charAt(0).toUpperCase()}</div>
                          <span className="ad-user-name">{i.name}</span>
                        </div>
                      </td>
                      <td className="ad-td-email">{i.email}</td>
                      <td><span className="ad-role-badge ad-role-badge--intern">{i.role}</span></td>
                      <td>
                        <button className="ad-delete-btn" onClick={() => handleDelete(i._id)}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="ad-pagination">
            <button
              className="ad-page-btn"
              disabled={internPage === 1}
              onClick={() => setInternPage(internPage - 1)}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Prev
            </button>
            <div className="ad-page-info">
              <span className="ad-page-current">{internPage}</span>
              <span className="ad-page-sep">of</span>
              <span className="ad-page-total">{internPages || 1}</span>
            </div>
            <button
              className="ad-page-btn"
              disabled={internPage === internPages || internPages === 0}
              onClick={() => setInternPage(internPage + 1)}
            >
              Next
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </section>

      </main>

      {/* POPUP */}
      {showPopup && (
        <div className="ad-popup-overlay" onClick={(e) => e.target === e.currentTarget && setShowPopup(false)}>
          <div className="ad-popup">
            <div className="ad-popup-header">
              <div className="ad-popup-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <div>
                <h3 className="ad-popup-title">Add {popupRole === "teamlead" ? "Team Lead" : "Intern"}</h3>
                <p className="ad-popup-sub">Fill in the details below</p>
              </div>
              <button className="ad-popup-close" onClick={() => setShowPopup(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="ad-popup-body">
              <div className="ad-form-group">
                <label className="ad-form-label">Full Name</label>
                <input
                  className="ad-form-input"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="ad-form-group">
                <label className="ad-form-label">Email Address</label>
                <input
                  className="ad-form-input"
                  placeholder="Enter email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="ad-form-group">
                <label className="ad-form-label">Password</label>
                <input
                  className="ad-form-input"
                  placeholder="Enter password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="ad-popup-footer">
              <button className="ad-cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="ad-create-btn" onClick={handleAddUser}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}