import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import AddLeadModal from "../components/AddLeadModal";
import LeadDetailModal from "../components/LeadDetailModal";
import ProfileMenu from "../components/ProfileMenu";
import {
  IconUsers,
  IconUserPlus,
  IconPhone,
  IconCheckCircle,
  IconSearch,
  IconChevronDown,
  IconEye,
  IconTrash,
  IconZap,
  IconPlus,
} from "../components/Icons";

const STATUS_OPTIONS = ["new", "contacted", "converted", "lost"];

export default function Dashboard() {
  const [allLeads, setAllLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await api.get("/leads");
    setAllLeads(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = useMemo(
    () => ({
      total: allLeads.length,
      new: allLeads.filter((l) => l.status === "new").length,
      contacted: allLeads.filter((l) => l.status === "contacted").length,
      converted: allLeads.filter((l) => l.status === "converted").length,
    }),
    [allLeads]
  );

  const visibleLeads = useMemo(() => {
    return allLeads.filter((l) => {
      const matchesStatus = statusFilter ? l.status === statusFilter : true;
      const q = search.trim().toLowerCase();
      const matchesSearch = q
        ? l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [allLeads, statusFilter, search]);

  const updateStatusInline = async (id, status) => {
    const res = await api.patch(`/leads/${id}/status`, { status });
    setAllLeads((prev) => prev.map((l) => (l._id === id ? res.data : l)));
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await api.delete(`/leads/${id}`);
    setAllLeads((prev) => prev.filter((l) => l._id !== id));
  };

  const onLeadUpdated = (updated) => {
    setAllLeads((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
    setSelectedLead(updated);
  };

  return (
    <div className="lf-page">
      <header className="lf-header">
        <div className="lf-brand">
          <div className="lf-logo"><IconZap width={20} height={20} /></div>
          <div>
            <div className="lf-title">LeadFlow</div>
            <div className="lf-subtitle">Client Lead Management</div>
          </div>
        </div>
        <div className="lf-header-right">
          <ProfileMenu />
          <button className="btn lf-add-btn" onClick={() => setShowAdd(true)}>
            <IconPlus width={16} height={16} /> Add Lead
          </button>
        </div>
      </header>

      <main className="lf-main">
        <div className="lf-stats">
          <div className="lf-stat-card">
            <div className="lf-stat-icon lf-icon-gray"><IconUsers /></div>
            <div>
              <div className="lf-stat-value">{stats.total}</div>
              <div className="lf-stat-label">Total Leads</div>
            </div>
          </div>
          <div className="lf-stat-card">
            <div className="lf-stat-icon lf-icon-blue"><IconUserPlus /></div>
            <div>
              <div className="lf-stat-value">{stats.new}</div>
              <div className="lf-stat-label">New</div>
            </div>
          </div>
          <div className="lf-stat-card">
            <div className="lf-stat-icon lf-icon-amber"><IconPhone /></div>
            <div>
              <div className="lf-stat-value">{stats.contacted}</div>
              <div className="lf-stat-label">Contacted</div>
            </div>
          </div>
          <div className="lf-stat-card">
            <div className="lf-stat-icon lf-icon-green"><IconCheckCircle /></div>
            <div>
              <div className="lf-stat-value">{stats.converted}</div>
              <div className="lf-stat-label">Converted</div>
            </div>
          </div>
        </div>

        <div className="lf-toolbar">
          <div className="lf-search">
            <IconSearch width={18} height={18} />
            <input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="lf-select-wrapper">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <IconChevronDown width={16} height={16} className="lf-select-chevron" />
          </div>
        </div>

        <div className="lf-table-card">
          {loading ? (
            <p style={{ padding: 20 }}>Loading leads...</p>
          ) : (
            <table className="lf-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td className="lf-name">{lead.name}</td>
                    <td className="lf-muted">{lead.email}</td>
                    <td className="lf-muted">{lead.source}</td>
                    <td>
                      <div className="lf-status-select-wrapper">
                        <select
                          className={`lf-status-select lf-status-${lead.status}`}
                          value={lead.status}
                          onChange={(e) => updateStatusInline(lead._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <IconChevronDown width={14} height={14} className="lf-status-chevron" />
                      </div>
                    </td>
                    <td>
                      <div className="lf-actions">
                        <button className="lf-icon-btn" title="View" onClick={() => setSelectedLead(lead)}>
                          <IconEye width={17} height={17} />
                        </button>
                        <button className="lf-icon-btn lf-icon-btn-danger" title="Delete" onClick={() => deleteLead(lead._id)}>
                          <IconTrash width={17} height={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visibleLeads.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: 24 }}>
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showAdd && (
        <AddLeadModal
          onClose={() => setShowAdd(false)}
          onAdded={(lead) => setAllLeads((prev) => [lead, ...prev])}
        />
      )}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdated={onLeadUpdated}
        />
      )}
    </div>
  );
}