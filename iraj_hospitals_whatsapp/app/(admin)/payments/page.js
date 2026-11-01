"use client";

import { useState, useEffect } from "react";


export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      params.set("t", Date.now()); // cache buster

      const url = `/api/admin/payments?${params.toString()}`;
      const res = await window.fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, dateFrom, dateTo]);

  const handleExport = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    window.open(`/api/admin/payments/export?${params.toString()}`, "_blank");
  };

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.patient_name?.toLowerCase().includes(q) || p.patient_phone?.includes(q) || p.razorpay_payment_id?.toLowerCase().includes(q) || p.razorpay_order_id?.toLowerCase().includes(q);
  });

  const [paymentModal, setPaymentModal] = useState(null);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments Log</h1>
          <div className="breadcrumb">Online transactions &amp; Razorpay payment history</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-outline" onClick={() => {
            const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
            setDateFrom(today);
            setDateTo(today);
          }} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Today
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "6px"}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export CSV
          </button>
          <button className="btn btn-outline" onClick={fetchPayments}>↻ Refresh</button>
        </div>
      </div>

      <div className="filter-bar" style={{ flexWrap: "wrap" }}>
        <input 
          type="text" 
          className={`form-control${search ? " active" : ""}`} 
          placeholder="Search name, phone, or payment ID..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ maxWidth: "250px" }} 
        />
        <select className={statusFilter ? "active" : ""} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Online Payments</option>
          <option value="paid">Paid Successfully</option>
          <option value="pending">Pending Payment</option>
        </select>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>From:</span>
          <input type="date" className={`form-control${dateFrom ? " active" : ""}`} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>To:</span>
          <input type="date" className={`form-control${dateTo ? " active" : ""}`} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        <button className={`btn btn-outline${(dateFrom || dateTo || statusFilter || search) ? " filter-active" : ""}`} onClick={() => { setDateFrom(""); setDateTo(""); setStatusFilter(""); setSearch(""); }}>Clear Filters</button>
      </div>

      <div className="card" style={{ borderRadius: "0 0 var(--radius-lg) var(--radius-lg)" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
            <div className="spinner" style={{ borderColor: "var(--teal)", borderTopColor: "transparent" }}></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></div>
            <div className="empty-state-title">No payment records found</div>
            <div className="empty-state-desc">Transactions will appear here once online payments are initiated.</div>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table table-hover">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Appointment</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment ID</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} onClick={() => setPaymentModal(p)} style={{ cursor: "pointer" }}>
                    <td data-label="Patient">
                      <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "13.5px" }}>
                        {p.patient_name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {p.patient_phone}
                      </div>
                    </td>
                    <td data-label="Appointment">
                      <div style={{ fontSize: "13.5px", fontWeight: 500 }}>{p.appointment_date}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {p.appointment_time} · {p.doctors?.name}
                      </div>
                    </td>
                    <td data-label="Amount">
                      <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-heading)" }}>
                        ₹{p.amount}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span className={`badge ${p.payment_status === "paid" ? "badge-green" : "badge-amber"}`}>
                        {p.payment_status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td data-label="Payment ID">
                      {p.razorpay_payment_id ? (
                        <div style={{ fontSize: "13px", fontFamily: "monospace", color: "var(--teal)", fontWeight: 600 }}>
                          {p.razorpay_payment_id}
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-xmuted)", fontSize: "12px" }}>—</span>
                      )}
                      {p.razorpay_order_id && !p.razorpay_payment_id && (
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          Order: {p.razorpay_order_id.includes("rzp_") ? p.razorpay_order_id.substring(0, 20) + "..." : p.razorpay_order_id}
                        </div>
                      )}
                    </td>
                    <td data-label="Last Updated" style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      {new Date(p.updated_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {paymentModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)" }} onClick={() => setPaymentModal(null)}>
          <div style={{ width: "480px", maxWidth: "100%", background: "var(--bg-page)", height: "100%", display: "flex", flexDirection: "column", boxShadow: "-4px 0 25px rgba(0,0,0,0.15)", animation: "slideIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px", background: "var(--bg-card)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Payment Details</h3>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Appointment ID: {paymentModal.id}</div>
              </div>
              <button onClick={() => setPaymentModal(null)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "var(--text-muted)" }}>×</button>
            </div>
            
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              <div className="card" style={{ padding: "20px", marginBottom: "20px", background: "#f8f9fa", border: "1px solid #e9ecef" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Status</span>
                  <span className={`badge ${paymentModal.payment_status === "paid" ? "badge-green" : "badge-amber"}`} style={{ fontSize: "14px", padding: "6px 12px" }}>
                    {paymentModal.payment_status === "paid" ? "Paid Successfully" : "Pending"}
                  </span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Amount</span>
                  <span style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-heading)" }}>₹{paymentModal.amount}</span>
                </div>

                <hr style={{ margin: "16px 0", borderColor: "#e9ecef" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Razorpay Payment ID</label>
                    <div style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold" }}>{paymentModal.razorpay_payment_id || "Not generated yet"}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Razorpay Order ID</label>
                    <div style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold" }}>{paymentModal.razorpay_order_id || "Not generated yet"}</div>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: "15px", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>Patient & Appointment Info</h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Patient Name</label>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{paymentModal.patient_name}</div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Patient Phone</label>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>
                    <a href={`https://wa.me/${paymentModal.patient_phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={{ color: "var(--teal)" }}>
                      {paymentModal.patient_phone}
                    </a>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Doctor</label>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{paymentModal.doctors?.name || "N/A"}</div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Scheduled For</label>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{paymentModal.appointment_date} at {paymentModal.appointment_time}</div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Created At</label>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{new Date(paymentModal.created_at).toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
