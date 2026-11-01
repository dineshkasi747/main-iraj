"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/common/PageHeader";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

// Notify WhatsApp backend on login (fire-and-forget)
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
    // Fire-and-forget — don't block login on failure
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams?.get("redirect");
  const redirect = rawRedirect && rawRedirect !== "/" ? rawRedirect : "/appointment";

  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await signIn({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message || "Invalid email or password. Please try again.");
    } else {
      // If patient provided phone number, trigger WhatsApp welcome
      if (formData.phone) {
        const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
        if (cleanPhone.length >= 10) {
          const fullPhone = `+91${cleanPhone}`;
          const name =
            data?.user?.user_metadata?.full_name ||
            data?.user?.user_metadata?.name ||
            formData.email.split("@")[0];
          // Fire-and-forget — don't wait
          sendWhatsAppWelcome({ phone_number: fullPhone, name }).then(() => {
            setWhatsappSent(true);
          });
        }
      }
      router.push(redirect);
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
          Welcome Back
        </h2>
        <p className="text-muted small mb-0">
          Sign in with Google for instant access to appointment booking &amp; doctors.
        </p>
      </div>

      {redirect !== "/" && redirect !== "/appointment" && (
        <div
          className="alert alert-info py-2 px-3 small rounded-3 mb-3 d-flex align-items-center"
          role="alert"
          style={{ backgroundColor: "#E8F4F2", color: "#07332F", borderColor: "#BEE0D8" }}
        >
          <i className="fa-solid fa-lock me-2"></i>
          <div>Sign in to view full doctor qualifications and book your consultation.</div>
        </div>
      )}

      {/* Prominent Google Sign-In */}
      <div className="mb-4">
        <GoogleSignInButton
          redirectPath={redirect}
          buttonText="Sign In with Google"
          subText="Auto-fills your verified details on the booking page"
          size="lg"
          showSetupHelper={true}
        />
      </div>

      {/* Divider */}
      <div className="d-flex align-items-center my-4">
        <hr className="flex-grow-1 my-0" style={{ borderColor: "#E2ECE9" }} />
        <span className="px-3 text-muted small fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
          OR SIGN IN WITH EMAIL
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

      <form onSubmit={handleSubmit}>
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

        {/* Password */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-semibold text-secondary mb-0">
              Password <span className="text-danger">*</span>
            </label>
            <a
              href="https://wa.me/919801081080?text=Hello%20IRAJ%20Hospital,%20I%20need%20help%20resetting%20my%20patient%20account%20password."
              target="_blank"
              rel="noopener noreferrer"
              className="small text-decoration-none text-muted"
              style={{ fontSize: "12px" }}
            >
              Forgot password?
            </a>
          </div>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="Enter your password"
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

        {/* Optional WhatsApp Phone — triggers welcome message */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-semibold text-secondary mb-0">
              WhatsApp Number <span className="text-muted fw-normal">(optional)</span>
            </label>
            <span
              className="badge d-inline-flex align-items-center gap-1"
              style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "11px", padding: "4px 8px", borderRadius: "20px" }}
            >
              <i className="fa-brands fa-whatsapp"></i> Receive Welcome Message
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
              placeholder="98010 81080 (optional)"
              maxLength="10"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ height: "48px" }}
            />
          </div>
          <small className="text-muted" style={{ fontSize: "12px" }}>
            Enter your WhatsApp number to receive a welcome message &amp; stay connected for appointments.
          </small>
        </div>

        {/* Remember Me */}
        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="form-check-label small text-secondary" htmlFor="rememberMe">
            Keep me signed in on this device
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-default w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
          style={{ height: "52px" }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status"></span>
              Signing in...
            </>
          ) : (
            <>
              Sign In with Email <i className="fa-solid fa-arrow-right ms-1"></i>
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="text-center mt-4 pt-3 border-top">
        <p className="text-secondary small mb-0">
          Prefer registering without Google?{" "}
          <Link
            href={`/signup${redirect !== "/appointment" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="fw-bold text-decoration-none"
            style={{ color: "#07332F" }}
          >
            Create email account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <PageHeader
        title="Patient Sign In"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign In" },
        ]}
      />

      <div className="auth-section py-5" style={{ backgroundColor: "#F7FAF9", minHeight: "70vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7 col-12">
              <Suspense
                fallback={
                  <div className="text-center p-5 bg-white rounded-4 shadow-sm border">
                    <div className="spinner-border text-success mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted small mb-0">Loading Sign In...</p>
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
