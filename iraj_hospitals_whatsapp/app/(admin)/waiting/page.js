"use client";

import { useState, useEffect } from "react";

function ErrorTypeBadge({ type }) {
  const map = {
    whatsapp_api_failure: { cls: "badge-red",   label: "WhatsApp Failure" },
    llm_api_failure:      { cls: "badge-amber",  label: "AI Failure" },
    conversation_error:   { cls: "badge-amber",  label: "Conversation Error" },
    payment_error:        { cls: "badge-red",    label: "Payment Error" },
  };
  const s = map[type] || { cls: "badge-gray", label: type };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

function ConvStatusBadge({ status }) {
  const map = {
    error:             { cls: "badge-red",   label: "Error" },
    waiting_onboarding:{ cls: "badge-amber",  label: "Waiting" },
    active:            { cls: "badge-teal",   label: "● Active" },
  };
  const s = map[status] || { cls: "badge-gray", label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export default function WaitingPage() {
  const [activeTab, setActiveTab] = useState("errors");
  const [errorLogs, setErrorLogs] = useState([]);
  const [stuckConvs, setStuckConvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const [errRes, convRes] = await Promise.all([
        window.fetch("/api/admin/errors?resolved=false"),
        window.fetch("/api/admin/conversations?status=error,waiting_onboarding"),
      ]);
      if (errRes.ok) setErrorLogs((await errRes.json()).errors || []);
      if (convRes.ok) setStuckConvs((await convRes.json()).conversations || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const resolveError = async (id) => {
    setResolving(id);
    await window.fetch(`/api/admin/errors/${id}/resolve`, { method: "POST" });
    setResolving(null);
    fetch();
  };

  const resetConversation = async (phone) => {
    if (!confirm(`Reset conversation for ${phone}? This will mark them as 'active' again.`)) return;
    await window.fetch("/api/admin/conversations/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_phone: phone }),
    });
    fetch();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Waiting / Errors</h1>
          <div className="breadcrumb">Stalled conversations &amp; API failures that need manual attention</div>
        </div>
        <button className="btn btn-outline" onClick={fetch}>↻ Refresh</button>
      </div>

      {/* Summary banner */}
      {(errorLogs.length + stuckConvs.length) === 0 && !loading && (
        <div
          style={{
            padding: "20px 24px", borderRadius: "var(--radius-lg)",
            background: "var(--green-bg)", border: "1px solid #BBF7D0",
            display: "flex", alignItems: "center", gap: "14px",
            marginBottom: "20px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <div>
            <div style={{ fontWeight: 700, color: "var(--green)", fontSize: "16px" }}>All clear!</div>
            <div style={{ fontSize: "13px", color: "var(--green)", opacity: 0.8 }}>No pending errors or stuck conversations.</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab-item${activeTab === "errors" ? " active" : ""}`} onClick={() => setActiveTab("errors")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "6px"}}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> API Errors {errorLogs.length > 0 && <span className="badge badge-red" style={{ marginLeft: 6 }}>{errorLogs.length}</span>}
        </button>
        <button className={`tab-item${activeTab === "conversations" ? " active" : ""}`} onClick={() => setActiveTab("conversations")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "6px"}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> Stuck Conversations {stuckConvs.length > 0 && <span className="badge badge-amber" style={{ marginLeft: 6 }}>{stuckConvs.length}</span>}
        </button>
      </div>

      {/* Error Logs Tab */}
      {activeTab === "errors" && (
        <div className="card">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
              <div className="spinner" style={{ width: 28, height: 28 }}></div>
            </div>
          ) : errorLogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <div className="empty-state-title">No unresolved errors</div>
              <div className="empty-state-desc">WhatsApp &amp; AI API errors will appear here when they occur.</div>
            </div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Patient Phone</th>
                    <th>Details</th>
                    <th>When</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {errorLogs.map((err) => (
                    <tr key={err.id}>
                      <td data-label="Type"><ErrorTypeBadge type={err.type} /></td>
                      <td data-label="Patient Phone">
                        <a
                          href={`https://wa.me/${err.patient_phone?.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#25D366", fontWeight: 600, fontSize: "13.5px" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "4px", verticalAlign: "middle"}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          {err.patient_phone}
                        </a>
                      </td>
                      <td data-label="Details" style={{ fontSize: "12.5px", color: "var(--text-muted)", maxWidth: "320px" }}>
                        {err.details}
                      </td>
                      <td data-label="When" style={{ fontSize: "12.5px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(err.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }) }
                      </td>
                      <td data-label="Action">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => resolveError(err.id)}
                          disabled={resolving === err.id}
                        >
                          {resolving === err.id ? "..." : "Resolve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Stuck Conversations Tab */}
      {activeTab === "conversations" && (
        <div className="card">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
              <div className="spinner" style={{ width: 28, height: 28 }}></div>
            </div>
          ) : stuckConvs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></div>
              <div className="empty-state-title">No stuck conversations</div>
              <div className="empty-state-desc">Patient conversations with errors or waiting status will appear here.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px" }}>
              {stuckConvs.map((conv) => (
                <div
                  key={conv.patient_phone}
                  style={{
                    padding: "14px 16px", borderRadius: "10px",
                    background: conv.status === "error" ? "#FFF1F2" : "#FFFBEB",
                    border: `1px solid ${conv.status === "error" ? "#FECACA" : "#FDE68A"}`,
                    display: "flex", alignItems: "center", gap: "14px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <ConvStatusBadge status={conv.status} />
                      <span style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--text-heading)" }}>
                        {conv.known_facts?.name || "Unknown Patient"}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      <a
                        href={`https://wa.me/${conv.patient_phone?.replace(/\D/g,"")}`}
                        target="_blank" rel="noreferrer"
                        style={{ color: "#25D366", fontWeight: 600 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "4px", verticalAlign: "middle"}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        {conv.patient_phone}
                      </a>
                      {conv.last_error && (
                        <span style={{ marginLeft: 8, color: "var(--red)", fontSize: "12px" }}>
                          — {conv.last_error}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-xmuted)", marginTop: "3px" }}>
                      Last active: {new Date(conv.updated_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <a
                      href={`https://wa.me/${conv.patient_phone?.replace(/\D/g,"")}`}
                      target="_blank" rel="noreferrer"
                      className="btn btn-sm"
                      style={{ background: "#DCF8C6", color: "#075E54" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "4px"}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> Follow Up
                    </a>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => resetConversation(conv.patient_phone)}
                    >
                      ↺ Reset Bot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
