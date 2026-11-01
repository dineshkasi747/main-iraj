"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Do not show bottom navigation during initial page loading / preloader state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  // Close peacock menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when peacock menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // If page is still in loading / preloader state, do not render bottom dock
  if (!isReady) return null;

  // Primary bottom dock tabs
  const bottomTabs = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: "fa-solid fa-house",
      isActive: pathname === "/",
    },
    {
      id: "about",
      label: "About",
      href: "/about",
      icon: "fa-solid fa-users",
      isActive: pathname === "/about",
    },
    // Center button sits between tab 2 and 3
    {
      id: "services",
      label: "Services",
      href: "/services",
      icon: "fa-solid fa-stethoscope",
      isActive: pathname.startsWith("/services"),
    },
    {
      id: "contact",
      label: "Contact",
      href: "/contact",
      icon: "fa-solid fa-phone",
      isActive: pathname === "/contact",
    },
  ];

  // 5 Peacock Radial Arc Menu items evenly distributed across the semi-circle fan
  // Span from 152 deg (left) to 28 deg (right) for 100% full visibility on all phone screens
  const peacockItems = [
    {
      id: "our-team",
      label: "Our Team",
      href: "/our-team",
      icon: "fa-solid fa-user-doctor",
      angle: 152,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      href: "/#testimonials",
      icon: "fa-solid fa-star",
      angle: 121,
    },
    {
      id: "blog",
      label: "Blog",
      href: "/blog",
      icon: "fa-solid fa-newspaper",
      angle: 90,
    },
    {
      id: "faq",
      label: "FAQ's",
      href: "/faq",
      icon: "fa-solid fa-circle-question",
      angle: 59,
    },
    {
      id: "gallery",
      label: "Gallery",
      href: "/about#facilities",
      icon: "fa-solid fa-images",
      angle: 28,
    },
  ];

  // Radial radius in pixels - perfectly calibrated for mobile screen widths
  const radius = 142;

  return (
    <>
      {/* =========================================================================
          Peacock Arc Fan Menu & Backdrop Overlay (Mobile only)
          ========================================================================= */}
      <div
        className={`peacock-nav-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      >
        {/* Soft radial glow backdrop */}
        <div className="peacock-glow-sphere"></div>

        {/* Peacock Fan Radial Container */}
        <div
          className="peacock-radial-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* SVG Connector Spoke Lines */}
          <svg className="peacock-spokes-svg" viewBox="-180 -180 360 180">
            <defs>
              <linearGradient
                id="spokeGradient"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#38D39F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F7A582" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {peacockItems.map((item, idx) => {
              const rad = (item.angle * Math.PI) / 180;
              const x = radius * Math.cos(rad);
              const y = -radius * Math.sin(rad);

              return (
                <line
                  key={`spoke-${idx}`}
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  className="peacock-spoke-line"
                  style={{
                    animationDelay: `${idx * 0.04}s`,
                  }}
                />
              );
            })}
          </svg>

          {/* Radial Nodes / Petals */}
          {peacockItems.map((item, idx) => {
            const rad = (item.angle * Math.PI) / 180;
            const x = Math.round(radius * Math.cos(rad));
            const y = Math.round(-radius * Math.sin(rad));

            const style = isOpen
              ? {
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`,
                  opacity: 1,
                  transitionDelay: `${idx * 0.04}s`,
                }
              : {
                  transform: `translate(0px, 0px) translate(-50%, -50%) scale(0.2)`,
                  opacity: 0,
                  transitionDelay: "0s",
                };

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="peacock-arc-item"
                style={style}
                aria-label={item.label}
              >
                <div className="peacock-node-badge">
                  <i className={item.icon}></i>
                </div>
                <span className="peacock-node-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          Bottom Dock Navigation Bar (Always Visible on Mobile)
          ========================================================================= */}
      <nav className="mobile-bottom-dock" aria-label="Mobile Navigation">
        <div className="mobile-dock-inner">
          {/* Tab 1: Home */}
          <Link
            href={bottomTabs[0].href}
            className={`dock-tab-btn ${bottomTabs[0].isActive ? "active" : ""}`}
          >
            <div className="dock-icon-wrapper">
              <i className={bottomTabs[0].icon}></i>
            </div>
            <span className="dock-tab-label">{bottomTabs[0].label}</span>
          </Link>

          {/* Tab 2: About */}
          <Link
            href={bottomTabs[1].href}
            className={`dock-tab-btn ${bottomTabs[1].isActive ? "active" : ""}`}
          >
            <div className="dock-icon-wrapper">
              <i className={bottomTabs[1].icon}></i>
            </div>
            <span className="dock-tab-label">{bottomTabs[1].label}</span>
          </Link>

          {/* Center Elevated Peacock Toggle (+ / X FAB) */}
          <div className="dock-center-fab-anchor">
            <button
              type="button"
              className={`dock-peacock-fab ${isOpen ? "active" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle Peacock Menu"
            >
              <i
                className={`fa-solid ${
                  isOpen ? "fa-xmark" : "fa-plus"
                } fab-icon`}
              ></i>
            </button>
          </div>

          {/* Tab 3: Services */}
          <Link
            href={bottomTabs[2].href}
            className={`dock-tab-btn ${bottomTabs[2].isActive ? "active" : ""}`}
          >
            <div className="dock-icon-wrapper">
              <i className={bottomTabs[2].icon}></i>
            </div>
            <span className="dock-tab-label">{bottomTabs[2].label}</span>
          </Link>

          {/* Tab 4: Contact */}
          <Link
            href={bottomTabs[3].href}
            className={`dock-tab-btn ${bottomTabs[3].isActive ? "active" : ""}`}
          >
            <div className="dock-icon-wrapper">
              <i className={bottomTabs[3].icon}></i>
            </div>
            <span className="dock-tab-label">{bottomTabs[3].label}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
