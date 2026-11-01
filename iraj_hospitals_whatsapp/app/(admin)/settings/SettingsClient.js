"use client";

import { useState } from "react";

function SaveButton({ loading, saved }) {
  return (
    <button className="btn btn-primary" type="submit" disabled={loading} style={{ minWidth: 120 }}>
      {loading ? <><span className="spinner" style={{ width: 16, height: 16, marginRight: 6 }}></span>Saving...</> : saved ? "Saved!" : "Save Changes"}
    </button>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000 }}>
      {type === "success" ? "" : ""} {message}
    </div>
  );
}

export default function SettingsClient({ initialSettings, initialContext, contextId }) {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(initialSettings);
  const [context, setContext] = useState(initialContext);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 3500);
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) showToast("Settings saved successfully!", "success");
      else showToast("Failed to save settings.", "error");
    } catch {
      showToast("Network error.", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveContext = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hospital-context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: context, id: contextId }),
      });
      if (res.ok) showToast("Hospital context saved! AI will use this in all conversations.", "success");
      else showToast("Failed to save context.", "error");
    } catch {
      showToast("Network error.", "error");
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "general",   label: "General" },
    { id: "ai-context",label: "AI Prompt / Context" },
    { id: "alerts",    label: "Contact & Alerts" },
    { id: "env",       label: "Environment Keys" },
  ];

  return (
    <>
      <Toast {...toast} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="breadcrumb">Hospital configuration, fees, AI prompt, and alert contacts</div>
        </div>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button key={t.id} className={`tab-item${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── General Settings ── */}
      {activeTab === "general" && (
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="card-header"><h2 className="card-title">General &amp; Fees</h2></div>
          <form className="card-body" onSubmit={saveSettings}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Default Consultation Fee (₹)</label>
                <input type="number" className="form-control" value={settings.default_appointment_fee || 300}
                  onChange={(e) => setSettings({ ...settings, default_appointment_fee: parseInt(e.target.value) })} min={0} />
                <small style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                  Charged for all appointments unless overridden per doctor.
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Advance Booking Window (days)</label>
                <input type="number" className="form-control" value={settings.booking_window_days || 7}
                  onChange={(e) => setSettings({ ...settings, booking_window_days: parseInt(e.target.value) })} min={1} max={30} />
              </div>
              <div className="form-group">
                <label className="form-label">Reminder Lead Time (hours before appt)</label>
                <input type="number" className="form-control" value={settings.reminder_hours_before || 1}
                  onChange={(e) => setSettings({ ...settings, reminder_hours_before: parseInt(e.target.value) })} min={0} max={24} />
              </div>
              <div className="form-group">
                <label className="form-label">Welcome WhatsApp Template Name</label>
                <input type="text" className="form-control" value={settings.welcome_message_template_name || "hello_world"}
                  onChange={(e) => setSettings({ ...settings, welcome_message_template_name: e.target.value })} />
                <small style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                  Must be an approved Meta template in your WhatsApp Business account.
                </small>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <SaveButton loading={saving} />
            </div>
          </form>
        </div>
      )}

      {/* ── AI Context / Hospital Prompt ── */}
      {activeTab === "ai-context" && (
        <div className="card" style={{ maxWidth: 780 }}>
          <div className="card-header">
            <h2 className="card-title">AI System Prompt — Hospital Context</h2>
          </div>
          <form className="card-body" onSubmit={saveContext}>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "14px" }}>
              This text is given to the Gemini AI at the start of every patient conversation. Include hospital address, timings, services, payment modes, and any specific instructions.
            </p>
            <div
              style={{
                padding: "10px 14px", marginBottom: "12px", borderRadius: "8px",
                background: "var(--teal-light)", border: "1px solid var(--teal)",
                fontSize: "13px", color: "var(--teal)",
              }}
            >
              <strong>Tip:</strong> Be specific about OPD hours, emergency contacts, departments, and anything patients frequently ask about. The AI will use this to answer questions accurately.
            </div>
            <textarea
              className="form-control"
              rows={14}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="IRAJ Multi-Speciality Hospital is located at..."
              style={{ fontFamily: "inherit", fontSize: "14px", lineHeight: "1.6" }}
            />
            <div style={{ marginTop: 14 }}>
              <SaveButton loading={saving} />
            </div>
          </form>
        </div>
      )}

      {/* ── Alerts Settings ── */}
      {activeTab === "alerts" && (
        <div className="card" style={{ maxWidth: 580 }}>
          <div className="card-header"><h2 className="card-title">Contact &amp; Failure Alerts</h2></div>
          <form className="card-body" onSubmit={saveSettings}>
            <div className="form-group">
              <label className="form-label">Hospital Contact Email</label>
              <input type="email" className="form-control" value={settings.hospital_contact_email || ""}
                onChange={(e) => setSettings({ ...settings, hospital_contact_email: e.target.value })}
                placeholder="help@irajhospitals.com" />
              <small style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                WhatsApp API and AI failure alerts are sent to this email.
              </small>
            </div>
            <div className="form-group">
              <label className="form-label">Hospital Contact Phone (WhatsApp)</label>
              <input type="tel" className="form-control" value={settings.hospital_contact_phone || ""}
                onChange={(e) => setSettings({ ...settings, hospital_contact_phone: e.target.value })}
                placeholder="+919801081080" />
            </div>
            <div style={{
              padding: "12px 14px", borderRadius: "8px",
              background: "var(--amber-bg)", border: "1px solid #FDE68A",
              fontSize: "13px", color: "var(--amber)", marginBottom: "14px",
            }}>
              Failure alerts require a configured <strong>RESEND_API_KEY</strong> environment variable. Set it in your Vercel project settings.
            </div>
            <SaveButton loading={saving} />
          </form>
        </div>
      )}

      {/* ── Environment Keys Reference ── */}
      {activeTab === "env" && (
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="card-header"><h2 className="card-title">Required Environment Variables</h2></div>
          <div className="card-body">
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Set these in your <strong>.env.local</strong> (development) or <strong>Vercel project settings</strong> (production). Never commit secrets to git.
            </p>
            {[
              { key: "SUPABASE_URL", desc: "Your Supabase project URL", example: "https://xxxx.supabase.co" },
              { key: "SUPABASE_SERVICE_ROLE_KEY", desc: "Service role key (not anon key)", example: "eyJ..." },
              { key: "WHATSAPP_TOKEN", desc: "WhatsApp Cloud API permanent access token", example: "EAA..." },
              { key: "WHATSAPP_PHONE_NUMBER_ID", desc: "Phone number ID from Meta Business", example: "12345678" },
              { key: "WHATSAPP_VERIFY_TOKEN", desc: "Your custom webhook verify token", example: "iraj_secret_123" },
              { key: "GEMINI_API_KEY", desc: "Google AI Studio API key", example: "AIza..." },
              { key: "RAZORPAY_KEY_ID", desc: "Razorpay Key ID", example: "rzp_live_..." },
              { key: "RAZORPAY_KEY_SECRET", desc: "Razorpay Key Secret", example: "xxxx" },
              { key: "RAZORPAY_WEBHOOK_SECRET", desc: "Razorpay webhook signature secret", example: "xxxx" },
              { key: "HOSPITAL_WEBSITE_API_KEY", desc: "Shared key for hospital website API calls", example: "your_secret_key" },
              { key: "RESEND_API_KEY", desc: "Resend.com API key for email alerts", example: "re_..." },
              { key: "NEXT_PUBLIC_APP_URL", desc: "Your public app URL (for Razorpay callbacks)", example: "https://your-app.vercel.app" },
              { key: "CRON_SECRET", desc: "Authorization secret for cron job endpoint", example: "secure_cron_secret" },
            ].map((env) => (
              <div
                key={env.key}
                style={{
                  display: "flex", flexDirection: "column", gap: "3px",
                  padding: "11px 14px", marginBottom: "8px",
                  borderRadius: "8px", background: "var(--bg-page)", border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <code style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: "var(--teal)" }}>
                    {env.key}
                  </code>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{env.desc}</div>
                <div style={{ fontSize: "11.5px", color: "var(--text-xmuted)", fontFamily: "monospace" }}>
                  Example: <span style={{ color: "var(--text-muted)" }}>{env.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
