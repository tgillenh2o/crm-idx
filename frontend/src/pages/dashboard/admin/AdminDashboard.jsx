import "./admin.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="muted">Manage your team and listings</p>
      </header>

      {/* Stats */}
      <section className="stats">
        <div className="stat-card">
          <h3>Team Members</h3>
          <strong>3</strong>
        </div>

        <div className="stat-card">
          <h3>Active Listings</h3>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <h3>Leads</h3>
          <strong>0</strong>
        </div>
      </section>

      {/* Team section */}
      <section className="panel">
        <h2>Your Team</h2>

        <div className="table">
          <div className="row header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
          </div>

          <div className="row">
            <span>You</span>
            <span>admin@email.com</span>
            <span>Admin</span>
          </div>
        </div>
      </section>
    </div>
  );
}
