"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GoogleSetupModal from "./GoogleSetupModal";

export default function GoogleSignInButton({
  redirectPath = "/",
  buttonText = "Continue with Google",
  subText = "",
  className = "",
  size = "md",
  showSetupHelper = true,
  onSuccess,
}) {
  const { signInWithGoogle, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await signInWithGoogle(redirectPath);

      if (error) {
        // If Supabase Google OAuth provider is not yet enabled in the Supabase Dashboard
        if (
          error.message?.includes("provider is not enabled") ||
          error.message?.includes("OAuth") ||
          error.message?.includes("unsupported_provider") ||
          error.status === 400
        ) {
          setShowSetupModal(true);
        } else {
          setErrorMessage(error.message || "Could not sign in with Google. Please try again.");
        }
      } else if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.warn("Google sign-in exception:", err);
      setShowSetupModal(true);
    } finally {
      setLoading(false);
    }
  };

  const isSmall = size === "sm";
  const isLarge = size === "lg";

  return (
    <>
      <div className={`google-signin-wrapper w-100 ${className}`}>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || authLoading}
          className="btn w-100 d-inline-flex align-items-center justify-content-center gap-3 rounded-3 shadow-sm border position-relative transition-all"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#1F2937",
            borderColor: "#D1D5DB",
            fontWeight: "600",
            fontSize: isSmall ? "13.5px" : isLarge ? "16px" : "15px",
            padding: isSmall ? "9px 16px" : isLarge ? "14px 24px" : "12px 20px",
            minHeight: isSmall ? "42px" : isLarge ? "52px" : "48px",
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F9FAFB";
            e.currentTarget.style.borderColor = "#9CA3AF";
            e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
            e.currentTarget.style.borderColor = "#D1D5DB";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
          }}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm text-primary"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            /* Official Google "G" SVG Icon */
            <svg
              width={isSmall ? "18" : "22"}
              height={isSmall ? "18" : "22"}
              viewBox="0 0 24 24"
              className="flex-shrink-0"
            >
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
          )}

          <span>{loading ? "Connecting to Google..." : buttonText}</span>
        </button>

        {subText && (
          <p className="text-muted text-center small mt-1 mb-0" style={{ fontSize: "12px" }}>
            {subText}
          </p>
        )}

        {errorMessage && (
          <div className="alert alert-warning py-2 px-3 small rounded-3 mt-2 mb-0 d-flex align-items-center">
            <i className="fa-solid fa-triangle-exclamation me-2"></i>
            <div>{errorMessage}</div>
          </div>
        )}

        {showSetupHelper && (
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="btn btn-link text-decoration-none p-0 text-muted"
              style={{ fontSize: "11.5px" }}
            >
              <i className="fa-solid fa-circle-question me-1 text-success"></i>
              How does Google Login work?
            </button>
          </div>
        )}
      </div>

      {/* Google Setup and Instant Simulation Modal */}
      {showSetupModal && (
        <GoogleSetupModal
          redirectPath={redirectPath}
          onClose={() => setShowSetupModal(false)}
        />
      )}
    </>
  );
}
