import { Link, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";

export default function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">CRM IDX</h2>

        <nav>
          {role === "admin" && (
            <Link to="/dashboard/admin">Dashboard</Link>
          )}

          {role === "member" && (
            <Link to="/dashboard/member">Dashboard</Link>
          )}

          <Link to="#">Listings</Link>
          <Link to="#">Leads</Link>
        </nav>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="main">
        {children}
      </main>
    </div>
  );
}
