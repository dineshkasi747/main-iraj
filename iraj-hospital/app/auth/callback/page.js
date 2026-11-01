"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext !== "/" ? rawNext : "/appointment";
  const [status, setStatus] = useState("Verifying Google credentials...");

  useEffect(() => {
    let timeoutId;

    async function processAuth() {
      try {
        // Exchange code if PKCE code is in searchParams
        const code = searchParams.get("code");
        if (code) {
          setStatus("Exchanging authentication token...");
          await supabase.auth.exchangeCodeForSession(code);
        }

        // Get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        setStatus("Signed in successfully! Redirecting...");
        timeoutId = setTimeout(() => {
          router.replace(next.startsWith("/") ? next : "/appointment");
        }, 400);
      } catch (err) {
        console.warn("OAuth callback handling note:", err.message);
        timeoutId = setTimeout(() => {
          router.replace(next.startsWith("/") ? next : "/appointment");
        }, 600);
      }
    }

    processAuth();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [next, router, searchParams]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4 text-center"
      style={{ backgroundColor: "#F7FAF9" }}
    >
      <div
        className="p-5 rounded-4 bg-white shadow-sm border text-center"
        style={{ maxWidth: "420px", width: "100%", borderColor: "#E2ECE9" }}
      >
        <div
          className="spinner-border text-success mb-3"
          style={{ width: "3.2rem", height: "3.2rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="fw-bold mb-2" style={{ color: "#07332F", fontSize: "20px" }}>
          Authenticating with Google
        </h4>
        <p className="text-muted small mb-0">{status}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4 text-center"
          style={{ backgroundColor: "#F7FAF9" }}
        >
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
