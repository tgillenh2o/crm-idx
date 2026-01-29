import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AddLead.css";

export default function AddLead({ isAdmin, onLeadAdded }) {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
    assignedTo: isAdmin ? "" : user.email, // member auto-assign
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const newLead = await res.json();
      if (res.ok) {
        onLeadAdded(newLead);
        // reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          status: "New",
          assignedTo: isAdmin ? "" : user.email,
        });
      } else {
        console.error("Failed to add lead:", newLead);
      }
    } catch (err) {
      console.error("Add lead error:", err);
    }
  };

  return (
    <div className="add-lead-modal">
      <form className="add-lead-form" onSubmit={handleSubmit}>
        <h3>Add New Lead</h3>

        <label>
          Name:
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone:
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Follow-Up</option>
            <option>Under Contract</option>
            <option>Closed</option>
          </select>
        </label>

        {isAdmin && (
          <label>
            Assign To:
            <input
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Email or POND"
            />
          </label>
        )}

        <button type="submit" className="add-lead-btn">
          Add Lead
        </button>
      </form>
    </div>
  );
}
