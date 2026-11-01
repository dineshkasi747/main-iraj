"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function StatusBadge({ status }) {
  const map = {
    confirmed:         { cls: "badge-green",  label: "Confirmed" },
    pending_payment:   { cls: "badge-amber",  label: "Pending Payment" },
    cancelled:         { cls: "badge-red",    label: "Cancelled" },
    completed:         { cls: "badge-gray",   label: "Completed" },
    waiting_onboarding:{ cls: "badge-blue",   label: "Waiting" },
  };
  const s = map[status] || { cls: "badge-gray", label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

function PaymentBadge({ paymentStatus }) {
  const map = {
    paid:         { cls: "badge-green", label: "Paid" },
    pending:      { cls: "badge-amber", label: "Pending" },
    not_required: { cls: "badge-gray",  label: "—" },
  };
  const s = map[paymentStatus] || { cls: "badge-gray", label: paymentStatus };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

function SummaryCard({ icon, bg, value, label, sub, color }) {
  return (
    <div className="summary-card">
      <div className="summary-card-icon" style={{ background: bg }}>
        {icon}
      </div>
      <div>
        <div className="summary-card-value" style={{ color: color || "var(--text-heading)" }}>
          {value}
        </div>
        <div className="summary-card-label">{label}</div>
        {sub && (
          <div className="summary-card-trend text-muted mt-1">{sub}</div>
        )}
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/dashboard-stats?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const { stats, todayAppts, recentConvs, today } = data;

  const formattedDate = new Date(today + "T00:00:00+05:30").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="breadcrumb">
            <span className="realtime-dot"></span>
            <span style={{ marginLeft: "4px" }}>Live · {formattedDate}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-outline" onClick={() => fetchStats(true)} disabled={refreshing}>
            {refreshing ? <span className="spinner"></span> : "↻"} Refresh
          </button>
          <Link href="/appointments" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "4px"}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            All Appointments
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} bg="#EFF6FF" color="#1D4ED8"
          value={stats.todayTotal}
          label="Today's Appointments"
          sub="Total scheduled for today"
        />
        <SummaryCard
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>} bg="#F0FDF4" color="var(--green)"
          value={stats.confirmed}
          label="Confirmed Today"
          sub="Payment done or pay-at-hospital"
        />
        <SummaryCard
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} bg="#FFFBEB" color="var(--amber)"
          value={stats.pending}
          label="Pending Payment"
          sub="Awaiting online payment"
        />
      </div>

      <div className="dashboard-grid">
        {/* Today's Appointments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: "flex", alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 8}}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              Today&apos;s Appointments
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge badge-teal">{todayAppts.length} total</span>
              <Link href="/appointments" className="btn btn-sm btn-outline">View All</Link>
            </div>
          </div>

          {todayAppts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
              </div>
              <div className="empty-state-title">No appointments today</div>
              <div className="empty-state-desc">Appointments booked via WhatsApp or the website will appear here.</div>
            </div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppts.map((appt) => (
                    <tr key={appt.id}>
                      <td data-label="Patient">
                        <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "13.5px" }}>
                          {appt.patient_name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {appt.patient_phone}
                        </div>
                      </td>
                      <td data-label="Doctor" style={{ fontSize: "13.5px" }}>{appt.doctors?.name || "—"}</td>
                      <td data-label="Time">
                        <span style={{
                          fontWeight: 700, fontSize: "14px",
                          color: "var(--teal)",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {appt.appointment_time}
                        </span>
                      </td>
                      <td data-label="Status"><StatusBadge status={appt.status} /></td>
                      <td data-label="Payment"><PaymentBadge paymentStatus={appt.payment_status} /></td>
                      <td data-label="Source">
                        <span className={`badge ${appt.source === "whatsapp" ? "badge-green" : "badge-blue"}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          {appt.source === "whatsapp" ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> WA</> : appt.source === "website_lead" ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> Web</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> Manual</>}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Sidebar: Recent Conversations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Recent Conversations */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title" style={{ display: "flex", alignItems: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 8}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Recent Conversations
              </h2>
              <Link href="/waiting" className="btn btn-sm btn-outline">View All</Link>
            </div>
            <div className="card-body" style={{ padding: "12px" }}>
              {recentConvs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px" }}>
                  No active conversations
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {recentConvs.map((conv) => (
                    <div
                      key={conv.patient_phone}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: conv.status === "error" ? "var(--red-bg)" : "var(--bg-page)",
                        border: `1px solid ${conv.status === "error" ? "#FECACA" : "var(--border)"}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--text-heading)" }}>
                          {conv.known_facts?.name || conv.patient_phone}
                        </span>
                        <span className={`badge ${conv.status === "error" ? "badge-red" : "badge-teal"}`} style={{ fontSize: "10px" }}>
                          {conv.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {conv.patient_phone}
                        <span style={{ marginLeft: "6px" }}>·</span>
                        <span style={{ marginLeft: "6px" }}>
                          {new Date(conv.updated_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title" style={{ display: "flex", alignItems: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 8}}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                Quick Actions
              </h2>
            </div>
            <div className="card-body" style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { href: "/appointments?status=pending_payment", label: "View Pending Payments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>, color: "var(--amber)" },
                { href: "/waiting", label: "Resolve Bot Errors", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>, color: "var(--red)" },
                { href: "/doctors", label: "Manage Doctors", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>, color: "var(--teal)" },
                { href: "/settings", label: "Hospital Settings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, color: "var(--text-muted)" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 12px", borderRadius: "8px",
                    background: "var(--bg-page)", border: "1px solid var(--border)",
                    fontSize: "13.5px", fontWeight: 600,
                    color: item.color,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  {item.label}
                  <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: "12px" }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
