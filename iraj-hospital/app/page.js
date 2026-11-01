"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VideoModal from "@/components/common/VideoModal";

export default function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    msg: "",
  });

  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "Use the appointment form on our website, call +91 98010 81080, or book instantly on WhatsApp. You'll receive immediate confirmation and token details.",
    },
    {
      q: "Do you provide cashless health insurance?",
      a: "Yes. Major TPAs and health insurers are supported, along with eligible government health schemes. Please carry your ID, insurance card, and policy papers.",
    },
    {
      q: "What are your OPD and Emergency hours?",
      a: "General OPD operates Monday through Saturday from 9:00 AM to 6:00 PM. Emergency, dedicated surgical/medical intensive critical care units, and inpatient services are open 24×7.",
    },
    {
      q: "Do you offer preventive health check packages?",
      a: "Yes, we offer comprehensive preventive health packages tailored by age, gender, and risk profile. Contact our front desk or WhatsApp us for details.",
    },
    {
      q: "Is there a pharmacy and lab on-site?",
      a: "Yes. We have a 24×7 in-house pharmacy stocking 100% genuine medicines and an accredited diagnostics laboratory with rapid test turnaround.",
    },
  ];

  const testimonials = [
    {
      name: "Saul Goodman",
      role: "Patient",
      image: "/images/author-1.jpg",
      stars: 5,
      content:
        "“Clear diagnosis and swift treatment—highly recommend IRAJ Hospitals. The medical team was prompt, compassionate, and attentive throughout my checkup.”",
    },
    {
      name: "Sara Wilsson",
      role: "Patient Attendant",
      image: "/images/author-2.jpg",
      stars: 5,
      content:
        "“Supportive nursing and courteous front-desk—great stay. The dedicated ICU facilities and patient monitoring gave our entire family immense peace of mind.”",
    },
    {
      name: "Jena Karlis",
      role: "Patient",
      image: "/images/author-3.jpg",
      stars: 5,
      content:
        "“Modern facilities, transparent billing—smooth experience. The doctors explained every procedure clearly and took great care of my surgery in the modular OT.”",
    },
    {
      name: "Matt Brandon",
      role: "Patient",
      image: "/images/author-4.jpg",
      stars: 5,
      content:
        "“Doctors explained everything thoroughly and followed up post discharge. Truly compassionate and family-centric healthcare right in Gajuwaka.”",
    },
    {
      name: "John Larson",
      role: "Patient",
      image: "/images/author-1.jpg",
      stars: 5,
      content:
        "“Quick emergency response—grateful to the entire IRAJ team. The 24/7 triage, instant diagnostics, and expert physicians saved crucial time.”",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", date: "", msg: "" });
    }, 5000);
  };

  return (
    <>
      {/* Hero Section Start */}
      <div className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* Hero Content Start */}
              <div className="hero-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                    WELCOME TO IRAJ HOSPITALS
                  </h3>
                  <h1 className="text-anime-style-3">
                    The Care You Can Trust.
                  </h1>
                </div>
                {/* Section Title End */}

                {/* Hero Body Start */}
                <div className="hero-body">
                  <p className="wow fadeInUp">
                    A premier multi-speciality hospital in Gajuwaka, Visakhapatnam with fully-equipped 24/7 Emergency and critical care with advanced laminar flow operation theaters, and compassionate family-centric healthcare.
                  </p>
                </div>
                {/* Hero Body End */}

                {/* Hero Footer Start */}
                <div className="hero-footer">
                  <Link
                    href="/appointment"
                    className="hero-action-btn-primary wow fadeInUp"
                    data-wow-delay="0.25s"
                  >
                    <span>Book Appointment</span>
                    <i className="fa-solid fa-calendar-check ms-1"></i>
                  </Link>
                  <Link
                    href="/about"
                    className="hero-action-btn-secondary wow fadeInUp"
                    data-wow-delay="0.25s"
                  >
                    <span>About IRAJ</span>
                    <i className="fa-solid fa-arrow-right ms-1"></i>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    className="hero-action-btn-video popup-youtube wow fadeInUp"
                    data-wow-delay="0.25s"
                    aria-label="Watch hospital video tour"
                  >
                    <i className="fa-solid fa-circle-play"></i>
                    <span>Watch Tour</span>
                  </button>
                </div>
                {/* Hero Footer End */}
              </div>
              {/* Hero Content End */}
            </div>

            <div className="col-lg-6">
              {/* Hero Image Start */}
              <div className="hero-images">
                <div className="hero-image-1">
                  <figure className="image-anime reveal">
                    <img src="/images/hero-img-1.jpg" alt="IRAJ Hospital Specialist" />
                  </figure>
                </div>
                <div className="hero-image-2">
                  <figure className="image-anime reveal">
                    <img src="/images/hero-img-2.jpg" alt="IRAJ Hospital Healthcare" />
                  </figure>
                </div>
              </div>
              {/* Hero Image End */}
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section End */}

      {/* Contact Us / Highlights Section Start */}
      <div className="home-contact-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4">
              {/* Home Contact Start */}
              <div
                className="home-contact-item highlighted-box wow fadeInUp"
                data-wow-delay="0.25s"
              >
                <div className="highlighted-box-title">
                  <h2>
                    Why Choose <strong>IRAJ Hospitals?</strong>
                  </h2>
                </div>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", marginTop: "10px", lineHeight: "1.6" }}>
                  A premier multi-speciality centre in Gajuwaka with fully-equipped 24/7 Emergency, advanced ICUs, modular OTs, and family-centric care.
                </p>
                <div className="appointment-wrap mt-3">
                  <Link className="appointment-btn" href="/about">
                    Learn More <i className="fa-solid fa-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
              {/* Home Contact End */}
            </div>

            <div className="col-lg-4 col-md-4">
              {/* Home Contact Item Start */}
              <div
                className="home-contact-item box-border wow fadeInUp"
                data-wow-delay="0.25s"
              >
                <div className="contact-icon">
                  <img src="/images/icon-home-contact-1.svg" alt="Emergency Care" />
                </div>
                <div className="contact-content">
                  <h3>Fully Equipped Emergency</h3>
                  <p>
                    24/7 rapid response, resuscitation bays, triage, and immediate emergency diagnostics.
                  </p>
                </div>
              </div>
              {/* Service Item End */}
            </div>

            <div className="col-lg-4 col-md-4">
              {/* Home Contact Item Start */}
              <div
                className="home-contact-item wow fadeInUp"
                data-wow-delay="0.25s"
              >
                <div className="contact-icon">
                  <img src="/images/icon-home-contact-2.svg" alt="ICU & Acute Care" />
                </div>
                <div className="contact-content">
                  <h3>ICU &amp; Acute Medical Care</h3>
                  <p>
                    Comprehensive Surgical ICU + AMCU with advanced monitoring, ventilators, and 24/7 intensivist cover.
                  </p>
                </div>
              </div>
              {/* Service Item End */}
            </div>
          </div>
        </div>
      </div>
      {/* Contact Us / Highlights Section End */}

      {/* About Section Start */}
      <div className="about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* About Image Start */}
              <div className="about-img">
                <div className="about-us-image">
                  <div className="about-us-image-1">
                    <figure className="image-anime reveal">
                      <img src="/images/about-img-1.jpg" alt="About IRAJ Hospital" />
                    </figure>
                  </div>
                  <div className="about-us-image-2">
                    <figure className="image-anime reveal">
                      <img src="/images/about-img-2.jpg" alt="IRAJ Hospital Facilities" />
                    </figure>
                  </div>
                </div>
                <div className="about-video wow fadeInUp">
                  <figure className="image-anime">
                    <img src="/images/about-video-img.jpg" alt="IRAJ Hospital Video" />
                    <button
                      type="button"
                      onClick={() => setIsVideoOpen(true)}
                      className="btn-video popup-youtube"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                      aria-label="Watch video"
                    >
                      <i className="fas fa-play-circle"></i> Watch Video
                    </button>
                  </figure>
                </div>
              </div>
              {/* About Image End */}
            </div>

            <div className="col-lg-6">
              {/* About Content Start */}
              <div className="about-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">ABOUT IRAJ HOSPITALS</h3>
                  <h2 className="text-anime-style-3">
                    Compassionate Care &amp; Clinical Excellence for Every Family.
                  </h2>
                </div>
                {/* Section Title End */}

                {/* About Content Body Start */}
                <div className="about-content-body">
                  <p className="wow fadeInUp">
                    IRAJ Hospital delivers multi-specialty care with a commitment to outcomes, transparency, and patient dignity. Our integrated services cover preventive, acute, and chronic care needs across Gajuwaka and Visakhapatnam.
                  </p>
                </div>
                {/* About Content Body End */}

                {/* About Content Footer Start */}
                <div className="about-content-footer">
                  <ul className="wow fadeInUp" data-wow-delay="0.25s">
                    <li>
                      <strong>Evidence-based protocols:</strong> Standardized clinical pathways that reduce variability and improve recovery.
                    </li>
                    <li>
                      <strong>Modern equipment:</strong> Advanced diagnostics, critical care, and modular laminar operating theatres.
                    </li>
                    <li>
                      <strong>Continuum of care:</strong> From OPD and day-care to in-patient and rehabilitation—under one roof.
                    </li>
                  </ul>
                  <div className="d-flex flex-wrap gap-3 mt-4">
                    <Link
                      href="/about"
                      className="btn-default wow fadeInUp"
                      data-wow-delay="0.5s"
                    >
                      Read More About Us
                    </Link>
                    <Link
                      href="/appointment"
                      className="btn-default wow fadeInUp"
                      data-wow-delay="0.5s"
                      style={{ backgroundColor: "var(--accent-color, #F7A582)", borderColor: "var(--accent-color, #F7A582)", color: "#07332F" }}
                    >
                      Book Consultation
                    </Link>
                  </div>
                </div>
                {/* About Content Footer End */}
              </div>
              {/* About Content End */}
            </div>
          </div>
        </div>
      </div>
      {/* About Section End */}

      {/* Medical Service Section Start */}
      <div className="medical-services">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <div className="medical-service-heading">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">OUR DEPARTMENTS</h3>
                  <h2 className="text-anime-style-3">
                    Comprehensive &amp; Patient-Centric Specialties.
                  </h2>
                </div>
                {/* Section Title End */}
              </div>
            </div>

            <div className="col-lg-4 col-md-4">
              {/* Medical Service Item Start */}
              <div className="medical-service-item wow fadeInUp">
                <div className="medical-service-content">
                  <div className="icon-box">
                    <img src="/images/icon-medical-service-1.svg" alt="General Medicine" />
                  </div>
                  <div className="medical-content">
                    <h3>General Medicine</h3>
                    <p>
                      Primary &amp; complex internal medicine care, diabetes, hypertension, and infectious diseases.
                    </p>
                  </div>
                </div>
                <div className="medical-service-btn">
                  <Link href="/services/general-medicine" className="btn-services">
                    read more <i className="far fa-arrow-alt-circle-right"></i>
                  </Link>
                </div>
              </div>
              {/* Medical Service Item End */}
            </div>

            <div className="col-lg-4 col-md-4">
              {/* Medical Service Item Start */}
              <div
                className="medical-service-item wow fadeInUp"
                data-wow-delay="0.25s"
              >
                <div className="medical-service-content">
                  <div className="icon-box">
                    <img
                      src="/images/icon-medical-service-2.svg"
                      alt="General Surgery"
                    />
                  </div>
                  <div className="medical-content">
                    <h3>General Surgery</h3>
                    <p>
                      Day-care and major laparoscopic surgeries, hernia, GI, and biliary procedures in laminar OTs.
                    </p>
                  </div>
                </div>
                <div className="medical-service-btn">
                  <Link
                    href="/services/general-surgery"
                    className="btn-services"
                  >
                    read more <i className="far fa-arrow-alt-circle-right"></i>
                  </Link>
                </div>
              </div>
              {/* Medical Service Item End */}
            </div>

            <div className="col-lg-4 col-md-4">
              {/* Medical Service Item Start */}
              <div
                className="medical-service-item wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="medical-service-content">
                  <div className="icon-box">
                    <img
                      src="/images/icon-medical-service-4.svg"
                      alt="Pediatrics"
                    />
                  </div>
                  <div className="medical-content">
                    <h3>Pediatrics &amp; Neonatology</h3>
                    <p>
                      Child-centric preventive &amp; acute care, well-child checks, vaccinations, and nutrition.
                    </p>
                  </div>
                </div>
                <div className="medical-service-btn">
                  <Link href="/services/pediatrics" className="btn-services">
                    read more <i className="far fa-arrow-alt-circle-right"></i>
                  </Link>
                </div>
              </div>
              {/* Medical Service Item End */}
            </div>

            <div className="col-lg-4 col-md-4">
              {/* Medical Service Item Start */}
              <div
                className="medical-service-item wow fadeInUp"
                data-wow-delay="0.75s"
              >
                <div className="medical-service-content">
                  <div className="icon-box">
                    <img
                      src="/images/icon-medical-service-3.svg"
                      alt="Orthopedics"
                    />
                  </div>
                  <div className="medical-content">
                    <h3>Orthopedics &amp; Joints</h3>
                    <p>
                      Bone &amp; joint care, trauma, fractures, arthroscopy, joint replacements, and rehab.
                    </p>
                  </div>
                </div>
                <div className="medical-service-btn">
                  <Link
                    href="/services/orthopedics"
                    className="btn-services"
                  >
                    read more <i className="far fa-arrow-alt-circle-right"></i>
                  </Link>
                </div>
              </div>
              {/* Medical Service Item End */}
            </div>

            <div className="col-lg-4 col-md-4">
              {/* Medical Service Item Start */}
              <div
                className="medical-service-item wow fadeInUp"
                data-wow-delay="1s"
              >
                <div className="medical-service-content">
                  <div className="icon-box">
                    <img
                      src="/images/icon-medical-service-5.svg"
                      alt="Cardiology"
                    />
                  </div>
                  <div className="medical-content">
                    <h3>Cardiology &amp; Cardiac Care</h3>
                    <p>
                      Cardiac prevention, non-invasive diagnostics, 2D Echo, TMT, and interventional care.
                    </p>
                  </div>
                </div>
                <div className="medical-service-btn">
                  <Link
                    href="/services/cardiology-clinic"
                    className="btn-services"
                  >
                    read more <i className="far fa-arrow-alt-circle-right"></i>
                  </Link>
                </div>
              </div>
              {/* Medical Service Item End */}
            </div>
          </div>
        </div>
      </div>
      {/* Medical Service Section End */}

      {/* Cta Section Start */}
      <div className="cta-box">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              {/* Cta Item Start */}
              <div className="cta-item">
                <div className="icon-box">
                  <img src="/images/icon-appointment.svg" alt="Appointment" />
                </div>
                <div className="cta-content">
                  <h3 className="text-anime-style-3">
                    Open For Consultations &amp; Emergency 24/7
                  </h3>
                  <p className="wow fadeInUp" data-wow-delay="0.25s">
                    We are dedicated to serving families in Gajuwaka. Schedule a consultation with our experienced specialists or reach our 24/7 emergency hotline.
                  </p>
                </div>
              </div>
              {/* Cta Item End */}
            </div>

            <div className="col-lg-4">
              <div className="cta-btn">
                <Link
                  href="/appointment"
                  className="appointment-btn wow fadeInUp"
                >
                  Book Appointment{" "}
                  <i className="fa-solid fa-calendar-days"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cta Section End */}

      {/* How we Work Section Start */}
      <div className="how-we-work">
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-md-6">
              <div className="section-title">
                <h3 className="wow fadeInUp">CARE PATHWAYS</h3>
                <h2 className="text-anime-style-3">
                  Streamlined, Transparent Healthcare Under One Roof.
                </h2>
              </div>
            </div>

            <div className="col-md-6">
              <div className="section-title-content wow fadeInUp">
                <p>
                  At IRAJ Hospitals, we prioritize patient comfort, dignity, and clinical accuracy from the moment you step through our doors in Gajuwaka.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 col-6">
              <div className="work-step-item wow fadeInUp">
                <div className="icon-box">
                  <img src="/images/icon-work-step-1.svg" alt="Step 1" />
                </div>
                <div className="step-item-content">
                  <h3>1. Book Appointment</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div
                className="work-step-item wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="icon-box">
                  <img src="/images/icon-work-step-2.svg" alt="Step 2" />
                </div>
                <div className="step-item-content">
                  <h3>2. Specialist Checkup</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div
                className="work-step-item wow fadeInUp"
                data-wow-delay="0.75s"
              >
                <div className="icon-box">
                  <img src="/images/icon-work-step-3.svg" alt="Step 3" />
                </div>
                <div className="step-item-content">
                  <h3>3. Evidence-Based Care</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="work-step-item wow fadeInUp" data-wow-delay="1s">
                <div className="icon-box">
                  <img src="/images/icon-work-step-4.svg" alt="Step 4" />
                </div>
                <div className="step-item-content">
                  <h3>4. Recovery &amp; Follow-up</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How we Work Section End */}

      {/* Our Faqs Section Start */}
      <div className="our-faqs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="faq-counter-image">
                <div className="faq-image">
                  <figure className="reveal image-anime">
                    <img src="/images/home-faq-img.jpg" alt="IRAJ Hospitals Facilities" />
                  </figure>
                </div>
                <div className="counter-item">
                  <div className="counter-box-1">
                    <div className="counter-content">
                      <h3>
                        <span className="counter">33</span>+
                      </h3>
                      <p>Specialist Doctors</p>
                    </div>
                  </div>
                  <div className="counter-box-2">
                    <div className="counter-content">
                      <h3>
                        <span className="counter">21</span>+
                      </h3>
                      <p>Clinical Departments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="faqs-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">FREQUENTLY ASKED QUESTIONS</h3>
                  <h2 className="text-anime-style-3">
                    Quick Answers to Common Patient Queries.
                  </h2>
                </div>

                <div className="faq-accordion" id="accordion">
                  {faqs.map((faq, index) => {
                    const isOpen = activeFaq === index;
                    return (
                      <div
                        key={index}
                        className="accordion-item wow fadeInUp"
                        data-wow-delay={`${index * 0.25}s`}
                      >
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                            type="button"
                            onClick={() =>
                              setActiveFaq(isOpen ? null : index)
                            }
                            aria-expanded={isOpen}
                          >
                            {faq.q}
                          </button>
                        </h2>
                        {isOpen && (
                          <div className="accordion-collapse collapse show">
                            <div className="accordion-body">
                              <p>{faq.a}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our Faqs Section End */}

      {/* Testimonial Section Start */}
      <div className="clients-testimonials">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">TESTIMONIALS</h3>
                <h2 className="text-anime-style-3">
                  Real Stories From Our Patients &amp; Families.
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="testimonial-slider">
                <div className="testimonial-item" style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <div className="testimonial-header">
                    <div className="testimonial-image">
                      <figure className="image-anime">
                        <img
                          src={testimonials[activeSlide].image}
                          alt={testimonials[activeSlide].name}
                        />
                      </figure>
                    </div>
                    <div className="author-content">
                      <div className="author-title">
                        <h3>{testimonials[activeSlide].name}</h3>
                      </div>
                      <div className="testimonial-title">
                        <p>{testimonials[activeSlide].role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-rating-list">
                    <ul>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <li key={i}>
                          <i
                            className={
                              i + 1 <= testimonials[activeSlide].stars
                                ? "fa-solid fa-star"
                                : i + 0.5 <= testimonials[activeSlide].stars
                                ? "fa-solid fa-star-half-stroke"
                                : "fa-regular fa-star"
                            }
                          ></i>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="testimonial-content">
                    <p>{testimonials[activeSlide].content}</p>
                  </div>
                </div>

                {/* Slider Pagination Dots */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "25px",
                  }}
                >
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      style={{
                        width: activeSlide === idx ? "24px" : "10px",
                        height: "10px",
                        borderRadius: "5px",
                        backgroundColor:
                          activeSlide === idx ? "var(--accent-color, #F7A582)" : "#ccc",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial Section End */}

      {/* Recent Posts Section Start */}
      <div className="recent-post">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">HEALTH ADVICE &amp; UPDATES</h3>
                <h2 className="text-anime-style-3">Latest Articles &amp; Clinical Insights.</h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="post-item wow fadeInUp" data-wow-delay="0.25s">
                <div className="post-featured-image">
                  <figure className="image-anime">
                    <Link href="/blog/best-medical-network-directory">
                      <img src="/images/post-1.jpg" alt="Cardiovascular Health" />
                    </Link>
                  </figure>
                </div>
                <div className="post-item-body">
                  <h2>
                    <Link href="/blog/best-medical-network-directory">
                      Tips for Maintaining a Healthy Heart &amp; Managing Blood Pressure
                    </Link>
                  </h2>
                  <p>
                    Evidence-based insights into hypertension control, heart-healthy diets, and routine screening.
                  </p>
                </div>
                <div className="btn-readmore">
                  <Link href="/blog/best-medical-network-directory">
                    read more <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="post-item wow fadeInUp" data-wow-delay="0.5s">
                <div className="post-featured-image">
                  <figure className="image-anime">
                    <Link href="/blog/importance-of-regular-health-checkups">
                      <img src="/images/post-2.jpg" alt="Preventive Health" />
                    </Link>
                  </figure>
                </div>
                <div className="post-item-body">
                  <h2>
                    <Link href="/blog/importance-of-regular-health-checkups">
                      The Importance of Regular Preventive Health Checkups
                    </Link>
                  </h2>
                  <p>
                    Early detection of chronic conditions through comprehensive annual clinical screenings.
                  </p>
                </div>
                <div className="btn-readmore">
                  <Link href="/blog/importance-of-regular-health-checkups">
                    read more <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="post-item wow fadeInUp" data-wow-delay="0.75s">
                <div className="post-featured-image">
                  <figure className="image-anime">
                    <Link href="/blog/managing-stress-for-mental-health">
                      <img src="/images/post-3.jpg" alt="Stress & Wellness" />
                    </Link>
                  </figure>
                </div>
                <div className="post-item-body">
                  <h2>
                    <Link href="/blog/managing-stress-for-mental-health">
                      Managing Stress &amp; Fatigue for Holistic Vitality
                    </Link>
                  </h2>
                  <p>
                    Practical, medically-grounded strategies for balanced living and emotional wellness.
                  </p>
                </div>
                <div className="btn-readmore">
                  <Link href="/blog/managing-stress-for-mental-health">
                    read more <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Posts Section End */}

      {/* Footer Contact Form Start */}
      <div className="home-contact-form parallaxie">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">REACH OUT TO US</h3>
                <h2 className="text-anime-style-3">Book An Appointment Or Ask A Question</h2>
              </div>
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-lg-4 col-md-5 col-12">
              <div className="contact-appointment">
                <div className="appointment-img">
                  <img src="/images/contact-us-img.png" alt="Contact IRAJ Hospitals" />
                </div>
                <div className="appointment-content">
                  <h3>
                    Book Your <strong>Consultation</strong> &amp; Experience Care You Can Trust
                  </h3>
                  <p className="mt-2 text-white-50" style={{ fontSize: "13px" }}>
                    Emergency Helpline: +91 98010 81080<br />
                    Gajuwaka, Visakhapatnam
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-md-7 col-12">
              <div className="contact-form">
                <form id="appointmentForm" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Patient Full Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        id="phone"
                        placeholder="WhatsApp Phone Number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        id="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-12 mb-4">
                      <textarea
                        name="msg"
                        className="form-control"
                        id="msg"
                        rows="4"
                        placeholder="Describe symptoms or clinical specialty needed..."
                        value={formData.msg}
                        onChange={(e) =>
                          setFormData({ ...formData, msg: e.target.value })
                        }
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-12 form-group">
                      <button type="submit" className="btn-default">
                        Submit Appointment Request
                      </button>
                      {formSubmitted && (
                        <div
                          className="h3 text-success mt-3"
                          style={{ color: "#28a745", fontSize: "16px", fontWeight: "600" }}
                        >
                          Thank you! Your appointment request has been received. Our reception team will reach you on WhatsApp with your confirmation token.
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Contact Form End */}

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/Y-x0efG1seA"
      />
    </>
  );
}
