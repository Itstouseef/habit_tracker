// src/pages/Admin/AdminDashboard.jsx
import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import User from "./User"; // <-- import your component correctly
import ActivityLogs from "./ActivityLogs";
import FeatureFlags from "./FeatureFlags";





import "./AdminDashboard.css";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-dashboard">
      {/* Hamburger Button */}
      {!sidebarOpen && (
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
  {/* Add the /admin/ prefix to the path */}
  <NavLink to="/admin/users" onClick={() => setSidebarOpen(false)}>
    Users
  </NavLink>
  <NavLink to="/admin/logs" onClick={() => setSidebarOpen(false)}>
    Activity Logs
  </NavLink>
  <NavLink to="/admin/features" onClick={() => setSidebarOpen(false)}>
    Feature Flags
  </NavLink>
</nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="admin-main">
        <Routes>
          <Route index element={<h2>Welcome, Admin!</h2>} />
         <Route path="users" element={<User />} /> {/* <-- updated */}
         
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="features" element={<FeatureFlags />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
