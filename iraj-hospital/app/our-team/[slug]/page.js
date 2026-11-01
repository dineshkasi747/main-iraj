"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/common/PageHeader";
import { doctorsData } from "@/data/doctorsData";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function DoctorDetailPage({ params }) {
  const doctorSlug = params?.slug || "dr-daliboina-sekhar";
  const { user, loading } = useAuth();

  // Find doctor from centralized doctorsData
  const matchedDoctor = doctorsData.find((d) => d.slug === doctorSlug);

  const doctor = matchedDoctor || {
    name: doctorSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    role: "General Physician",
    department: "Department of Clinical Medicine",
    image: "/images/team-1.jpg",
    bio: "General medicine, preventive care, chronic disease management, diabetes control, and acute illness support.",
    fullBio: "Dedicated to clinical precision, compassionate bedside manner, and rapid patient recovery at IRAJ Multi-Speciality Hospital in Gajuwaka.",
    experienceYears: 18,
    qualification: "MBBS, MD (Internal Medicine)",
    specialty: "Comprehensive Multi-Speciality Clinical Care",
    registrationNumber: "APMC/FMR Registered",
    awards: [
      { title: "Clinical Healthcare Distinction", year: "2022", org: "Medical Council of India" },
      { title: "Excellence in Patient Care", year: "2020", org: "Visakha Medical Forum" },
    ],
    services: [
      "Specialized Clinical Consultations",
      "Patient Diagnostics & Care Pathways",
      "24/7 Emergency Medical Support",
    ],
    social: {
      instagram: "https://www.instagram.com/irajhospitals/",
      whatsapp: "https://wa.me/919801081080",
      facebook: "https://www.facebook.com/profile.php?id=61581884108145",
    },
  };

  const experienceText = `${doctor.experienceYears || 10}+ Years Experience`;
  
  // Format primary degree for hero badge cleanly so it never overflows mobile screens
  const getBadgeDegree = (qual) => {
    if (!qual) return "MBBS, Specialist";
    // Split on long fellowship/certificate additions for hero pill
    const parts = qual.split(/,\s*(?=Fellowship|Clinical Fellowship|AHSCP|MBA|Diploma in Ortho)/i);
    return parts[0] || qual;
  };

  const heroDegree = getBadgeDegree(doctor.qualification);

  return (
    <>
      {/* Subpage Header Banner with Breadcrumbs & Animations */}
      <PageHeader
        title={doctor.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/our-team" },
          { label: doctor.name },
        ]}
      />

      {/* Doctor Hero Card Section - Sharp Edges */}
      <div className="member-details pt-3 pb-5">
        <div className="container">
          <div
            className="row g-0 align-items-stretch overflow-hidden shadow-sm"
            style={{ backgroundColor: "var(--primary-color, #07332F)", borderRadius: "0px" }}
          >
            {/* Left side Doctor Image */}
            <div className="col-lg-4 col-md-5 position-relative">
              <figure className="image-anime mb-0 h-100" style={{ borderRadius: "0px" }}>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "320px",
                    maxHeight: "440px",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "0px",
                  }}
                />
              </figure>
            </div>

            {/* Right side Doctor Info */}
            <div className="col-lg-8 col-md-7 member-info d-flex flex-column justify-content-center p-3 p-sm-4 p-md-5" style={{ borderRadius: "0px" }}>
              <div className="member-info-content">
                {/* Uppercase Role Subtitle */}
                <h3
                  className="wow fadeInUp text-uppercase fw-semibold mb-2"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "13px",
                    letterSpacing: "2px",
                  }}
                >
                  {doctor.role || "MEDICAL SPECIALIST"}
                </h3>

                {/* Main Doctor Name */}
                <h2
                  className="text-anime-style-3 fw-bold mb-3"
                  style={{
                    color: "var(--accent-color, #F7A582)",
                    fontSize: "clamp(26px, 4vw, 36px)",
                    lineHeight: "1.2",
                    wordBreak: "break-word",
                  }}
                >
                  {doctor.name}
                </h2>

                {/* Short Bio */}
                <div className="member-about-data mb-3 mb-md-4">
                  <p
                    className="wow fadeInUp mb-0"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      maxWidth: "700px",
                    }}
                  >
                    {doctor.bio}
                  </p>
                </div>

                {/* Badges Container - Sharp Edges */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  {/* Qualification Badge */}
                  <span
                    className="badge bg-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm wow fadeInUp text-start"
                    style={{
                      color: "#07332F",
                      fontSize: "12px",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      maxWidth: "100%",
                      lineHeight: "1.4",
                      borderRadius: "0px",
                    }}
                  >
                    <i className="fa-solid fa-user-doctor text-success flex-shrink-0"></i>
                    <span>{heroDegree}</span>
                  </span>

                  {/* Experience Badge */}
                  <span
                    className="badge bg-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm wow fadeInUp"
                    data-wow-delay="0.1s"
                    style={{
                      color: "#07332F",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      borderRadius: "0px",
                    }}
                  >
                    <i className="fa-solid fa-award text-primary flex-shrink-0"></i>
                    <span>{experienceText}</span>
                  </span>
                </div>

                {/* Socials & CTA Row */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2">
                  {/* Social Icons */}
                  <div
                    className="member-social-icon d-flex align-items-center gap-3 wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <a
                      href={doctor.social?.instagram || "https://www.instagram.com/irajhospitals/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover-accent"
                      aria-label="Instagram"
                      style={{ fontSize: "18px", transition: "color 0.2s" }}
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a
                      href={`https://wa.me/919801081080?text=Hello%20IRAJ%20Hospitals,%20I%20would%20like%20to%20consult%20with%20${encodeURIComponent(doctor.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover-accent"
                      aria-label="WhatsApp"
                      style={{ fontSize: "18px", transition: "color 0.2s" }}
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                    </a>
                    <a
                      href={doctor.social?.facebook || "https://www.facebook.com/profile.php?id=61581884108145"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover-accent"
                      aria-label="Facebook"
                      style={{ fontSize: "18px", transition: "color 0.2s" }}
                    >
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </div>

                  {/* Book Consultation Button - Sharp Edges */}
                  <Link
                    href="/appointment"
                    className="btn px-4 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 wow fadeInUp flex-grow-1 flex-sm-grow-0"
                    data-wow-delay="0.3s"
                    style={{
                      border: "1.5px solid var(--accent-color, #F7A582)",
                      color: "var(--accent-color, #F7A582)",
                      backgroundColor: "transparent",
                      fontSize: "13px",
                      borderRadius: "0px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span>Book Consultation</span>
                    <i className="fa-solid fa-calendar-check"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Access Gatekeeper Card for Unauthenticated Users */}
      {!loading && !user ? (
        <div className="doctor-auth-gate py-5" style={{ backgroundColor: "#F7FAF9" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <div
                  className="gate-card p-4 p-md-5 bg-white shadow-sm border text-center wow fadeInUp"
                  style={{ borderColor: "#D5E7E2", borderRadius: "0px" }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "72px",
                      height: "72px",
                      backgroundColor: "rgba(7, 51, 47, 0.08)",
                      color: "#07332F",
                      borderRadius: "0px",
                    }}
                  >
                    <i className="fa-solid fa-lock fs-2"></i>
                  </div>

                  <h3 className="fw-bold mb-2" style={{ color: "#07332F", fontSize: "24px" }}>
                    Sign In to View Full Specialist Profile &amp; Clinical Details
                  </h3>

                  <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "560px" }}>
                    Sign in with Google to view {doctor.name}&apos;s complete surgical qualifications, consultation schedules, registration credentials, and direct OPD slot booking.
                  </p>

                  <div className="d-flex flex-column align-items-center gap-3 mx-auto mb-4" style={{ maxWidth: "380px" }}>
                    <GoogleSignInButton
                      redirectPath={`/our-team/${doctorSlug}`}
                      buttonText="Sign In with Google"
                      size="md"
                    />

                    <div className="d-flex align-items-center w-100 my-1">
                      <hr className="flex-grow-1 my-0" />
                      <span className="px-2 text-muted small" style={{ fontSize: "11px" }}>OR</span>
                      <hr className="flex-grow-1 my-0" />
                    </div>

                    <Link
                      href={`/login?redirect=/our-team/${doctorSlug}`}
                      className="btn btn-sm btn-outline-dark py-2 px-3 fw-semibold w-100"
                      style={{ fontSize: "13px", borderRadius: "0px" }}
                    >
                      <i className="fa-solid fa-envelope me-1"></i> Sign In with Email
                    </Link>
                  </div>

                  <div
                    className="p-3 d-inline-flex align-items-center gap-2 text-secondary small"
                    style={{ backgroundColor: "#F0F6F4", borderRadius: "0px" }}
                  >
                    <i className="fa-brands fa-whatsapp text-success fs-6"></i>
                    <span>
                      WhatsApp appointment tokens &amp; OPD reminders will be sent directly to your phone.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Details for Logged In Patients */
        <div className="member-details-body py-5 mb-5">
          <div className="container">
            {/* Authenticated banner - Sharp Edges */}
            <div
              className="p-3 mb-4 d-flex align-items-center justify-content-between shadow-sm border flex-wrap gap-2 wow fadeInUp"
              style={{ backgroundColor: "#EAF6F0", borderColor: "#BDE2D0", borderRadius: "0px" }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-circle-check text-success fs-5"></i>
                <span className="small text-muted">
                  Logged in as <strong className="text-success">{user?.email}</strong> — Full Doctor Profile &amp; Direct OPD Booking Unlocked
                </span>
              </div>
              <Link
                href="/appointment"
                className="btn btn-sm btn-success px-3 py-1 fw-semibold"
                style={{ borderRadius: "0px" }}
              >
                <i className="fa-solid fa-calendar-check me-1"></i> Book with {doctor.name.split(" ")[0]}
              </Link>
            </div>

            <div className="row g-4">
              <div className="col-lg-7">
                <div
                  className="p-4 p-md-5 bg-white shadow-sm border h-100 wow fadeInUp"
                  style={{ borderRadius: "0px" }}
                >
                  <h3 className="fw-bold mb-3" style={{ color: "#07332F" }}>
                    Clinical Expertise &amp; Background
                  </h3>
                  <p className="text-secondary mb-3" style={{ lineHeight: "1.8" }}>
                    {doctor.fullBio || doctor.bio}
                  </p>
                  <p className="text-secondary" style={{ lineHeight: "1.8" }}>
                    As a key specialist of the <strong>{doctor.department}</strong> at IRAJ Multi-Speciality Hospital in Gajuwaka, {doctor.name} strictly follows NABH safety guidelines, advanced clinical pathways, and evidence-based medicine to ensure accurate diagnosis and rapid recovery.
                  </p>

                  <h4 className="fw-bold mt-4 mb-3" style={{ color: "#07332F" }}>
                    Specialized Procedures &amp; Clinical Services
                  </h4>
                  <ul className="list-unstyled">
                    {doctor.services?.map((svc, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-2 mb-2 text-secondary">
                        <i className="fa-solid fa-circle-check text-success mt-1"></i>
                        <span>{svc}</span>
                      </li>
                    ))}
                  </ul>

                  {doctor.education && doctor.education.length > 0 && (
                    <>
                      <h4 className="fw-bold mt-4 mb-3" style={{ color: "#07332F" }}>
                        Medical Education &amp; Training
                      </h4>
                      <div className="d-flex flex-column gap-2">
                        {doctor.education.map((edu, idx) => (
                          <div key={idx} className="d-flex align-items-center gap-2 text-secondary small">
                            <i className="fa-solid fa-graduation-cap text-primary"></i>
                            <strong>{edu.degree}</strong>
                            <span>— {edu.institution} ({edu.year})</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-5">
                <div
                  className="p-4 p-md-5 bg-white shadow-sm border h-100 d-flex flex-column justify-content-between wow fadeInUp"
                  data-wow-delay="0.2s"
                  style={{ borderRadius: "0px" }}
                >
                  <div>
                    <h3 className="fw-bold mb-3" style={{ color: "#07332F" }}>
                      Qualifications &amp; Practice
                    </h3>

                    <div className="mb-3 pb-3 border-bottom">
                      <span className="small text-muted d-block">Department</span>
                      <strong className="text-dark">{doctor.department}</strong>
                    </div>

                    <div className="mb-3 pb-3 border-bottom">
                      <span className="small text-muted d-block">Clinical Specialty</span>
                      <strong className="text-dark">{doctor.specialty}</strong>
                    </div>

                    <div className="mb-3 pb-3 border-bottom">
                      <span className="small text-muted d-block">Degrees &amp; Qualifications</span>
                      <strong className="text-dark" style={{ wordBreak: "break-word" }}>{doctor.qualification}</strong>
                    </div>

                    {doctor.registrationNumber && (
                      <div className="mb-3 pb-3 border-bottom">
                        <span className="small text-muted d-block">Medical Council Registration</span>
                        <strong className="text-success">{doctor.registrationNumber}</strong>
                      </div>
                    )}

                    <div className="mb-3 pb-3 border-bottom">
                      <span className="small text-muted d-block">Clinical Experience</span>
                      <strong className="text-dark">{experienceText}</strong>
                    </div>

                    <div className="mb-3">
                      <span className="small text-muted d-block">Hospital Location</span>
                      <strong className="text-dark">IRAJ Multi-Speciality Hospital, Near Jug Junction, Gajuwaka</strong>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Link
                      href="/appointment"
                      className="btn btn-default w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: "0px" }}
                    >
                      <i className="fa-solid fa-calendar-check"></i> Book Doctor Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
