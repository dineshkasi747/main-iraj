"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GoogleSetupModal({ redirectPath = "/", onClose }) {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState("test"); // 'test' or 'setup'
  const [testName, setTestName] = useState("Ramesh Kumar (Google Account)");
  const [testEmail, setTestEmail] = useState("ramesh.kumar@gmail.com");
  const [testPhone, setTestPhone] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabaseCallbackUrl =
    "https://qfgrgjxsruasgmkfphoy.supabase.co/auth/v1/callback";

  const handleSimulateGoogleLogin = async () => {
    setLoading(true);
    await signInWithGoogle(redirectPath, {
      name: testName.trim() || "Google Verified Patient",
      email: testEmail.trim() || "patient@gmail.com",
      phone: testPhone.trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    });
    setLoading(false);
    if (onClose) onClose();
    router.push(redirectPath);
  };

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(supabaseCallbackUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(7, 51, 47, 0.65)",
        backdropFilter: "blur(5px)",
        zIndex: 1055,
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          {/* Modal Header */}
          <div
            className="modal-header border-0 px-4 pt-4 pb-3"
            style={{ backgroundColor: "#07332F", color: "#FFFFFF" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-white p-2 shadow-sm"
                style={{ width: "42px", height: "42px" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0 text-white" style={{ fontSize: "19px" }}>
                  Google Sign-In &amp; Appointment Autofill
                </h5>
                <span className="text-white-50 small" style={{ fontSize: "12px" }}>
                  One-click Google authentication for IRAJ Hospital patients
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-bottom bg-light px-4 pt-2">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold px-3 py-2 border-0 ${
                    activeTab === "test"
                      ? "active text-dark border-bottom border-3 border-success bg-white"
                      : "text-muted bg-transparent"
                  }`}
                  onClick={() => setActiveTab("test")}
                >
                  <i className="fa-solid fa-bolt text-warning me-1"></i> Instant 1-Click Google Test
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold px-3 py-2 border-0 ${
                    activeTab === "setup"
                      ? "active text-dark border-bottom border-3 border-success bg-white"
                      : "text-muted bg-transparent"
                  }`}
                  onClick={() => setActiveTab("setup")}
                >
                  <i className="fa-solid fa-gear text-primary me-1"></i> Live Production Setup (3 Steps)
                </button>
              </li>
            </ul>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {activeTab === "test" ? (
              <div>
                <div
                  className="alert alert-success d-flex align-items-start gap-2 py-3 px-3 rounded-3 mb-4"
                  style={{ backgroundColor: "#EAF6F0", borderColor: "#BDE2D0", color: "#07332F" }}
                >
                  <i className="fa-solid fa-circle-check fs-5 mt-1 text-success flex-shrink-0"></i>
                  <div className="small">
                    <strong>Try Google Login Right Now!</strong>
                    <p className="mb-0 mt-1" style={{ lineHeight: "1.5" }}>
                      Click below to instantly log in as a Google-verified patient. You will see how your <strong>Name</strong> and <strong>Email</strong> are instantly auto-filled on the <strong>Book Appointment</strong> page, leaving only your WhatsApp phone number to enter!
                    </p>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary mb-1">
                      Google Patient Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      style={{ height: "45px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary mb-1">
                      Google Gmail Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      style={{ height: "45px" }}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-semibold text-secondary mb-1">
                      Phone Number (Optional for test)
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="e.g. 98010 81080"
                      style={{ height: "45px" }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateGoogleLogin}
                  disabled={loading}
                  className="btn btn-default w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ height: "50px" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Sign In with Google (Instant Demo)</span>
                      <i className="fa-solid fa-arrow-right ms-1"></i>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-secondary small mb-3">
                  Follow these 3 simple steps to connect real Google Cloud OAuth credentials to your Supabase project:
                </p>

                {/* Step 1 */}
                <div className="d-flex gap-3 mb-3 p-3 rounded-3 bg-light border">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                    style={{ width: "32px", height: "32px", fontSize: "14px" }}
                  >
                    1
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: "#07332F" }}>
                      Create Google OAuth Client ID
                    </h6>
                    <p className="text-muted small mb-2">
                      Go to Google Cloud Console &rarr; <strong>APIs &amp; Services</strong> &rarr; <strong>Credentials</strong> &rarr; <strong>Create Credentials</strong> &rarr; <strong>OAuth client ID</strong> (Web application).
                    </p>
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary py-1 px-3 rounded-pill fw-semibold"
                      style={{ fontSize: "12px" }}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square me-1"></i> Open Google Cloud Console
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="d-flex gap-3 mb-3 p-3 rounded-3 bg-light border">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                    style={{ width: "32px", height: "32px", fontSize: "14px" }}
                  >
                    2
                  </div>
                  <div className="w-100">
                    <h6 className="fw-bold mb-1" style={{ color: "#07332F" }}>
                      Add Supabase Callback URL
                    </h6>
                    <p className="text-muted small mb-2">
                      In the Google Client ID settings under <strong>Authorized redirect URIs</strong>, paste this URL:
                    </p>
                    <div className="input-group input-group-sm mb-1">
                      <input
                        type="text"
                        readOnly
                        className="form-control bg-white font-monospace"
                        value={supabaseCallbackUrl}
                        style={{ fontSize: "11.5px" }}
                      />
                      <button
                        type="button"
                        onClick={handleCopyCallback}
                        className={`btn ${copiedUrl ? "btn-success" : "btn-dark"}`}
                      >
                        {copiedUrl ? (
                          <>
                            <i className="fa-solid fa-check me-1"></i> Copied
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-copy me-1"></i> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="d-flex gap-3 p-3 rounded-3 bg-light border">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                    style={{ width: "32px", height: "32px", fontSize: "14px" }}
                  >
                    3
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: "#07332F" }}>
                      Paste Keys into Supabase Dashboard
                    </h6>
                    <p className="text-muted small mb-2">
                      Go to Supabase &rarr; <strong>Authentication</strong> &rarr; <strong>Providers</strong> &rarr; <strong>Google</strong> &rarr; Enable Google &amp; paste your <strong>Client ID</strong> and <strong>Client Secret</strong>.
                    </p>
                    <a
                      href="https://supabase.com/dashboard/project/qfgrgjxsruasgmkfphoy/auth/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-success py-1 px-3 rounded-pill fw-semibold"
                      style={{ fontSize: "12px" }}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square me-1"></i> Open Supabase Providers Settings
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-0 bg-light px-4 py-3 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary px-3 rounded-pill"
              onClick={onClose}
            >
              Close
            </button>
            <span className="text-muted small" style={{ fontSize: "12px" }}>
              IRAJ Multi-Speciality Hospitals • Patient Portal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
