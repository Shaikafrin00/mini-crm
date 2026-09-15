import React, { useState } from "react";
import api from "../api/axios";

export default function AddLeadModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "Website" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/leads", form);
      onAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add lead");
    }
  };

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h3 style={{ marginTop: 0 }}>Add New Lead</h3>
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        <div className="form-row">
          <label>Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Source</label>
          <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
            <option>Website</option>
            <option>Referral</option>
            <option>Social Media</option>
            <option>Ad Campaign</option>
            <option>Other</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Save Lead</button>
        </div>
      </form>
    </div>
  );
}
