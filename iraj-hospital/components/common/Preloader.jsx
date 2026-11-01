"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show preloader on initial load
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className="iraj-loader-overlay"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-out, visibility 0.5s ease-out",
        pointerEvents: fadeOut ? "none" : "auto",
        zIndex: 2147483647,
      }}
    >
      <div className="iraj-loader-lockup iraj-loader-lockup-full">
        {/* Full Official Hospital Logo */}
        <div className="iraj-loader-logo-wrap">
          <img
            src="/images/iraj-logo-full.png"
            alt="IRAJ Hospitals"
            className="iraj-loader-full-img"
          />
        </div>

        {/* Accent Tagline with Animated Glowing Shimmer Lines */}
        <div className="iraj-loader-tagline">
          <div className="iraj-loader-line" />
          <span className="iraj-loader-subtitle">
            THE CARE YOU CAN TRUST
          </span>
          <div className="iraj-loader-line right" />
        </div>
      </div>
    </div>
  );
}
