"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/common/PageHeader";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

// Notify WhatsApp backend on signup (fire-and-forget)
async function sendWhatsAppWelcome({ phone_number, name }) {
  const baseUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_HOSPITAL_WEBSITE_API_KEY;
  if (!baseUrl || !phone_number) return;
  try {
    await fetch(`${baseUrl}/api/leads/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      body: JSON.stringify({ phone_number, name }),
    });
  } catch (_) {
    // Fire-and-forget
  }
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams?.get("redirect");
  const redirect = rawRedirect && rawRedirect !== "/" ? rawRedirect : "/appointment";

  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
    whatsappOptIn: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate phone number
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number for WhatsApp appointment updates.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const fullPhoneNumber = `${formData.countryCode} ${cleanPhone}`;

    const { data, error: signUpError } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: fullPhoneNumber,
      whatsappOptIn: formData.whatsappOptIn,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Failed to create account. Please try again.");
    } else {
      // Send WhatsApp welcome message (fire-and-forget)
      if (formData.phone) {
        const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
        if (cleanPhone.length >= 10) {
          sendWhatsAppWelcome({
            phone_number: `+91${cleanPhone}`,
            name: formData.fullName,
          });
        }
      }
      setSuccess(true);
      setTimeout(() => {
        router.push(redirect);
      }, 1500);
    }
  };

  return (
    <div
      className="auth-card p-4 p-md-5 rounded-4 bg-white shadow-sm border"
      style={{ borderColor: "#E2ECE9" }}
    >
      {/* Logo & Header */}
      <div className="text-center mb-4">
        <Link href="/" className="d-inline-block mb-3 text-decoration-none">
          <div
            className="d-inline-flex align-items-center justify-content-center px-4 py-2 rounded-4"
            style={{ backgroundColor: "#07332F", boxShadow: "0 4px 14px rgba(7, 51, 47, 0.15)" }}
          >
            <img
              src="/images/iraj-logo-full.png"
              alt="IRAJ Hospitals"
              style={{ height: "42px", width: "auto" }}
            />
          </div>
        </Link>
        <h2
          className="fw-bold mb-1"
          style={{ color: "#07332F", fontSize: "28px", letterSpacing: "-0.5px" }}
        >
          Quick Patient Access
        </h2>
        <p className="text-muted small mb-0">
          Use Google for instant 1-click access without remembering passwords.
        </p>
      </div>

      {/* Prominent Google Sign-Up Button */}
      <div className="mb-4">
        <GoogleSignInButton
          redirectPath={redirect}
          buttonText="Sign Up with Google (Instant)"
          subText="Auto-creates your patient profile and fills booking details"
          size="lg"
          showSetupHelper={true}
        />
      </div>

      {/* Divider */}
      <div className="d-flex align-items-center my-4">
        <hr className="flex-grow-1 my-0" style={{ borderColor: "#E2ECE9" }} />
        <span className="px-3 text-muted small fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
          OR REGISTER WITH EMAIL
        </span>
        <hr className="flex-grow-1 my-0" style={{ borderColor: "#E2ECE9" }} />
      </div>

      {error && (
        <div
          className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center"
          role="alert"
        >
          <i className="fa-solid fa-circle-exclamation me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div
          className="alert alert-success py-2 px-3 small rounded-3 mb-3 d-flex align-items-center"
          role="alert"
        >
          <i className="fa-solid fa-circle-check me-2"></i>
          <div>
            Registration successful! Redirecting you now...
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label small fw-semibold text-secondary">
            Full Name <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="fa-solid fa-user"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="e.g. Ramesh Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              style={{ height: "48px" }}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label small fw-semibold text-secondary">
            Email Address <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control border-start-0 ps-0"
              placeholder="yourname@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ height: "48px" }}
            />
          </div>
        </div>

        {/* Phone Number (for WhatsApp) */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-semibold text-secondary mb-0">
              Phone Number (WhatsApp) <span className="text-danger">*</span>
            </label>
            <span className="badge bg-success-subtle text-success small d-inline-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
              <i className="fa-brands fa-whatsapp text-success"></i> Instant WhatsApp Updates
            </span>
          </div>
          <div className="input-group">
            <span
              className="input-group-text bg-light border-end-0 fw-semibold text-secondary"
              style={{ fontSize: "14px" }}
            >
              🇮🇳 +91
            </span>
            <input
              type="tel"
              className="form-control border-start-0 ps-2"
              placeholder="98010 81080"
              maxLength="10"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              style={{ height: "48px" }}
            />
          </div>
          <small className="text-muted" style={{ fontSize: "12px" }}>
            We will send your appointment confirmations &amp; reminders to this WhatsApp number.
          </small>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label small fw-semibold text-secondary">
            Password <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{ height: "48px" }}
            />
            <button
              type="button"
              className="input-group-text bg-light border-start-0 text-muted"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label small fw-semibold text-secondary">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="fa-solid fa-shield-halved"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 ps-0"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              style={{ height: "48px" }}
            />
          </div>
        </div>

        {/* WhatsApp Opt-in */}
        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="whatsappOptIn"
            checked={formData.whatsappOptIn}
            onChange={(e) =>
              setFormData({ ...formData, whatsappOptIn: e.target.checked })
            }
          />
          <label className="form-check-label small text-secondary" htmlFor="whatsappOptIn">
            Receive appointment reminders and doctor updates via WhatsApp &amp; SMS
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-default w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
          style={{ height: "52px" }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status"></span>
              Creating Account...
            </>
          ) : (
            <>
              Create Account with Email <i className="fa-solid fa-arrow-right ms-1"></i>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center mt-4 pt-3 border-top">
        <p className="text-secondary small mb-0">
          Already have an account?{" "}
          <Link
            href={`/login${redirect !== "/appointment" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="fw-bold text-decoration-none"
            style={{ color: "#07332F" }}
          >
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <>
      <PageHeader
        title="Patient Registration"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign Up" },
        ]}
      />

      <div className="auth-section py-5" style={{ backgroundColor: "#F7FAF9", minHeight: "70vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-12">
              <Suspense
                fallback={
                  <div className="text-center p-5 bg-white rounded-4 shadow-sm border">
                    <div className="spinner-border text-success mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted small mb-0">Loading Registration...</p>
                  </div>
                }
              >
                <SignupForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
