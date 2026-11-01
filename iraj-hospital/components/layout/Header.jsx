"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/useScroll";
import { useAuth } from "@/context/AuthContext";
import TopTickerBar from "./TopTickerBar";

export default function Header() {
  const pathname = usePathname();
  const { isScrolled } = useScroll(100);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { user, profile, signOut } = useAuth();

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="main-header">
      {/* Top Announcement Marquee Ticker */}
      <TopTickerBar />

      <div className={`header-sticky ${isScrolled ? "active" : ""}`}>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid px-xl-5 px-lg-4 px-3 d-flex align-items-center justify-content-between flex-nowrap">
            {/* Logo Start */}
            <div className="header-logo flex-shrink-0">
              <Link
                className="navbar-brand d-inline-flex align-items-center"
                href="/"
                style={{ textDecoration: "none" }}
              >
                <img
                  src="/images/iraj-logo-full.png"
                  alt="IRAJ Hospitals"
                  className="header-brand-logo-img"
                />
              </Link>
            </div>
            {/* Logo End */}

            {/* Main Menu Start */}
            <div
              className={`collapse navbar-collapse main-menu ${
                mobileNavOpen ? "show" : ""
              }`}
            >
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        pathname === "/" ? "active" : ""
                      }`}
                      href="/"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        pathname === "/about" ? "active" : ""
                      }`}
                      href="/about"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        pathname === "/services" ? "active" : ""
                      }`}
                      href="/services"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Services
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        pathname === "/our-team" ? "active" : ""
                      }`}
                      href="/our-team"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Doctors
                    </Link>
                  </li>
                  <li className="nav-item submenu">
                    <Link className="nav-link" href="#">
                      Pages
                    </Link>
                    <ul>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          href="/services/pathology-clinic"
                          onClick={() => setMobileNavOpen(false)}
                        >
                          Service Single
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          href="/blog"
                          onClick={() => setMobileNavOpen(false)}
                        >
                          Blog
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          href="/blog/best-medical-network-directory"
                          onClick={() => setMobileNavOpen(false)}
                        >
                          Blog Single
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          href="/faq"
                          onClick={() => setMobileNavOpen(false)}
                        >
                          FAQs
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          href="/not-found"
                          onClick={() => setMobileNavOpen(false)}
                        >
                          404
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        pathname === "/contact" ? "active" : ""
                      }`}
                      href="/contact"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </li>

                  {/* Auth / Patient Account Section */}
                  {user ? (
                    <li className="nav-item position-relative ms-lg-2" ref={userMenuRef}>
                      <button
                        type="button"
                        className="patient-profile-btn border-0"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        aria-expanded={userMenuOpen}
                      >
                        <i
                          className="fa-solid fa-circle-user text-accent"
                          style={{ color: "var(--accent-color, #F7A582)", fontSize: "17px" }}
                        ></i>
                        <span>
                          {profile?.full_name?.split(" ")[0] || "Patient"}
                        </span>
                        <i
                          className={`fa-solid fa-chevron-down ms-1 ${
                            userMenuOpen ? "fa-rotate-180" : ""
                          }`}
                          style={{ fontSize: "10px", transition: "transform 0.2s" }}
                        ></i>
                      </button>

                      {userMenuOpen && (
                        <div className="patient-dropdown-menu">
                          <div className="patient-dropdown-header">
                            <small
                              className="text-white-50 d-block"
                              style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}
                            >
                              Patient Account
                            </small>
                            <strong
                              className="d-block text-white text-truncate mt-1"
                              style={{ fontSize: "14px" }}
                            >
                              {profile?.full_name || user.email}
                            </strong>
                            {profile?.phone && (
                              <div
                                className="d-flex align-items-center gap-1 mt-1"
                                style={{ color: "#38D39F", fontSize: "12px", fontWeight: "600" }}
                              >
                                <i className="fa-brands fa-whatsapp"></i> {profile.phone}
                              </div>
                            )}
                          </div>

                          <Link
                            href="/appointment"
                            className="patient-dropdown-item"
                            onClick={() => {
                              setUserMenuOpen(false);
                              setMobileNavOpen(false);
                            }}
                          >
                            <i className="fa-solid fa-calendar-check text-accent" style={{ color: "#F7A582" }}></i>
                            <span>My Appointments</span>
                          </Link>

                          <Link
                            href="/our-team"
                            className="patient-dropdown-item"
                            onClick={() => {
                              setUserMenuOpen(false);
                              setMobileNavOpen(false);
                            }}
                          >
                            <i className="fa-solid fa-user-doctor text-accent" style={{ color: "#F7A582" }}></i>
                            <span>View All Doctors</span>
                          </Link>

                          <button
                            type="button"
                            className="patient-dropdown-item danger border-0 bg-transparent w-100 text-start"
                            onClick={() => {
                              signOut();
                              setUserMenuOpen(false);
                              setMobileNavOpen(false);
                            }}
                          >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </li>
                  ) : (
                    <li className="nav-item ms-lg-1">
                      <Link
                        className={`nav-link ${
                          pathname === "/login" ? "active" : ""
                        }`}
                        href={`/login?redirect=${encodeURIComponent(pathname && pathname !== "/login" ? pathname : "/appointment")}`}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <i className="fa-solid fa-user me-1"></i> Sign In
                      </Link>
                    </li>
                  )}

                  <li className="nav-item highlighted-menu">
                    <Link
                      className="nav-link"
                      href="/appointment"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Book Appointment{" "}
                      <i className="fa-solid fa-calendar-days"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* Main Menu End */}

            {/* Mobile Header Quick Actions: Sign In / Account + Book Appointment */}
            <div className="mobile-header-actions d-flex align-items-center gap-1 gap-sm-2 d-lg-none flex-shrink-0">
              {user ? (
                <Link
                  href="/appointment"
                  className="btn btn-sm d-inline-flex align-items-center justify-content-center text-white"
                  style={{
                    backgroundColor: "rgba(56, 211, 159, 0.2)",
                    border: "1px solid rgba(56, 211, 159, 0.4)",
                    color: "#38D39F",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className="fa-solid fa-circle-user me-1 text-accent" style={{ color: "#F7A582" }}></i>
                  <span>{profile?.full_name?.split(" ")[0] || "Account"}</span>
                </Link>
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname && pathname !== "/login" ? pathname : "/appointment")}`}
                  className="btn btn-sm d-inline-flex align-items-center justify-content-center text-white"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#FFFFFF",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className="fa-solid fa-right-to-bracket me-1 text-accent" style={{ color: "#F7A582" }}></i>
                  <span>Sign In</span>
                </Link>
              )}

              <Link
                href="/appointment"
                className="btn btn-sm fw-bold d-inline-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "var(--accent-color, #F7A582)",
                  color: "#07332F",
                  borderRadius: "999px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <i className="fa-solid fa-calendar-check me-1"></i> Book
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
