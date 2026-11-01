"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import VideoModal from "@/components/common/VideoModal";
import { useAuth } from "@/context/AuthContext";
import { doctorsData } from "@/data/doctorsData";

export default function AboutPage() {
  const { user } = useAuth();
  const [videoOpen, setVideoOpen] = useState(false);

  const testimonials = [
    {
      name: "Saul Goodman",
      role: "Patient",
      image: "/images/author-1.jpg",
      stars: 5,
      text: "“Clear diagnosis and swift treatment—highly recommend IRAJ Hospitals. The medical team was prompt, compassionate, and attentive throughout my checkup.”",
    },
    {
      name: "Sara Wilsson",
      role: "Patient Attendant",
      image: "/images/author-2.jpg",
      stars: 5,
      text: "“Supportive nursing and courteous front-desk—great stay. The dedicated ICU facilities and patient monitoring gave our entire family immense peace of mind.”",
    },
    {
      name: "Jena Karlis",
      role: "Patient",
      image: "/images/author-3.jpg",
      stars: 5,
      text: "“Modern facilities, transparent billing—smooth experience. The doctors explained every procedure clearly and took great care of my surgery in the modular OT.”",
    },
    {
      name: "Matt Brandon",
      role: "Patient",
      image: "/images/author-4.jpg",
      stars: 5,
      text: "“Doctors explained everything thoroughly and followed up post discharge. Truly compassionate and family-centric healthcare right in Gajuwaka.”",
    },
  ];

  const coreValues = [
    {
      icon: "fa-solid fa-heart-pulse",
      title: "Compassion",
      desc: "Providing care with empathy and understanding for every patient's unique needs, circumstances, and family dignity.",
    },
    {
      icon: "fa-solid fa-award",
      title: "Excellence",
      desc: "Maintaining the highest standards of clinical precision through evidence-based protocols and continuous learning.",
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Integrity",
      desc: "Building lifelong trust through honest communication, transparent treatment pathways, and ethical medical practices.",
    },
    {
      icon: "fa-solid fa-microscope",
      title: "Innovation",
      desc: "Embracing advanced diagnostics, laminar airflow operating theatres, and modern telemetry to improve recovery outcomes.",
    },
  ];

  return (
    <>
      {/* Subpage Header Start */}
      <PageHeader
        title="About IRAJ Hospitals"
        breadcrumbs={[{ label: "About Us" }]}
      />
      {/* Subpage Header End */}

      {/* About Us Caring Section Start */}
      <div className="page-about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* Page About Content Start */}
              <div className="page-about-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">ABOUT IRAJ HOSPITALS</h3>
                  <h2 className="text-anime-style-3">Compassionate Care For Every Family in Gajuwaka.</h2>
                </div>
                {/* Section Title End */}

                {/* Page About Body Start */}
                <div className="page-about-body">
                  <p className="wow fadeInUp">
                    IRAJ Hospitals is committed to clinical outcomes, transparency, and patient dignity—serving families in Gajuwaka with round-the-clock medical care.
                  </p>
                  <p className="wow fadeInUp mt-2" data-wow-delay="0.15s">
                    We are dedicated to providing exceptional healthcare services with a focus on safety, empathy, and clinical excellence. Our care goes beyond treatment—we aim to build lasting relationships with patients and families through clear communication and coordinated care.
                  </p>
                  <p className="wow fadeInUp mt-2" data-wow-delay="0.25s">
                    From emergency to ICU and diagnostics to rehabilitation, our multidisciplinary teams follow evidence-based protocols to improve recovery and patient satisfaction.
                  </p>
                </div>
                {/* Page About Body End */}

                {/* Page About Footer Start */}
                <div className="page-about-footer wow fadeInUp" data-wow-delay="0.35s">
                  <div className="about-footer-img">
                    <figure className="image-anime">
                      <img src="/images/about-footer-img.jpg" alt="Medical Team" />
                    </figure>
                  </div>
                  <div className="about-footer-content">
                    <div className="footer-content-title">
                      <h3>Team IRAJ</h3>
                      <p>Consultant Physicians &amp; Clinical Team</p>
                    </div>
                    <div className="signature-image">
                      <img src="/images/signature.png" alt="Signature" />
                    </div>
                  </div>
                </div>
                {/* Page About Footer End */}
              </div>
              {/* Page About Content End */}
            </div>

            <div className="col-lg-6">
              <div className="about-page-img">
                <div className="page-about-image">
                  <div className="page-about-image-1">
                    <figure className="image-anime reveal">
                      <img src="/images/page-about-us-img-1.jpg" alt="IRAJ Care" />
                    </figure>
                  </div>

                  <div className="page-about-image-2">
                    <figure className="image-anime reveal">
                      <img src="/images/page-about-us-img-2.jpg" alt="IRAJ Facilities" />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Us Caring Section End */}

      {/* Hospital Metrics / Statistics Banner */}
      <div className="py-5" style={{ backgroundColor: "#07332F", color: "#ffffff" }}>
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-bold mb-1" style={{ color: "var(--accent-color, #F7A582)" }}>33+</h2>
                <p className="text-white-50 text-uppercase small mb-0 fw-semibold">Specialist Doctors</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-bold mb-1" style={{ color: "var(--accent-color, #F7A582)" }}>21+</h2>
                <p className="text-white-50 text-uppercase small mb-0 fw-semibold">Clinical Departments</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-bold mb-1" style={{ color: "var(--accent-color, #F7A582)" }}>15,000+</h2>
                <p className="text-white-50 text-uppercase small mb-0 fw-semibold">Patients Treated</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-bold mb-1" style={{ color: "var(--accent-color, #F7A582)" }}>25+</h2>
                <p className="text-white-50 text-uppercase small mb-0 fw-semibold">Years Clinical Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section Start */}
      <div className="top-services py-5">
        <div className="container">
          <div className="row section-row text-center">
            <div className="col-lg-8 mx-auto">
              <div className="section-title">
                <h3 className="wow fadeInUp">OUR CORE VALUES</h3>
                <h2 className="text-anime-style-3">The Principles That Guide Everything We Do.</h2>
                <p className="wow fadeInUp text-muted mt-2">
                  These core values define our commitment to providing safe, dependable, and compassionate healthcare to every patient.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {coreValues.map((val, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 col-12">
                <div
                  className="p-4 rounded-4 h-100 bg-white shadow-sm border text-center wow fadeInUp"
                  data-wow-delay={`${idx * 0.15}s`}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "rgba(247, 165, 130, 0.15)",
                      color: "#07332F",
                      fontSize: "24px",
                    }}
                  >
                    <i className={val.icon}></i>
                  </div>
                  <h4 className="fw-bold mb-2" style={{ color: "#07332F" }}>
                    {val.title}
                  </h4>
                  <p className="text-muted small mb-0" style={{ lineHeight: "1.6" }}>
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Core Values Section End */}

      {/* We Improving / Facilities Section Start */}
      <div className="we-improving">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="improving-img">
                <figure className="image-anime reveal">
                  <img src="/images/improving-img.jpg" alt="IRAJ Hospital Facilities" />
                </figure>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="improving-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">CLINICAL FACILITIES</h3>
                  <h2 className="text-anime-style-3">Modern Infrastructure Designed For Patient Safety.</h2>
                </div>

                <div className="improving-body">
                  <p className="wow fadeInUp">
                    Our multi-speciality infrastructure features a surgical/medical intensive critical care unit and neonatal intensive critical care unit with advanced equipment, and modular operating theatres equipped with laminar airflow systems to guarantee aseptic environments.
                  </p>
                  <p className="wow fadeInUp mt-2" data-wow-delay="0.15s">
                    With an accredited in-house laboratory and round-the-clock 24×7 pharmacy on site, patients receive instantaneous diagnostics and immediate medication access.
                  </p>
                </div>

                <div className="improving-btn wow fadeInUp d-flex gap-3 align-items-center mt-4" data-wow-delay="0.25s">
                  <Link href="/appointment" className="btn-default">
                    Book An Appointment
                  </Link>
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    className="btn-video border-0 bg-transparent"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fas fa-play-circle"></i> Hospital Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* We Improving Section End */}

      {/* Meet Our Team Start */}
      <div className="meet-our-team">
        <div className="container">
          <div className="row section-row align-items-center mb-4">
            <div className="col-lg-7 col-md-8">
              <div className="section-title">
                <h3 className="wow fadeInUp">OUR MEDICAL SPECIALISTS</h3>
                <h2 className="text-anime-style-3">Experienced &amp; Empathetic Doctors.</h2>
              </div>
            </div>
            <div className="col-lg-5 col-md-4 text-md-end mt-3 mt-md-0">
              <Link href="/our-team" className="btn-default">
                {user ? "View All Doctors" : "Login to View All Doctors"}
              </Link>
            </div>
          </div>

          {!user && (
            <div
              className="p-3 rounded-4 mb-4 text-center border"
              style={{ backgroundColor: "#F4FAF8", borderColor: "#38D39F" }}
            >
              <span className="small text-muted me-2">
                <i className="fa-solid fa-lock text-warning me-1"></i> Doctor profiles &amp; qualifications are locked.
              </span>
              <Link href="/login?redirect=/our-team" className="fw-bold text-success text-decoration-none small">
                Please Sign In to unlock our team <i className="fa-solid fa-arrow-right ms-1"></i>
              </Link>
            </div>
          )}

          <div className="row g-4">
            {doctorsData.slice(0, 4).map((doctor, idx) => (
              <div key={doctor.id} className="col-lg-3 col-md-6">
                <div className="team-member-item wow fadeInUp h-100 d-flex flex-column justify-content-between" data-wow-delay={`${idx * 0.2}s`}>
                  <div>
                    <div className="team-image position-relative overflow-hidden">
                      <figure className="image-anime mb-0">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          style={{
                            width: "100%",
                            height: "260px",
                            objectFit: "cover",
                            filter: !user ? "blur(1.5px)" : "none",
                          }}
                        />
                      </figure>
                      {!user && (
                        <Link
                          href={`/login?redirect=/our-team/${doctor.slug}`}
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-decoration-none"
                          style={{ backgroundColor: "rgba(7, 51, 47, 0.4)" }}
                        >
                          <i className="fa-solid fa-lock text-white fs-3 mb-1"></i>
                          <span className="badge bg-dark text-white rounded-pill small">Sign in to view</span>
                        </Link>
                      )}
                      {user && (
                        <div className="team-social-list">
                          <ul>
                            <li><a href="https://www.instagram.com/irajhospitals/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
                            <li><a href={`https://wa.me/919801081080?text=Hello%20IRAJ%20Hospitals,%20I%20would%20like%20to%20consult%20with%20${encodeURIComponent(doctor.name)}`} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a></li>
                            <li><a href="https://www.facebook.com/profile.php?id=61581884108145" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a></li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="team-body p-3">
                      <div className="team-content">
                        <span className="badge px-2 py-1 rounded-pill small mb-1" style={{ backgroundColor: "rgba(56, 211, 159, 0.15)", color: "#07332F" }}>
                          {doctor.role}
                        </span>
                        <h2 className="h5 fw-bold mb-1">
                          {user ? (
                            <Link href={`/our-team/${doctor.slug}`}>{doctor.name}</Link>
                          ) : (
                            <Link href={`/login?redirect=/our-team/${doctor.slug}`}>
                              {doctor.name} <i className="fa-solid fa-lock ms-1 small text-muted"></i>
                            </Link>
                          )}
                        </h2>
                        <p className="small text-muted mb-0">
                          {user ? doctor.bio : "Login to view qualifications & schedule."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Meet Our Team End */}

      {/* Testimonial Section Start */}
      <div className="clients-testimonials">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">TESTIMONIALS</h3>
                <h2 className="text-anime-style-3">What Patients Say About IRAJ Hospitals.</h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="testimonial-slider">
                <div className="row g-4">
                  {testimonials.map((t, idx) => (
                    <div key={idx} className="col-lg-6">
                      <div className="testimonial-item">
                        <div className="testimonial-header">
                          <div className="testimonial-image">
                            <figure className="image-anime">
                              <img src={t.image} alt={t.name} />
                            </figure>
                          </div>
                          <div className="author-content">
                            <div className="author-title">
                              <h3>{t.name}</h3>
                            </div>
                            <div className="testimonial-title">
                              <p>{t.role}</p>
                            </div>
                          </div>
                        </div>
                        <div className="testimonial-rating-list">
                          <ul>
                            {[...Array(5)].map((_, i) => (
                              <li key={i}>
                                <i className="fa-solid fa-star"></i>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="testimonial-content">
                          <p>{t.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial Section End */}

      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/Y-x0efG1seA"
      />
    </>
  );
}
