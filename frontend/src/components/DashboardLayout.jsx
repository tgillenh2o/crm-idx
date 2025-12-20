export default function DashboardLayout({ children, title }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 220, background: "#111", color: "#fff" }}>
        <h3 style={{ padding: 20 }}>CRM IDX</h3>
        <nav style={{ padding: 20 }}>
          <p>Dashboard</p>
          <p>Leads</p>
          <p>Listings</p>
          <p>Settings</p>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 30 }}>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
