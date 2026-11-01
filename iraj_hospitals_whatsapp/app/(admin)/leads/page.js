"use client";

import { useState, useEffect } from "react";



export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/admin/leads?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.patient_name?.toLowerCase().includes(q) || l.patient_phone?.includes(q);
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete lead");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting lead");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads — Website Submissions</h1>
          <div className="breadcrumb">
            Appointment form &amp; login submissions from irajhospitals.com
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          className={`form-control${search ? " active" : ""}`}
          placeholder="Search patient name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 380 }}
        />
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
            <div className="spinner"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>
            <div className="empty-state-title">No website leads yet</div>
            <div className="empty-state-desc">
              When patients submit the appointment form or log in on irajhospitals.com, their records appear here.
            </div>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Linked Appointment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td data-label="Patient" style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "13.5px" }}>
                      {lead.patient_name || "—"}
                    </td>
                    <td data-label="Phone">
                      <a
                        href={`https://wa.me/${lead.patient_phone?.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#25D366", fontWeight: 600, fontSize: "13.5px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        {lead.patient_phone}
                      </a>
                    </td>
                    <td data-label="Source">
                      <span className="badge badge-blue">
                        {lead.source === "website_appointment_form" ? "Appointment Form" : lead.source || "Website"}
                      </span>
                    </td>
                    <td data-label="Linked Appointment">
                      {lead.linked_appointment_id ? (
                        <span className="badge badge-green">Appointment Created</span>
                      ) : (
                        <span className="badge badge-gray">—</span>
                      )}
                    </td>
                    <td data-label="Date" style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      {new Date(lead.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "numeric", month: "short",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td data-label="Action">
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a
                          href={`https://wa.me/${lead.patient_phone?.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm"
                          style={{ background: "#DCF8C6", color: "#075E54", display: "flex", alignItems: "center", gap: "6px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          WhatsApp
                        </a>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="btn btn-sm"
                          style={{ background: "#FEE2E2", color: "#EF4444", border: "none" }}
                          title="Delete Lead"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
