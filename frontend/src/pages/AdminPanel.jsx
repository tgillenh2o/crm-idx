import { useEffect, useState } from "react";
import { users } from "../api";

export default function AdminPanel() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    users.all().then(setAllUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {allUsers.map(u => (
            <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
