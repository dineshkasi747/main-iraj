"use client";

import { useState, useEffect } from "react";

function StatusBadge({ status }) {
  const map = {
    confirmed:          { cls: "badge-green",  label: "Confirmed" },
    pending_payment:    { cls: "badge-amber",  label: "Pending Payment" },
    cancelled:          { cls: "badge-red",    label: "Cancelled" },
    completed:          { cls: "badge-gray",   label: "Completed" },
    waiting_onboarding: { cls: "badge-blue",   label: "Waiting" },
  };
  const s = map[status] || { cls: "badge-gray", label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

function PaymentBadge({ mode, paymentStatus }) {
  if (paymentStatus === "paid") {
    return <span className="badge badge-green">Paid {mode === "online" ? "Online" : "at Hospital"}</span>;
  }
  if (mode === "pay_at_hospital") {
    return <span className="badge badge-amber">Pending (At Hospital)</span>;
  }
  if (mode === "online") {
    return <span className="badge badge-amber">Pending (Online)</span>;
  }
  return <span className="badge badge-gray">Not Set</span>;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", date: "", date_from: "", date_to: "", search: "", source: "", doctor_id: "", department_id: "" });
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentModal, setPaymentModal] = useState({ open: false, appointment_id: null, amount: "", note: "" });
  const [detailSheet, setDetailSheet] = useState({ open: false, appointment: null, patientHistory: [] });
  const PAGE_SIZE = 25;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const doctor_id = searchParams.get("doctor_id");
    const department_id = searchParams.get("department_id");
    if (doctor_id || department_id) {
      setFilters(prev => ({ ...prev, doctor_id: doctor_id || "", department_id: department_id || "" }));
    }
  }, []);

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      // Only add non-empty filters
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const res = await fetch(`/api/admin/appointments?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
    const interval = setInterval(() => fetchData(true), 5000);
    return () => clearInterval(interval);
  }, [filters, page]);

  const filtered = appointments.filter((a) => {
    if (!filters.search) return true;
    const q = filters.search.toLowerCase();
    return (
      a.patient_name?.toLowerCase().includes(q) ||
      a.patient_phone?.includes(q) ||
      a.doctors?.name?.toLowerCase().includes(q) ||
      a.doctors?.departments?.name?.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v && k !== "search") params.set(k, v); });
    window.open(`/api/admin/appointments/export?${params}`, "_blank");
  };

  const openDetailSheet = async (appt) => {
    setDetailSheet({ open: true, appointment: appt, patientHistory: [] });
    // Fetch patient history by phone
    try {
      const res = await fetch(`/api/admin/appointments?limit=50&search=`);
      if (res.ok) {
        const data = await res.json();
        const history = (data.appointments || []).filter(
          a => a.patient_phone === appt.patient_phone && a.id !== appt.id
        );
        setDetailSheet(prev => ({ ...prev, patientHistory: history }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <div className="breadcrumb">All bookings — WhatsApp &amp; Website &amp; Manual</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-outline" onClick={handleExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export CSV
          </button>
          <a href="/appointments/new" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Manual Booking
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search patient or doctor..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ flex: "1 1 200px", minWidth: 180, paddingLeft: 34, backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394A3B8%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><circle cx=%2211%22 cy=%2211%22 r=%228%22></circle><line x1=%2221%22 y1=%2221%22 x2=%2216.65%22 y2=%2216.65%22></line></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "10px center" }}
        />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
          <option value="">All Sources</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="website_lead">Website</option>
          <option value="offline">Manual</option>
        </select>

        {/* Date Shortcuts */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", borderLeft: "1px solid var(--border)", paddingLeft: "10px", marginLeft: "4px" }}>
          <button 
            className={`btn btn-sm ${filters.date === "today" ? "btn-primary" : "btn-outline"}`} 
            onClick={() => { setFilters({ ...filters, date: "today", date_from: "", date_to: "" }); setPage(0); }}
          >
            Today
          </button>
          <button 
            className={`btn btn-sm ${!filters.date && !filters.date_from && !filters.date_to ? "btn-primary" : "btn-outline"}`} 
            onClick={() => { setFilters({ ...filters, date: "", date_from: "", date_to: "" }); setPage(0); }}
          >
            All Time
          </button>
        </div>

        {/* Date Range */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", borderLeft: "1px solid var(--border)", paddingLeft: "10px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>From</span>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value, date: "" })}
            style={{ width: "135px" }}
          />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>To</span>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value, date: "" })}
            style={{ width: "135px" }}
          />
        </div>
        
        <button className="btn btn-outline btn-sm" onClick={() => { setFilters({ status: "", date: "", date_from: "", date_to: "", search: "", source: "", doctor_id: "", department_id: "" }); setPage(0); }}>
          Clear All
        </button>
      </div>

      <div className="card" style={{ borderRadius: "0 0 var(--radius-lg) var(--radius-lg)" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
            <div className="spinner" style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
            </div>
            <div className="empty-state-title">No appointments found</div>
            <div className="empty-state-desc">Try adjusting the filters above.</div>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor / Dept</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => (
                  <tr key={appt.id} onClick={() => openDetailSheet(appt)} style={{ cursor: "pointer" }}>
                    <td data-label="Patient">
                      <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "13.5px" }}>
                        {appt.patient_name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        {appt.patient_phone}
                      </div>
                    </td>
                    <td data-label="Doctor / Dept">
                      <div style={{ fontWeight: 600, fontSize: "13.5px" }}>{appt.doctors?.name || "—"}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{appt.doctors?.departments?.name || "—"}</div>
                    </td>
                    <td data-label="Date" style={{ fontSize: "13.5px", fontWeight: 500 }}>{appt.appointment_date}</td>
                    <td data-label="Time">
                      <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--teal)" }}>
                        {appt.appointment_time?.substring(0, 5)}
                      </span>
                    </td>
                    <td data-label="Status"><StatusBadge status={appt.status} /></td>
                    <td data-label="Payment"><PaymentBadge mode={appt.payment_mode} paymentStatus={appt.payment_status} /></td>
                    <td data-label="Source">
                      <span className={`badge ${appt.source === "whatsapp" ? "badge-green" : appt.source === "website_lead" ? "badge-blue" : "badge-gray"}`}>
                        {appt.source === "whatsapp" ? "WA" : appt.source === "website_lead" ? "Web" : "Manual"}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div style={{ display: "flex", gap: "6px" }} onClick={e => e.stopPropagation()}>
                        <a
                          href={`https://wa.me/${appt.patient_phone?.replace(/\D/g,"")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm"
                          style={{ background: "#DCF8C6", color: "#128C7E", padding: "4px 8px" }}
                          title="Send WhatsApp"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                        <button
                          className="btn btn-sm btn-danger"
                          title="Cancel appointment"
                          onClick={() => handleCancel(appt.id)}
                          style={{ padding: "4px 8px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        {appt.payment_status !== "paid" && appt.status !== "cancelled" && (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setPaymentModal({ open: true, appointment_id: appt.id, amount: appt.amount || 300, note: "" })}
                            style={{ padding: "4px 8px", color: "var(--teal)", borderColor: "var(--teal)" }}
                            title="Mark Paid"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 20px", borderTop: "1px solid var(--border)",
            fontSize: "13px", color: "var(--text-muted)",
          }}>
            <span>Showing {filtered.length} of {total} result{total !== 1 ? "s" : ""}</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-sm btn-outline" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                ← Prev
              </button>
              <span style={{ padding: "5px 10px", fontWeight: 600 }}>Page {page + 1}</span>
              <button className="btn btn-sm btn-outline" onClick={() => setPage(page + 1)} disabled={filtered.length < PAGE_SIZE}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModal.open && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 400, padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Collect Payment</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await fetch(`/api/admin/appointments/${paymentModal.appointment_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  payment_status: "paid",
                  amount: paymentModal.amount,
                  razorpay_payment_id: paymentModal.note
                })
              });
              setPaymentModal({ open: false, appointment_id: null, amount: "", note: "" });
              fetchData();
            }}>
              <label className="form-label">Amount Collected (₹)</label>
              <input required type="number" className="form-control" value={paymentModal.amount} onChange={e => setPaymentModal({...paymentModal, amount: e.target.value})} style={{ width: "100%", marginBottom: 16 }} />
              
              <label className="form-label">Note / Transaction ID (Optional)</label>
              <input type="text" className="form-control" value={paymentModal.note} onChange={e => setPaymentModal({...paymentModal, note: e.target.value})} style={{ width: "100%", marginBottom: 24 }} placeholder="e.g. Cash, UPI ID, Card Ref..." />
              
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setPaymentModal({ open: false, appointment_id: null, amount: "", note: "" })}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Detail Side Sheet */}
      {detailSheet.open && detailSheet.appointment && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)" }} onClick={() => setDetailSheet({ open: false, appointment: null, patientHistory: [] })}>
          <div style={{ width: "480px", maxWidth: "100%", background: "var(--bg-page)", height: "100%", display: "flex", flexDirection: "column", boxShadow: "-4px 0 25px rgba(0,0,0,0.15)", animation: "slideIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: "20px 24px", background: "var(--bg-card)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", color: "var(--text-heading)" }}>Appointment Details</h3>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>ID: {detailSheet.appointment.id?.substring(0, 8)}...</div>
              </div>
              <button onClick={() => setDetailSheet({ open: false, appointment: null, patientHistory: [] })} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "24px", color: "var(--text-muted)", padding: "0 8px" }}>&times;</button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {/* Current Appointment */}
              <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: "20px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)" }}>{detailSheet.appointment.patient_name}</div>
                    <a href={`https://wa.me/${detailSheet.appointment.patient_phone?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: "#25D366", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      {detailSheet.appointment.patient_phone}
                    </a>
                  </div>
                  <StatusBadge status={detailSheet.appointment.status} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ padding: "12px", background: "var(--bg-page)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Doctor</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-heading)" }}>{detailSheet.appointment.doctors?.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{detailSheet.appointment.doctors?.departments?.name}</div>
                  </div>
                  <div style={{ padding: "12px", background: "var(--bg-page)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Schedule</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--teal)" }}>{detailSheet.appointment.appointment_date}</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>{detailSheet.appointment.appointment_time?.substring(0, 5)}</div>
                  </div>
                  <div style={{ padding: "12px", background: "var(--bg-page)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Payment</div>
                    <PaymentBadge mode={detailSheet.appointment.payment_mode} paymentStatus={detailSheet.appointment.payment_status} />
                    {detailSheet.appointment.amount && <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>₹{detailSheet.appointment.amount}</div>}
                  </div>
                  <div style={{ padding: "12px", background: "var(--bg-page)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Source</div>
                    <span className={`badge ${detailSheet.appointment.source === "whatsapp" ? "badge-green" : detailSheet.appointment.source === "website_lead" ? "badge-blue" : "badge-gray"}`}>
                      {detailSheet.appointment.source === "whatsapp" ? "WhatsApp" : detailSheet.appointment.source === "website_lead" ? "Website" : "Manual"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Visit History */}
              <div style={{ marginBottom: "12px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)", marginBottom: "12px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "6px", verticalAlign: "middle"}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  Patient Visit History ({detailSheet.patientHistory.length} previous)
                </h4>
                {detailSheet.patientHistory.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", fontSize: "13px" }}>
                    No previous visits found for this patient.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {detailSheet.patientHistory.map(h => (
                      <div key={h.id} style={{ padding: "12px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-card)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-heading)" }}>{h.doctors?.name}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{h.doctors?.departments?.name}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "12.5px", color: "var(--teal)", fontWeight: 700 }}>{h.appointment_date}</div>
                          <StatusBadge status={h.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", background: "var(--bg-card)", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
              <a href={`https://wa.me/${detailSheet.appointment.patient_phone?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ flex: 1, justifyContent: "center", background: "#DCF8C6", color: "#075E54" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "6px"}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                WhatsApp
              </a>
              <button className="btn btn-sm btn-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setDetailSheet({ open: false, appointment: null, patientHistory: [] }); }}>
                Close
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          `}</style>
        </div>
      )}
    </>
  );

  async function handleCancel(id) {
    if (!confirm("Cancel this appointment? This will NOT send a WhatsApp notification automatically.")) return;
    await fetch(`/api/admin/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "cancelled" }) });
    fetchData();
  }
}
