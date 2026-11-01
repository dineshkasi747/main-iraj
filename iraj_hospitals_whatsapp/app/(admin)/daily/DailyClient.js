"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DailyClient({ initialAppointments, todayIST }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [sending, setSending] = useState(false);
  
  const [filterMode, setFilterMode] = useState("all"); 
  const [results, setResults] = useState(null); 
  
  const [paymentModal, setPaymentModal] = useState({ open: false, appointment_id: null, amount: "", note: "" });

  const getMinutesUntil = (timeStr) => {
    const now = new Date();
    const [h, m] = timeStr.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    return Math.round((target - now) / 60000);
  };

  const getFilteredAppointments = () => {
    if (filterMode === "all") return appointments;
    let maxMins = 0;
    if (filterMode === "30m") maxMins = 30;
    if (filterMode === "1h") maxMins = 60;
    if (filterMode === "1.5h") maxMins = 90;
    if (filterMode === "2h") maxMins = 120;
    return appointments.filter(appt => {
      const mins = getMinutesUntil(appt.appointment_time);
      return mins >= 0 && mins <= maxMins;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  const handleSendReminders = async () => {
    if (filteredAppointments.length === 0) return;
    if (!confirm(`Send reminders to ${filteredAppointments.length} patient(s)?`)) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/send-custom-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentIds: filteredAppointments.map(u => u.id) })
      });
      const data = await res.json();
      if (data.success) {
        setResults({ successful: data.successful, failed: data.failed });
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Request failed: " + err.message);
    }
    setSending(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/update-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: id, 
          updates: { status: newStatus } 
        })
      });
      const data = await res.json();
      if (data.success) {
        if (newStatus === "completed" || newStatus === "cancelled") {
          setAppointments(prev => prev.filter(a => a.id !== id));
        } else {
          setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        }
        router.refresh();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      {/* Reminder Results Modal */}
      {results && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ width: "90%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto", background: "var(--bg-page)" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="card-title">Reminder Results</h2>
              <button onClick={() => setResults(null)} className="btn btn-sm btn-outline">Close</button>
            </div>
            <div className="card-body" style={{ padding: "20px" }}>
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <div style={{ flex: 1, padding: "16px", borderRadius: "8px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--green)" }}>{results.successful.length}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Successfully Sent</div>
                </div>
                <div style={{ flex: 1, padding: "16px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--red)" }}>{results.failed.length}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Failed</div>
                </div>
              </div>
              {results.failed.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--red)", marginBottom: "10px" }}>Failed Reminders</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {results.failed.map((f, i) => (
                      <div key={i} style={{ padding: "10px", borderRadius: "6px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", fontSize: "13px" }}>
                        <strong>{f.name}</strong> ({f.phone}) - <span style={{ color: "var(--red)" }}>{f.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {results.successful.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--green)", marginBottom: "10px" }}>Successful Reminders</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {results.successful.map((s, i) => (
                      <div key={i} style={{ padding: "10px", borderRadius: "6px", background: "rgba(34, 197, 94, 0.05)", border: "1px solid rgba(34, 197, 94, 0.2)", fontSize: "13px" }}>
                        <strong>{s.name}</strong> ({s.phone})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ width: "90%", maxWidth: "400px", padding: 24, background: "var(--bg-page)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 style={{ marginBottom: 16 }}>Collect Payment</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/admin/update-appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  id: paymentModal.appointment_id,
                  updates: {
                    payment_status: "paid",
                    payment_mode: "online",
                    amount: paymentModal.amount,
                    razorpay_payment_id: paymentModal.note
                  }
                })
              });
              setPaymentModal({ open: false, appointment_id: null, amount: "", note: "" });
              setAppointments(prev => prev.map(a => a.id === paymentModal.appointment_id ? { ...a, payment_status: "paid", payment_mode: "online" } : a));
              router.refresh();
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

      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="page-title">Today's Schedule</h1>
          <div className="breadcrumb">
            <span style={{ color: "var(--teal)", fontWeight: 600 }}>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "20px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginRight: "8px" }}>Filter:</span>
          {[
            { id: "all", label: "All Today" },
            { id: "30m", label: "< 30 Min" },
            { id: "1h", label: "< 1 Hr" },
            { id: "1.5h", label: "< 1.5 Hr" },
            { id: "2h", label: "< 2 Hr" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id)}
              className={`btn btn-sm ${filterMode === f.id ? "btn-primary" : "btn-outline"}`}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filterMode !== "all" && (
          <button 
            className="btn btn-outline" 
            onClick={handleSendReminders} 
            disabled={sending || filteredAppointments.length === 0}
            style={{ color: "var(--amber)", borderColor: "var(--amber)" }}
          >
            {sending ? <span className="spinner"></span> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "4px"}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>}
            Send Reminders to Filtered ({filteredAppointments.length})
          </button>
        )}
      </div>

      <div className="card">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="empty-state-title">No appointments found</div>
            <div className="empty-state-desc">Try changing your time filter or check back later.</div>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Doctor / Dept</th>
                  <th>Payment</th>
                  <th>Source</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => {
                  const mins = getMinutesUntil(appt.appointment_time);
                  const isSoon = mins >= 0 && mins <= 45;
                  const isLate = mins < 0;

                  return (
                    <tr key={appt.id} style={{ background: isSoon ? "rgba(245, 158, 11, 0.05)" : "transparent" }}>
                      <td data-label="Time">
                        <span style={{
                          fontWeight: 700, fontSize: "16px",
                          color: isLate ? "var(--red)" : "var(--teal)",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {appt.appointment_time}
                        </span>
                        {isSoon && <div style={{ fontSize: "11px", color: "var(--amber)", fontWeight: 600, marginTop: "2px" }}>In {mins} mins</div>}
                        {isLate && <div style={{ fontSize: "11px", color: "var(--red)", fontWeight: 600, marginTop: "2px" }}>Overdue</div>}
                      </td>
                      <td data-label="Patient">
                        <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "14px" }}>
                          {appt.patient_name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {appt.patient_phone}
                        </div>
                      </td>
                      <td data-label="Doctor / Dept">
                        <div style={{ fontSize: "13.5px", fontWeight: 500 }}>{appt.doctors?.name || "—"}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{appt.doctors?.departments?.name || "—"}</div>
                      </td>
                      <td data-label="Payment">
                        {appt.payment_status === "paid" ? (
                          <span className="badge badge-green">Paid</span>
                        ) : (
                          <span className="badge badge-amber">At Hospital</span>
                        )}
                      </td>
                      <td data-label="Source">
                        <span className={`badge ${appt.source === "whatsapp" ? "badge-green" : appt.source === "website_lead" ? "badge-blue" : "badge-gray"}`}>
                          {appt.source === "whatsapp" ? "WhatsApp" : appt.source === "website_lead" ? "Website" : "Manual"}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap" }}>
                          {appt.payment_status !== "paid" && (
                            <button 
                              className="btn btn-sm btn-outline" 
                              onClick={() => setPaymentModal({ open: true, appointment_id: appt.id, amount: appt.amount || 300, note: "" })}
                              style={{ color: "var(--teal)", borderColor: "var(--teal)", padding: "4px 8px" }}
                            >
                              Mark Paid
                            </button>
                          )}
                          <select 
                            className="form-control" 
                            style={{ padding: "4px 24px 4px 8px", fontSize: "12px", height: "auto", width: "auto", display: "inline-block" }}
                            value={appt.status || "confirmed"}
                            onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                          >
                            <option value="confirmed">Waiting</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Not Attended</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
