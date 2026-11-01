"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import PageHeader from "@/components/common/PageHeader";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

// ─── Real Iraj Hospitals Departments & Doctors ──────────────────────────────
const DEPARTMENTS_DATA = [
  {
    id: "neuro-neurology",
    name: "Neuro Sciences – Neurology",
    doctors: [
      { name: "Dr. V Manasa", qualification: "MD (General Medicine)(KGH), DM (Neurology)(KGH)", specialization: "Neurologist" },
      { name: "Dr. CH Mounika", qualification: "MD (General Medicine)(KGH), DM (Neurology)(NIMS)", specialization: "Neurologist" },
    ],
  },
  {
    id: "neuro-neurosurgery",
    name: "Neuro Sciences – Neurosurgery",
    doctors: [
      { name: "Dr. Vijay Terapalli", qualification: "MS (General Surgery), Mch (Neuro Surgery)(KGH)", specialization: "Neuro Surgeon" },
    ],
  },
  {
    id: "neuro-radiology",
    name: "Neuro & Interventional Radiology",
    doctors: [
      { name: "Dr. Rajesh Poosarla", qualification: "MD (Radio Diagnostics), DNB, DM (Neuro Radiology)", specialization: "Interventional Radiologist" },
    ],
  },
  {
    id: "endocrinology",
    name: "Endocrinology / Hormones",
    doctors: [
      { name: "Dr. P Venu Madhavi", qualification: "MD (General Medicine), DM (Endocrinology)(Osmania)", specialization: "Endocrinologist" },
    ],
  },
  {
    id: "cardiac-cardiology",
    name: "Cardiac / Heart Sciences – Cardiology",
    doctors: [
      { name: "Dr. Davala Vasu Babu", qualification: "MD (General Medicine), DrNB (Cardiology)", specialization: "Cardiologist" },
      { name: "Dr. Rakesh Dubba", qualification: "MD (General Medicine), DM (Cardiology), PDF (EP) Medanta", specialization: "Cardiologist" },
    ],
  },
  {
    id: "cardiac-surgery",
    name: "Cardiac / Heart Sciences – Cardiothoracic & Vascular Surgery",
    doctors: [
      { name: "Dr. Revanth Reddy Maramreddy", qualification: "MS (General Surgery), Mch (CTVS, PGIMER Chandigarh)", specialization: "Cardio Thoracic & Vascular Surgeon" },
    ],
  },
  {
    id: "nephrology",
    name: "Renal / Kidney Sciences – Nephrology",
    doctors: [
      { name: "Dr. Krishnam Raju Penmatsa", qualification: "MD, DM, DNB (Nephrology), Clinical Fellowship (Canada)", specialization: "Nephrologist" },
    ],
  },
  {
    id: "urology",
    name: "Renal / Kidney Sciences – Urology",
    doctors: [
      { name: "Dr. M Sudarshan Rao", qualification: "MS (General Surgery), Mch (Urology)", specialization: "Urologist" },
    ],
  },
  {
    id: "gastro-medical",
    name: "Gastro Sciences – Medical Gastroenterology",
    doctors: [
      { name: "Dr. V Sasanka", qualification: "MD (General Medicine), DrNB (Gastroenterology)", specialization: "Gastroenterologist" },
    ],
  },
  {
    id: "gastro-surgical",
    name: "Gastro Sciences – Surgical Gastroenterology",
    doctors: [
      { name: "Dr. Kinjarapu Ravi Shankar", qualification: "MS (General Surgery), DNB (Surgical Gastroenterology)", specialization: "Surgical Gastroenterologist" },
    ],
  },
  {
    id: "oncology",
    name: "Oncology / Cancer – Radiation Oncology",
    doctors: [
      { name: "Dr. P S Bhattacharyya", qualification: "MD (Radiotherapy)", specialization: "Radiation Oncologist" },
    ],
  },
  {
    id: "plastic-surgery",
    name: "Plastic Surgery",
    doctors: [
      { name: "Dr. Uday Kumar Chapa", qualification: "MS (General Surgery)(JIPMER), Mch (Plastic Surgery)(PGIMER)", specialization: "Plastic Surgeon" },
      { name: "Dr. Nitesh Reddy Dharmala", qualification: "MS (General Surgery), Mch (Plastic Surgery)(Safdarjung, Delhi)", specialization: "Plastic Surgeon" },
    ],
  },
  {
    id: "orthopaedics",
    name: "Orthopaedics / Bone & Joint",
    doctors: [
      { name: "Dr. D S S Phani", qualification: "MBBS, MS (Orthopaedics)", specialization: "Orthopaedician" },
      { name: "Dr. B M K Phaniteja", qualification: "MBBS, DNB (Orthopaedics)", specialization: "Orthopaedician" },
      { name: "Dr. Yoganadh Sadhu", qualification: "MBBS, MS (Orthopaedics)", specialization: "Orthopaedician" },
      { name: "Dr. Golla Sushanth", qualification: "MBBS, MS (Orthopaedics)", specialization: "Orthopaedician" },
      { name: "Dr. Lalam Pavan", qualification: "MBBS, Diploma in Orthopaedics", specialization: "Orthopaedician" },
    ],
  },
  {
    id: "general-surgery",
    name: "General / Laparoscopic Surgery",
    doctors: [
      { name: "Dr. Kodali Gopi", qualification: "MBBS, MS (General Surgery)", specialization: "General / Laparoscopic Surgeon" },
      { name: "Dr. M Yesu Prasad", qualification: "MBBS, MS (General Surgery)", specialization: "General / Laparoscopic Surgeon" },
    ],
  },
  {
    id: "ent",
    name: "Otolaryngology / ENT",
    doctors: [
      { name: "Dr. Tummidi Veera Venkata Vinay Kumar", qualification: "MBBS, MS (ENT)", specialization: "ENT Surgeon" },
      { name: "Dr. Sirisha Sirugudi", qualification: "MBBS, MS (ENT)", specialization: "ENT Surgeon" },
    ],
  },
  {
    id: "gynecology",
    name: "Obstetrics & Gynaecology",
    doctors: [
      { name: "Dr. G V K Jyothirmai", qualification: "MBBS, MS (OBG)", specialization: "Obstetrician & Gynaecologist" },
      { name: "Dr. S Pavani", qualification: "MBBS, MS (OBG)", specialization: "Obstetrician & Gynaecologist" },
      { name: "Dr. Y Samatha", qualification: "MBBS, DGO", specialization: "Obstetrician & Gynaecologist" },
    ],
  },
  {
    id: "paediatrics",
    name: "Paediatrics",
    doctors: [
      { name: "Dr. L Avinash", qualification: "DCH, DNB (Paediatrics)", specialization: "Paediatrician" },
    ],
  },
  {
    id: "internal-medicine",
    name: "Internal Medicine",
    doctors: [
      { name: "Dr. K Uday Bhaskar", qualification: "MBBS, MD (General Medicine)", specialization: "General Physician" },
    ],
  },
  {
    id: "anaesthesia",
    name: "Anaesthesia & Critical Care Medicine",
    doctors: [
      { name: "Dr. CH Ashwani Dutt", qualification: "MBBS, MD (Anaesthesia & Critical Care Medicine)", specialization: "Anaesthesiologist & Intensivist" },
    ],
  },
  {
    id: "chest-tb",
    name: "TB & Chest Diseases",
    doctors: [
      { name: "Sayyapureddi Bandhavi", qualification: "MBBS, MD (Respiratory Medicine), IDCCM", specialization: "Pulmonologist & Intensivist" },
    ],
  },
  {
    id: "resident-doctors",
    name: "Resident Doctors",
    doctors: [
      { name: "Dr. Daliboina Sekhar", qualification: "MD (General Physician), Fellowship in Diabetes & Clinical Cardiology", specialization: "General Physician" },
      { name: "Dr. Rao Babu Panku", qualification: "MD (General Physician), Fellowship in Diabetes", specialization: "General Physician" },
    ],
  },
];

// Generate time slots: 09:00–13:00 and 17:00–20:00 in 20-min intervals
function generateSlots() {
  const slots = [];
  const sessions = [
    { start: 9 * 60, end: 13 * 60, label: "Morning" },
    { start: 17 * 60, end: 20 * 60, label: "Evening" },
  ];
  for (const session of sessions) {
    let t = session.start;
    while (t < session.end) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const suffix = h < 12 ? "AM" : "PM";
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      slots.push({
        value: `${hh}:${mm}`,
        label: `${displayH}:${mm} ${suffix}`,
        session: session.label,
      });
      t += 20;
    }
  }
  return slots;
}
const ALL_SLOTS = generateSlots();

// Helper to call WhatsApp backend
async function notifyWhatsAppBackend(payload) {
  const baseUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_HOSPITAL_WEBSITE_API_KEY;
  if (!baseUrl) return { ok: false, error: "WHATSAPP_API_URL not configured" };
  try {
    const res = await fetch(`${baseUrl}/api/leads/appointment-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
      },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export default function AppointmentPage() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const phoneInputRef = useRef(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [whatsappSent, setWhatsappSent] = useState(false);

  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    msg: "",
  });

  const selectedDept = DEPARTMENTS_DATA.find((d) => d.id === selectedDeptId) || null;
  const availableDoctors = selectedDept ? selectedDept.doctors : [];

  // Auto-fill form when user logs in
  useEffect(() => {
    if (user || profile) {
      const resolvedName =
        profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        (user?.user_metadata?.given_name
          ? `${user.user_metadata.given_name} ${user.user_metadata.family_name || ""}`.trim()
          : "") ||
        (user?.email ? user.email.split("@")[0] : "");

      const resolvedEmail = profile?.email || user?.email || "";
      const rawPhone = profile?.phone || user?.user_metadata?.phone || "";
      const cleanPhone = rawPhone ? rawPhone.replace("+91", "").replace(/\s/g, "").trim() : "";

      setFormData((prev) => ({
        ...prev,
        name: resolvedName || prev.name,
        email: resolvedEmail || prev.email,
        phone: cleanPhone || prev.phone,
      }));

      if (!cleanPhone && phoneInputRef.current) {
        setTimeout(() => phoneInputRef.current?.focus(), 400);
      }
    }
  }, [user, profile]);

  // When department changes → reset doctor
  const handleDeptChange = (deptId) => {
    setSelectedDeptId(deptId);
    const dept = DEPARTMENTS_DATA.find((d) => d.id === deptId);
    setFormData((prev) => ({
      ...prev,
      department: dept ? dept.name : "",
      doctor: "",
    }));
  };

  const handleDoctorChange = (doctorName) => {
    setFormData((prev) => ({ ...prev, doctor: doctorName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const cleanDigits = formData.phone.replace(/[^0-9]/g, "");
    if (cleanDigits.length < 10) {
      setFormError("Please enter a valid 10-digit WhatsApp number to receive your appointment confirmation.");
      phoneInputRef.current?.focus();
      return;
    }
    if (!formData.department) {
      setFormError("Please select a department.");
      return;
    }
    if (!formData.doctor) {
      setFormError("Please select a doctor from the chosen department.");
      return;
    }
    if (!formData.date) {
      setFormError("Please select a preferred consultation date.");
      return;
    }
    if (!formData.time) {
      setFormError("Please select a preferred time slot.");
      return;
    }

    setSubmitting(true);
    const fullPhone = `${formData.countryCode}${cleanDigits}`;

    // 1. Notify WhatsApp backend (creates appointment + sends WhatsApp confirmation)
    const waPayload = {
      name: formData.name,
      phone: fullPhone,
      department: formData.department,
      doctor_name: formData.doctor,
      appointment_date: formData.date,
      appointment_time: formData.time,
      notes: formData.msg || "",
    };
    const waResult = await notifyWhatsAppBackend(waPayload);
    setWhatsappSent(waResult.ok);

    // 2. Also save to local Supabase as fallback/record
    try {
      await supabase.from("appointments").insert({
        user_id: user?.id || null,
        patient_name: formData.name,
        email: formData.email,
        phone: fullPhone,
        doctor: formData.doctor,
        department: formData.department,
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.msg || "",
        status: "pending",
      });
    } catch (err) {
      console.warn("Supabase appointment record notice:", err.message);
    }

    // 3. Update user profile with phone if logged in
    if (user) {
      try {
        await updateProfile({ full_name: formData.name, phone: fullPhone });
      } catch (_) {}
    }

    setSubmitting(false);
    setFormSubmitted(true);
  };

  const fullPhoneNumber = `${formData.countryCode}${formData.phone.replace(/[^0-9]/g, "")}`;
  const whatsappMessage = encodeURIComponent(
    `Hello IRAJ Hospitals, I have requested an appointment:\n\n👤 Patient: ${formData.name}\n📞 WhatsApp: ${fullPhoneNumber}\n🏥 Department: ${formData.department}\n👨‍⚕️ Doctor: ${formData.doctor}\n📅 Date: ${formData.date} at ${formData.time}\n💬 Notes: ${formData.msg || "General consultation"}`
  );

  const isGoogleUser =
    user?.user_metadata?.provider === "google" ||
    user?.app_metadata?.provider === "google" ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

  // Min date: today
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <PageHeader
        title="Book Appointment"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Appointment Booking" },
        ]}
      />

      {/* ── Appointment Booking Section ── */}
      <div className="appointment-booking wow fadeInUp" data-wow-delay="0.25s">
        <div className="container">

          {/* Patient Account Status Banner */}
          {!user ? (
            <div
              className="p-3 p-md-4 rounded-4 mb-4 shadow-sm border"
              style={{ backgroundColor: "#F4FAF8", borderColor: "#C2E2DA" }}
            >
              <div className="row align-items-center g-3">
                <div className="col-lg-7 col-md-12">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-white shadow-sm flex-shrink-0"
                      style={{ width: "50px", height: "50px", border: "1px solid #D5E7E2" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h5 className="fw-bold mb-0" style={{ color: "#07332F", fontSize: "17px" }}>
                          Fast Appointment Booking
                        </h5>
                        <span className="badge bg-success text-white small" style={{ fontSize: "11px" }}>
                          1-Click Autofill
                        </span>
                      </div>
                      <p className="text-secondary small mb-0" style={{ lineHeight: "1.5" }}>
                        Sign in with Google to auto-fill your name & email. You only need to enter your WhatsApp number!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12 d-flex flex-column align-items-lg-end align-items-start">
                  <div style={{ maxWidth: "340px", width: "100%" }}>
                    <GoogleSignInButton
                      redirectPath="/appointment"
                      buttonText="Sign in with Google to Autofill"
                      size="sm"
                      showSetupHelper={false}
                    />
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <Link href="/login?redirect=/appointment" className="text-muted small text-decoration-none" style={{ fontSize: "12px" }}>
                      <i className="fa-solid fa-envelope me-1"></i> Sign in with Email
                    </Link>
                    <span className="text-muted small">•</span>
                    <span className="text-muted small" style={{ fontSize: "12px" }}>Or fill manually as guest</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="p-3 p-md-4 rounded-4 mb-4 shadow-sm border d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"
              style={{ backgroundColor: "#EAF6F0", borderColor: "#BDE2D0" }}
            >
              <div className="d-flex align-items-center gap-3">
                {profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                  <img
                    src={profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                    alt="Patient avatar"
                    className="rounded-circle border border-2 border-white shadow-sm flex-shrink-0"
                    style={{ width: "48px", height: "48px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-success text-white fw-bold flex-shrink-0"
                    style={{ width: "48px", height: "48px", fontSize: "18px" }}
                  >
                    {(formData.name || user.email || "P").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span className="small text-muted">Booking for:</span>
                    <strong style={{ color: "#07332F", fontSize: "16px" }}>
                      {formData.name || profile?.full_name || user.email}
                    </strong>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
                      <i className="fa-solid fa-circle-check me-1"></i>
                      {isGoogleUser ? "Google Verified" : "Logged In"}
                    </span>
                  </div>
                  <p className="text-secondary small mb-0" style={{ fontSize: "13px" }}>
                    <i className="fa-solid fa-envelope me-1 text-muted"></i>
                    {formData.email || user.email}
                    <span className="mx-2 text-muted">•</span>
                    <strong className="text-success">
                      <i className="fa-solid fa-arrow-down me-1"></i>Name & Email auto-filled. Enter WhatsApp number below.
                    </strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 flex-shrink-0"
                style={{ fontSize: "12.5px" }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket me-1"></i> Switch Account
              </button>
            </div>
          )}

          <div className="row no-gutters">
            {/* ── Main Form ── */}
            <div className="col-lg-8">
              <div className="contact-form">
                {formSubmitted ? (
                  /* Success State */
                  <div className="p-4 p-md-5 rounded-4 bg-white shadow-sm border text-center my-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 text-success"
                      style={{ width: "72px", height: "72px", backgroundColor: "rgba(40,167,69,0.1)" }}
                    >
                      <i className="fa-solid fa-circle-check fs-1"></i>
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: "#07332F" }}>Appointment Request Confirmed!</h3>
                    <p className="text-muted mb-2 mx-auto" style={{ maxWidth: "560px" }}>
                      Thank you, <strong>{formData.name}</strong>. Your request for{" "}
                      <strong>{formData.doctor}</strong> ({formData.department}) on{" "}
                      <strong>{formData.date}</strong> at <strong>{formData.time}</strong> has been received.
                      We will reach you at <strong>{fullPhoneNumber}</strong> via WhatsApp with your OP token.
                    </p>

                    {whatsappSent && (
                      <div
                        className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-3"
                        style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "14px" }}
                      >
                        <i className="fa-brands fa-whatsapp fs-5"></i>
                        WhatsApp confirmation sent to {fullPhoneNumber}
                      </div>
                    )}

                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-3">
                      <a
                        href={`https://wa.me/919801081080?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success py-3 px-4 fw-bold rounded-3 d-inline-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="fa-brands fa-whatsapp fs-5"></i> Chat on WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setFormSubmitted(false);
                          setWhatsappSent(false);
                          setFormData((prev) => ({ ...prev, date: "", time: "", msg: "" }));
                        }}
                        className="btn btn-outline-secondary py-3 px-4 fw-semibold rounded-3"
                      >
                        Book Another Appointment
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Booking Form */
                  <form id="appointmentForm" onSubmit={handleSubmit}>
                    {formError && (
                      <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4 d-flex align-items-center">
                        <i className="fa-solid fa-circle-exclamation me-2 fs-5"></i>
                        <div>{formError}</div>
                      </div>
                    )}

                    <div className="row">
                      {/* Patient Name */}
                      <div className="form-group col-md-6 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label small fw-bold text-white mb-0" htmlFor="appt-name">
                            Patient Name <span className="text-danger">*</span>
                          </label>
                          {user && (
                            <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: "rgba(56,211,159,0.25)", color: "#38D39F", border: "1px solid #38D39F", fontSize: "11px" }}>
                              <i className="fa-solid fa-circle-check me-1"></i> Auto-filled
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          name="name"
                          className="form-control fw-semibold"
                          id="appt-name"
                          placeholder="Your Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          style={{ backgroundColor: "#FFFFFF", color: "#07332F", fontWeight: "600", fontSize: "15px" }}
                        />
                      </div>

                      {/* Email */}
                      <div className="form-group col-md-6 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label small fw-bold text-white mb-0" htmlFor="appt-email">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          {user && (
                            <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: "rgba(56,211,159,0.25)", color: "#38D39F", border: "1px solid #38D39F", fontSize: "11px" }}>
                              <i className="fa-solid fa-circle-check me-1"></i> Google Verified
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          name="email"
                          className="form-control fw-semibold"
                          id="appt-email"
                          placeholder="yourname@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          style={{ backgroundColor: "#FFFFFF", color: "#07332F", fontWeight: "600", fontSize: "15px" }}
                        />
                      </div>

                      {/* WhatsApp Phone */}
                      <div className="form-group col-md-6 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label small fw-bold text-white mb-0" htmlFor="appt-phone">
                            WhatsApp Number <span className="text-danger">*</span>
                          </label>
                          <span
                            className="badge rounded-pill px-2 py-1 fw-bold d-flex align-items-center gap-1"
                            style={{ backgroundColor: "#F7A582", color: "#07332F", fontSize: "11px" }}
                          >
                            <i className="fa-brands fa-whatsapp fs-6"></i>
                            {formData.phone ? "Token sent here" : "Required for token"}
                          </span>
                        </div>
                        <div className="input-group">
                          <span
                            className="input-group-text fw-bold"
                            style={{ backgroundColor: "#E8F4F1", color: "#07332F", fontSize: "14px", borderColor: "#D5E7E2" }}
                          >
                            🇮🇳 +91
                          </span>
                          <input
                            ref={phoneInputRef}
                            type="tel"
                            name="phone"
                            className="form-control border-start-0 ps-2 fw-semibold"
                            id="appt-phone"
                            placeholder="98010 81080"
                            maxLength="10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            style={{ backgroundColor: "#FFFFFF", color: "#07332F", fontWeight: "600", fontSize: "15px", borderColor: "#D5E7E2" }}
                          />
                        </div>
                        <small className="d-block mt-1 text-white-50" style={{ fontSize: "12px" }}>
                          We send your OP token & doctor timing to this WhatsApp number.
                        </small>
                      </div>

                      {/* Preferred Date */}
                      <div className="form-group col-md-6 mb-4">
                        <label className="form-label small fw-bold text-white mb-2" htmlFor="appt-date">
                          Preferred Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          name="date"
                          className="form-control fw-semibold"
                          id="appt-date"
                          min={today}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                          style={{ backgroundColor: "#FFFFFF", color: "#07332F", fontWeight: "600", fontSize: "15px" }}
                        />
                      </div>

                      {/* Department */}
                      <div className="form-group col-md-6 mb-4">
                        <label className="form-label small fw-bold text-white mb-2" htmlFor="appt-dept">
                          Department / Specialty <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control fw-semibold"
                          id="appt-dept"
                          value={selectedDeptId}
                          onChange={(e) => handleDeptChange(e.target.value)}
                          required
                          style={{ backgroundColor: "#FFFFFF", color: selectedDeptId ? "#07332F" : "#6c757d", fontWeight: "600", fontSize: "15px" }}
                        >
                          <option value="">— Select Department —</option>
                          {DEPARTMENTS_DATA.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Doctor */}
                      <div className="form-group col-md-6 mb-4">
                        <label className="form-label small fw-bold text-white mb-2" htmlFor="appt-doctor">
                          Consulting Doctor <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control fw-semibold"
                          id="appt-doctor"
                          value={formData.doctor}
                          onChange={(e) => handleDoctorChange(e.target.value)}
                          required
                          disabled={!selectedDeptId}
                          style={{ backgroundColor: "#FFFFFF", color: formData.doctor ? "#07332F" : "#6c757d", fontWeight: "600", fontSize: "15px", opacity: selectedDeptId ? 1 : 0.6 }}
                        >
                          <option value="">
                            {selectedDeptId ? "— Select Doctor —" : "Select department first"}
                          </option>
                          {availableDoctors.map((doc) => (
                            <option key={doc.name} value={doc.name}>
                              {doc.name} — {doc.specialization}
                            </option>
                          ))}
                        </select>
                        {formData.doctor && (
                          <small className="d-block mt-1 text-white-50" style={{ fontSize: "11px" }}>
                            {availableDoctors.find((d) => d.name === formData.doctor)?.qualification}
                          </small>
                        )}
                      </div>

                      {/* Time Slot */}
                      <div className="form-group col-md-12 mb-4">
                        <label className="form-label small fw-bold text-white mb-2">
                          Preferred Time Slot <span className="text-danger">*</span>
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "8px" }}>
                          {["Morning", "Evening"].map((session) => (
                            <div key={session} style={{ gridColumn: "1/-1" }}>
                              <div className="text-white-50 small fw-semibold mb-2" style={{ fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                {session === "Morning" ? "☀️" : "🌆"} {session} ({session === "Morning" ? "9 AM – 1 PM" : "5 PM – 8 PM"})
                              </div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {ALL_SLOTS.filter((s) => s.session === session).map((slot) => (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, time: slot.label })}
                                    style={{
                                      padding: "6px 14px",
                                      borderRadius: "8px",
                                      border: formData.time === slot.label ? "2px solid #F7A582" : "1px solid rgba(255,255,255,0.3)",
                                      backgroundColor: formData.time === slot.label ? "#F7A582" : "rgba(255,255,255,0.08)",
                                      color: formData.time === slot.label ? "#07332F" : "#FFFFFF",
                                      fontSize: "13px",
                                      fontWeight: formData.time === slot.label ? "700" : "500",
                                      cursor: "pointer",
                                      transition: "all 0.2s ease",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {slot.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {formData.time && (
                          <div
                            className="mt-2 d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                            style={{ backgroundColor: "rgba(247,165,130,0.2)", border: "1px solid #F7A582", fontSize: "13px", color: "#F7A582" }}
                          >
                            <i className="fa-regular fa-clock"></i> Selected: <strong>{formData.time}</strong>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="form-group col-md-12 mb-4">
                        <label className="form-label small fw-bold text-white mb-2">
                          Symptoms / Reason (Optional)
                        </label>
                        <textarea
                          name="msg"
                          className="form-control"
                          id="appt-msg"
                          rows="3"
                          placeholder="Briefly describe your symptoms (e.g. fever for 2 days, back pain, routine check-up)..."
                          value={formData.msg}
                          onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                          style={{ backgroundColor: "#FFFFFF", color: "#07332F", fontSize: "14px" }}
                        />
                      </div>

                      {/* Submit */}
                      <div className="col-md-12 form-group">
                        <button
                          type="submit"
                          className="btn-default w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                          disabled={submitting}
                          style={{ height: "54px", fontSize: "16px" }}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                              <span>Confirming Appointment...</span>
                            </>
                          ) : (
                            <>
                              <span>Confirm &amp; Book Appointment</span>
                              <i className="fa-solid fa-calendar-check ms-1"></i>
                            </>
                          )}
                        </button>
                        <p className="text-white-50 small text-center mt-2 mb-0" style={{ fontSize: "12px" }}>
                          <i className="fa-solid fa-shield-halved me-1"></i>
                          Your information is secure. You will receive a WhatsApp confirmation after booking.
                        </p>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* ── Side Contact Card ── */}
            <div className="col-lg-4">
              <div className="quick-contacts">
                <div className="quick-contacts-content">
                  <h3>Hospital Reception</h3>
                  <p>
                    Need immediate emergency help or same-day OP token? Connect directly with our front desk in Gajuwaka.
                  </p>
                </div>
                <div className="quick-contact-info">
                  <div className="quick-contact-box">
                    <div className="icon-box"><i className="fas fa-map-marker-alt"></i></div>
                    <p>26-4-9/1, Near Jug Junction, Gajuwaka, Visakhapatnam</p>
                  </div>
                  <div className="quick-contact-box">
                    <div className="icon-box"><i className="fas fa-envelope-open-text"></i></div>
                    <p>help@irajhospitals.com</p>
                  </div>
                  <div className="quick-contact-box">
                    <div className="icon-box"><i className="fa-solid fa-phone"></i></div>
                    <p>+91 98010 81080</p>
                  </div>
                  <div className="quick-contact-box">
                    <div className="icon-box"><i className="fas fa-clock"></i></div>
                    <p>24/7 Emergency &amp; Trauma | OPD: 9 AM – 8 PM</p>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-3">
                  <a
                    href="https://wa.me/919801081080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded-3 fw-bold text-decoration-none"
                    style={{ backgroundColor: "#25D366", color: "#FFFFFF", fontSize: "15px", transition: "all 0.2s ease" }}
                  >
                    <i className="fa-brands fa-whatsapp fs-4"></i>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Departments Overview Section ── */}
      <div className="meet-our-team appointment-our-team">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">OUR SPECIALTIES</h3>
                <h2 className="text-anime-style-3">21 Departments. Expert Consultants.</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {DEPARTMENTS_DATA.map((dept, i) => (
              <div key={dept.id} className="col-lg-3 col-md-6 mb-4">
                <div
                  className="wow fadeInUp h-100 rounded-4 p-4"
                  data-wow-delay={`${(i % 4) * 0.15}s`}
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2ECE9", boxShadow: "0 2px 12px rgba(7,51,47,0.06)" }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{ width: "40px", height: "40px", backgroundColor: "rgba(7,51,47,0.07)" }}
                  >
                    <i className="fa-solid fa-stethoscope" style={{ color: "#07332F", fontSize: "16px" }}></i>
                  </div>
                  <h3 className="fw-bold mb-1" style={{ fontSize: "14px", color: "#07332F", lineHeight: "1.3" }}>
                    {dept.name}
                  </h3>
                  <p className="text-muted mb-0" style={{ fontSize: "12.5px" }}>
                    {dept.doctors.length} Doctor{dept.doctors.length > 1 ? "s" : ""}
                    {" · "}
                    {dept.doctors.map((d) => d.specialization).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
