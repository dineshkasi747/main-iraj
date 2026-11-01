"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function GlobalPhonePrompt() {
  const { user, profile, loading, updateProfile } = useAuth();
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState(false);
//global
  useEffect(() => {
    if (!loading && user && profile) {
      const hasValidPhone = profile.phone && /^\d{10}$/.test(profile.phone.replace(/\D/g, "").slice(-10));
      if (!hasValidPhone) {
        setShow(true);
      } else {
        setShow(false);
      }
    } else {
      setShow(false);
    }
  }, [loading, user, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSaving(true);
    const { error: updateErr } = await updateProfile({ phone: cleanPhone });
    if (updateErr) {
      setError("Failed to save phone number. Please try again.");
      setSaving(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setShow(false);
      }, 2500);
    }
  };

  if (!show) return null;

  if (success) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)", zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#fff", borderRadius: "16px", padding: "40px",
          width: "100%", maxWidth: "400px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          textAlign: "center", animation: "fadeIn 0.3s"
        }}>
          <div style={{ fontSize: "50px", marginBottom: "16px" }}>🎉</div>
          <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#07332F", margin: 0 }}>
            Welcome to IRAJ Hospital!
          </h3>
          <p style={{ color: "#666", fontSize: "15px", marginTop: "12px", marginBottom: 0 }}>
            Thank you for verifying your number. We are redirecting you now...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.8)", zIndex: 99999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#fff", borderRadius: "16px", padding: "30px",
        width: "100%", maxWidth: "400px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📱</div>
          <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#07332F", margin: 0 }}>
            Phone Number Required
          </h3>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px", marginBottom: 0 }}>
            To complete your registration and allow us to send WhatsApp updates, please provide your 10-digit Indian mobile number.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#07332F", marginBottom: "8px" }}>
              Mobile Number
            </label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
              <span style={{ padding: "12px 14px", backgroundColor: "#f8f9fa", borderRight: "1px solid #ddd", color: "#666", fontWeight: "600" }}>
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="e.g. 9801081080"
                style={{ flex: 1, border: "none", padding: "12px", outline: "none", fontSize: "16px" }}
                required
              />
            </div>
            {error && <div style={{ color: "#d9534f", fontSize: "13px", marginTop: "8px", fontWeight: "500" }}>{error}</div>}
          </div>

          <button
            type="submit"
            disabled={saving || phone.length < 10}
            style={{
              width: "100%", padding: "14px", backgroundColor: "#07332F", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600",
              cursor: (saving || phone.length < 10) ? "not-allowed" : "pointer",
              opacity: (saving || phone.length < 10) ? 0.7 : 1,
              transition: "opacity 0.2s"
            }}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
