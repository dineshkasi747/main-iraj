"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { doctorsData } from "@/data/doctorsData";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function OurTeamPage() {
  const { user, profile, loading } = useAuth();
  const [showLoginPromptModal, setShowLoginPromptModal] = useState(false);
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLockedClick = (doctorName) => {
    setSelectedDoctorName(doctorName);
    setShowLoginPromptModal(true);
  };

  // Get unique list of departments for filter pills
  const departments = useMemo(() => {
    const depts = new Set(doctorsData.map((d) => d.department));
    return ["All", ...Array.from(depts)];
  }, []);

  // Filtered doctors based on department and search term
  const filteredDoctors = useMemo(() => {
    return doctorsData.filter((doc) => {
      const matchesDept = selectedDept === "All" || doc.department === selectedDept;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        doc.role.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        doc.department.toLowerCase().includes(query) ||
        (doc.qualification && doc.qualification.toLowerCase().includes(query)) ||
        (doc.registrationNumber && doc.registrationNumber.toLowerCase().includes(query));
      return matchesDept && matchesSearch;
    });
  }, [selectedDept, searchQuery]);

  return (
    <>
      <PageHeader
        title="Our Doctors & Medical Team"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Doctors" },
        ]}
      />

      {/* Main Doctors Section */}
      <div className="meet-our-team our-team py-5">
        <div className="container">
          {/* Top of Page Status Gate */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !user ? (
            /* Locked Gate Banner - Right at Page Starting */
            <div
              className="locked-page-start-gate p-4 p-md-5 rounded-4 text-center mb-5 shadow-sm"
              style={{
                backgroundColor: "#F4FAF8",
                border: "2px dashed #38D39F",
              }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "68px",
                  height: "68px",
                  backgroundColor: "rgba(7, 51, 47, 0.1)",
                  color: "#07332F",
                  fontSize: "28px",
                }}
              >
                <i className="fa-solid fa-lock"></i>
              </div>

              <h2 className="fw-bold mb-2" style={{ color: "#07332F", fontSize: "26px" }}>
                Please Log In First to View Our Doctors &amp; Clinical Team
              </h2>

              <p className="text-muted mx-auto mb-4" style={{ maxWidth: "620px", fontSize: "15px", lineHeight: "1.7" }}>
                For patient privacy and clinical verification, access to our full specialist directory, doctors&apos; credentials, surgical experience, and consultation booking is reserved for logged in users.
              </p>

              {/* Action Buttons at Page Start */}
              <div className="d-flex flex-column align-items-center gap-3 mx-auto" style={{ maxWidth: "380px" }}>
                <GoogleSignInButton
                  redirectPath="/our-team"
                  buttonText="Sign In with Google to Unlock"
                  size="md"
                />

                <div className="d-flex align-items-center w-100 my-1">
                  <hr className="flex-grow-1 my-0" />
                  <span className="px-2 text-muted small" style={{ fontSize: "11px" }}>OR</span>
                  <hr className="flex-grow-1 my-0" />
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-2 w-100">
                  <Link
                    href="/login?redirect=/our-team"
                    className="btn btn-sm btn-outline-dark py-2 px-3 fw-semibold flex-grow-1 rounded-pill"
                    style={{ fontSize: "13px" }}
                  >
                    <i className="fa-solid fa-envelope me-1"></i> Sign In with Email
                  </Link>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-inline-flex align-items-center gap-2 text-secondary small">
                <i className="fa-solid fa-shield-halved text-success"></i>
                <span>Fast &amp; secure 1-click access with Google &amp; verified WhatsApp</span>
              </div>
            </div>
          ) : (
            /* Logged In Unlocked Welcome Banner */
            <div
              className="unlocked-welcome-banner p-3 p-md-4 rounded-4 mb-5 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
              style={{
                backgroundColor: "#EAF6F0",
                border: "1px solid #BDE2D0",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#38D39F",
                    color: "#07332F",
                    fontSize: "20px",
                  }}
                >
                  <i className="fa-solid fa-lock-open"></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold" style={{ color: "#07332F" }}>
                    Welcome, {profile?.full_name || user.email}
                  </h5>
                  <p className="text-success small mb-0 fw-semibold">
                    <i className="fa-solid fa-circle-check me-1"></i> Full Clinical Team Directory Unlocked ({doctorsData.length} Specialists)
                  </p>
                </div>
              </div>

              <Link
                href="/appointment"
                className="btn btn-sm btn-success fw-bold px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
              >
                <i className="fa-solid fa-calendar-check"></i> Book Consultation
              </Link>
            </div>
          )}

          {/* Section Header */}
          <div className="row section-row text-center mb-4">
            <div className="col-lg-8 mx-auto">
              <div className="section-title">
                <h3 className="wow fadeInUp" style={{ color: "var(--accent-color, #F7A582)", textTransform: "uppercase" }}>
                  EXPERIENCED &amp; EMPATHETIC
                </h3>
                <h2 className="text-anime-style-3">Meet Our Medical Specialists</h2>
                <p className="text-muted mt-2 wow fadeInUp">
                  Our hospital features 33+ highly qualified specialists across 16 clinical departments in Gajuwaka, bringing super-specialist expertise, advanced surgical precision, and dedicated patient care.
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="row g-3 align-items-center justify-content-between mb-4 pb-2">
            <div className="col-lg-5 col-md-6">
              <div className="input-group shadow-sm rounded-pill overflow-hidden border">
                <span className="input-group-text bg-white border-0 ps-3 text-muted">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-2 ps-2 shadow-none"
                  placeholder="Search doctor name, specialty, or qualification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: "14px" }}
                />
                {searchQuery && (
                  <button
                    className="btn btn-link text-muted pe-3 text-decoration-none"
                    onClick={() => setSearchQuery("")}
                    type="button"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-lg-7 col-md-6 text-md-end text-muted small">
              Showing <strong>{filteredDoctors.length}</strong> of <strong>{doctorsData.length}</strong> Specialists
            </div>

            {/* Department Filter Pills */}
            <div className="col-12">
              <div className="d-flex flex-wrap gap-2 pt-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                      selectedDept === dept
                        ? "btn-dark text-white shadow-sm"
                        : "btn-outline-secondary bg-white text-secondary"
                    }`}
                    style={{ fontSize: "13px" }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* No Doctors Found Fallback */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-5 bg-white rounded-4 border shadow-sm my-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#F7FAF9",
                  color: "#6c757d",
                  fontSize: "22px",
                }}
              >
                <i className="fa-solid fa-user-doctor"></i>
              </div>
              <h5 className="fw-bold text-dark mb-1">No specialists match your search</h5>
              <p className="text-muted small mb-3">Try adjusting your keyword or reset the department filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("All");
                  setSearchQuery("");
                }}
                className="btn btn-sm btn-outline-dark rounded-pill px-4"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Doctors Grid */}
          <div className="row g-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="col-lg-4 col-md-6">
                <div
                  className="team-member-item h-100 rounded-4 overflow-hidden position-relative shadow-sm d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2ECE9",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <div>
                    {/* Doctor Image & Lock Overlay if !user */}
                    <div className="team-image position-relative overflow-hidden" style={{ minHeight: "260px" }}>
                      <figure className="image-anime mb-0">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          style={{
                            width: "100%",
                            height: "280px",
                            objectFit: "cover",
                            filter: !user ? "blur(2px) grayscale(30%)" : "none",
                            transition: "filter 0.3s ease",
                          }}
                        />
                      </figure>

                      {/* Locked Badge Overlay for Unauthenticated Users */}
                      {!user && (
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3 text-center"
                          style={{
                            backgroundColor: "rgba(7, 51, 47, 0.45)",
                            backdropFilter: "blur(1px)",
                            cursor: "pointer",
                          }}
                          onClick={() => handleLockedClick(doctor.name)}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: "#F7A582",
                              color: "#07332F",
                              fontSize: "20px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                          >
                            <i className="fa-solid fa-lock"></i>
                          </div>
                          <span className="badge bg-dark text-white px-3 py-2 rounded-pill fw-semibold shadow-sm mb-1">
                            Locked Profile
                          </span>
                          <small className="text-white fw-bold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                            Click to Log In &amp; View
                          </small>
                        </div>
                      )}

                      {/* Team Social List if user is logged in */}
                      {user && (
                        <div className="team-social-list">
                          <ul>
                            <li>
                              <a href="https://www.instagram.com/irajhospitals/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                              </a>
                            </li>
                            <li>
                              <a href={`https://wa.me/919801081080?text=Hello%20IRAJ%20Hospitals,%20I%20would%20like%20to%20consult%20with%20${encodeURIComponent(doctor.name)}`} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                                <i className="fa-brands fa-whatsapp"></i>
                              </a>
                            </li>
                            <li>
                              <a href="https://www.facebook.com/profile.php?id=61581884108145" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                                <i className="fa-brands fa-facebook-f"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Doctor Body */}
                    <div className="team-body p-4">
                      <div className="team-content">
                        <div className="d-flex align-items-center justify-content-between mb-1 gap-2 flex-wrap">
                          <span
                            className="badge px-2 py-1 rounded-pill small text-truncate"
                            style={{
                              backgroundColor: "rgba(56, 211, 159, 0.15)",
                              color: "#07332F",
                              fontWeight: "600",
                              maxWidth: "70%",
                            }}
                            title={doctor.department}
                          >
                            {doctor.role}
                          </span>
                          {!user ? (
                            <span className="badge bg-warning text-dark small">
                              <i className="fa-solid fa-lock me-1"></i> Locked
                            </span>
                          ) : (
                            <span className="badge bg-success small">
                              <i className="fa-solid fa-check me-1"></i> Verified
                            </span>
                          )}
                        </div>

                        <h3 className="fw-bold mt-2 mb-1" style={{ fontSize: "19px" }}>
                          {user ? (
                            <Link href={`/our-team/${doctor.slug}`} className="text-dark text-decoration-none">
                              {doctor.name}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleLockedClick(doctor.name)}
                              className="text-dark border-0 bg-transparent p-0 fw-bold text-start"
                              style={{ cursor: "pointer", fontSize: "19px" }}
                            >
                              {doctor.name} <i className="fa-solid fa-lock ms-1 text-muted" style={{ fontSize: "13px" }}></i>
                            </button>
                          )}
                        </h3>

                        <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                          <i className="fa-solid fa-hospital text-primary" style={{ fontSize: "11px" }}></i>
                          <span className="text-truncate">{doctor.department}</span>
                        </div>

                        {user && doctor.qualification && (
                          <div className="mb-2 p-2 rounded-2 bg-light border small text-secondary" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <strong>Degree:</strong> {doctor.qualification}
                          </div>
                        )}

                        {user && doctor.registrationNumber && (
                          <div className="mb-2 text-muted small" style={{ fontSize: "11px" }}>
                            <span className="badge bg-light text-secondary border">Reg: {doctor.registrationNumber}</span>
                          </div>
                        )}

                        <p className="text-muted small mb-3" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                          {user ? doctor.bio : "Detailed medical background, consultation schedule, and credentials locked. Please log in to view."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Footer Actions */}
                  <div className="p-4 pt-0">
                    {user ? (
                      <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                        <Link
                          href={`/our-team/${doctor.slug}`}
                          className="text-primary fw-semibold small text-decoration-none d-inline-flex align-items-center gap-1"
                        >
                          <span>Full Profile</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                        <Link
                          href="/appointment"
                          className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-bold"
                        >
                          <i className="fa-solid fa-calendar-check me-1"></i> Book OPD
                        </Link>
                      </div>
                    ) : (
                      <div className="pt-2 border-top">
                        <button
                          type="button"
                          onClick={() => handleLockedClick(doctor.name)}
                          className="btn btn-sm w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                          style={{
                            backgroundColor: "#F7A582",
                            color: "#07332F",
                            border: "none",
                            padding: "8px 14px",
                            fontSize: "12px",
                          }}
                        >
                          <i className="fa-solid fa-lock"></i> Please Login to View Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Login Prompt Modal when user clicks locked doctor */}
      {showLoginPromptModal && (
        <div
          className="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setShowLoginPromptModal(false)}
        >
          <div
            className="modal-card bg-white p-4 p-md-5 rounded-4 shadow-lg text-center position-relative"
            style={{ maxWidth: "480px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={() => setShowLoginPromptModal(false)}
              aria-label="Close"
            ></button>

            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "rgba(247, 165, 130, 0.2)",
                color: "#07332F",
                fontSize: "26px",
              }}
            >
              <i className="fa-solid fa-lock"></i>
            </div>

            <h3 className="fw-bold mb-2" style={{ color: "#07332F", fontSize: "22px" }}>
              Please Login First
            </h3>

            <p className="text-muted mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Please login first to see about {selectedDoctorName || "our team"} and view complete medical qualifications, surgery expertise, and consultation booking.
            </p>

            <div className="d-flex flex-column gap-3 mb-2">
              <GoogleSignInButton
                redirectPath="/our-team"
                buttonText="Continue with Google"
                size="md"
              />
              <Link
                href="/login?redirect=/our-team"
                className="btn btn-outline-dark py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-pill"
                style={{ fontSize: "14px" }}
              >
                <i className="fa-solid fa-envelope me-1"></i> Sign In with Email
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
