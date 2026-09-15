import React, { useState } from "react";
import api from "../api/axios";

export default function LeadDetailModal({ lead, onClose, onUpdated }) {
  const [status, setStatus] = useState(lead.status);
  const [noteText, setNoteText] = useState("");

  const updateStatus = async (newStatus) => {
    const res = await api.patch(`/leads/${lead._id}/status`, { status: newStatus });
    setStatus(res.data.status);
    onUpdated(res.data);
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    const res = await api.post(`/leads/${lead._id}/notes`, { text: noteText });
    setNoteText("");
    onUpdated(res.data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: 480 }}>
        <div className="top-bar">
          <h3 style={{ margin: 0 }}>{lead.name}</h3>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone || "—"}</p>
        <p><strong>Source:</strong> {lead.source}</p>

        <div className="form-row">
          <label><strong>Status</strong></label>
          <select value={status} onChange={(e) => updateStatus(e.target.value)}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div className="form-row">
          <label><strong>Notes & Follow-ups</strong></label>
          <div style={{ maxHeight: 150, overflowY: "auto", marginBottom: 8 }}>
            {(lead.notes || []).length === 0 && <p style={{ color: "#888" }}>No notes yet.</p>}
            {(lead.notes || []).map((n, i) => (
              <div key={i} style={{ borderBottom: "1px solid #eee", padding: "6px 0", fontSize: 13 }}>
                <div>{n.text}</div>
                <div style={{ color: "#999", fontSize: 11 }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <textarea
            rows={2}
            placeholder="Add a follow-up note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button className="btn" style={{ marginTop: 8 }} onClick={addNote}>Add Note</button>
        </div>
      </div>
    </div>
  );
}
