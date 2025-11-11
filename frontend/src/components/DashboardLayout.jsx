// src/components/DashboardLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">CRM IDX</h2>
        <p className="mb-4">Hello, {user.name}</p>
        <nav className="flex flex-col space-y-3">
          {user.role === "independent" && (
            <Link to="/dashboard" className="hover:text-blue-600">My Leads</Link>
          )}

          {user.role === "teamMember" && (
            <>
              <Link to="/dashboard/member" className="hover:text-blue-600">My Leads</Link>
              <Link to="/dashboard/member/pond" className="hover:text-blue-600">Lead Pond</Link>
            </>
          )}

          {user.role === "teamAdmin" && (
            <>
              <Link to="/dashboard/admin" className="hover:text-blue-600">All Leads</Link>
              <Link to="/dashboard/admin/pond" className="hover:text-blue-600">Lead Pond</Link>
            </>
          )}
        </nav>
        <button
          onClick={logout}
          className="mt-auto bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
