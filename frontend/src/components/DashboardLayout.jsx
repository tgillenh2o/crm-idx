import "./dashboard.css";

export default function DashboardLayout({ title, children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>CRM IDX</h2>
        <nav>
          <p>Dashboard</p>
          <p>Leads</p>
          <p>Listings</p>
          <p>Settings</p>
        </nav>
      </aside>

      <main className="content">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
