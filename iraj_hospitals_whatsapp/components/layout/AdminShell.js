"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [now, setNow] = useState("");

  // Live clock
  useEffect(() => {
    const updateClock = () => {
      setNow(new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
        day: "numeric",
        month: "short",
      }));
    };
    updateClock();
    const id = setInterval(updateClock, 30000);
    return () => clearInterval(id);
  }, []);

  // Poll error count (simplified — in production use Supabase realtime)
  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const res = await fetch("/api/admin/error-count");
        if (res.ok) {
          const data = await res.json();
          setErrorCount(data.count || 0);
        }
      } catch (_) {}
    };
    fetchErrors();
    const id = setInterval(fetchErrors, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="admin-shell">
      <Sidebar
        errorCount={errorCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              fontSize: "20px",
            }}
            className="mobile-menu-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13.5px", color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              IRAJ Multi-Speciality Hospital <span className="hide-mobile">— WhatsApp Control Panel</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* IST clock */}
            <div
              className="hide-mobile"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", color: "var(--text-muted)",
                padding: "5px 10px",
                background: "var(--bg-page)",
                borderRadius: "6px",
                border: "1px solid var(--border)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span style={{ fontWeight: 600 }}>{now} IST</span>
            </div>

            {/* Hospital WhatsApp link */}
            <a
              href="https://wa.me/919801081080"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px",
                background: "#25D366",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <span className="hide-mobile">WhatsApp</span>
            </a>

            {/* Hospital badge */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "6px 12px",
                background: "rgba(7,51,47,0.06)",
                borderRadius: "8px",
                border: "1px solid rgba(7,51,47,0.1)",
              }}
            >
              <div
                style={{
                  width: "28px", height: "28px",
                  background: "var(--primary)",
                  borderRadius: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", fontWeight: 800, fontSize: "14px",
                }}
              >
                I
              </div>
              <div className="hide-mobile">
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.2 }}>Admin</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>IRAJ Hospitals</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .topbar-name { display: none !important; }
        }
        @media (min-width: 900px) {
          .topbar-wa-text { display: inline !important; }
          .topbar-name { display: block !important; }
        }
      `}</style>
    </div>
  );
}
