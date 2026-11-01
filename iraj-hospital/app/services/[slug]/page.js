"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import VideoModal from "@/components/common/VideoModal";
import { servicesData } from "@/data/servicesData";

export default function ServiceSinglePage({ params }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const rawSlug = params?.slug || "general-medicine";
  const service = servicesData.find(
    (s) => s.slug === rawSlug || s.aliases?.includes(rawSlug)
  ) || {
    id: 99,
    title: rawSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    slug: rawSlug,
    category: "Specialized Medical Care",
    icon: "/images/icon-service-page-1.svg",
    image: "/images/cultuer-1.jpg",
    shortDescription: "Comprehensive clinical care with evidence-based treatment protocols at IRAJ Hospitals.",
    fullDescription: "At IRAJ Hospitals, we provide specialized multidisciplinary medical care designed around patient safety, transparent diagnosis, and rapid recovery in our advanced multi-speciality facility in Gajuwaka.",
    bulletPoints: [
      "Standardized Evidence-Based Treatment Pathways",
      "Round-the-clock Accredited Laboratory & Diagnostics",
      "Experienced Senior Consultants & Surgeons",
      "24/7 Emergency & ICU Critical Care Backup",
      "Patient Dignity & Compassionate Nursing",
    ],
    features: [
      { title: "Evidence-Based Protocols", desc: "Standardized pathways that reduce variability and improve recovery." },
      { title: "Modern Equipment", desc: "Advanced diagnostics, critical care, and modular operating theatres." },
      { title: "Continuum of Care", desc: "From OPD and day-care to in-patient and rehabilitation—under one roof." },
    ],
    faqs: [
      {
        question: "How do I schedule an appointment?",
        answer: "You can book directly via our online form, call +91 98010 81080, or book on WhatsApp for instant confirmation.",
      },
      {
        question: "Do you accept health insurance?",
        answer: "Yes, major private insurers and government health schemes are supported for cashless admissions.",
      },
    ],
  };

  const otherServices = servicesData.filter((s) => s.slug !== service.slug).slice(0, 8);

  return (
    <>
      <PageHeader
        title={service.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      {/* Services Single Section Start */}
      <div className="services-single">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-7">
              <div className="services-single-content">
                <div className="service-featured-image">
                  <div className="service-video">
                    <div className="services-single-image">
                      <figure className="image-anime mb-0">
                        <img
                          src={service.image || "/images/cultuer-1.jpg"}
                          alt={service.title}
                          style={{
                            width: "100%",
                            maxHeight: "480px",
                            objectFit: "cover",
                            borderRadius: "16px",
                          }}
                        />
                      </figure>
                    </div>
                    <div className="services-video-icon">
                      <button
                        type="button"
                        onClick={() => setIsVideoOpen(true)}
                        className="popup-video"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                        aria-label="Play presentation video"
                      >
                        <i className="fa-solid fa-play"></i>
                      </button>
                    </div>
                  </div>

                  <div className="services-video-content wow fadeInUp mt-4">
                    <h3 className="h4 fw-bold mb-3" style={{ color: "#07332F" }}>
                      About The {service.title}
                    </h3>
                    {service.subSpecialties && service.subSpecialties.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {service.subSpecialties.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="badge px-3 py-2 rounded-pill"
                            style={{
                              backgroundColor: "rgba(7, 51, 47, 0.08)",
                              color: "#07332F",
                              fontSize: "13px",
                              fontWeight: "600",
                              border: "1px solid rgba(7, 51, 47, 0.15)",
                            }}
                          >
                            <i className="fa-solid fa-circle-check me-2" style={{ color: "var(--accent-color)" }}></i>
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                    <p>{service.fullDescription}</p>
                    <p className="mt-2 text-muted">{service.shortDescription}</p>
                  </div>
                </div>

                {/* Clinical Capabilities / Bullet Points */}
                <div className="health-care-plans mt-4">
                  <div className="section-title text-start">
                    <h2 className="text-anime-style-3">Clinical Care Highlights.</h2>
                  </div>

                  <div className="health-care-plan-content">
                    <ul className="wow fadeInUp">
                      {service.bulletPoints.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="health-caring-btn wow fadeInUp mt-4"
                    data-wow-delay="0.25s"
                  >
                    <Link href="/appointment" className="btn-default">
                      Book Consultation in {service.title}
                    </Link>
                  </div>
                </div>
                {/* Health Care Plan End */}

                {/* Key Benefits / Department FAQs Start */}
                {service.faqs && service.faqs.length > 0 && (
                  <div className="key-benifits mt-5">
                    <div className="section-title text-start">
                      <h2 className="text-anime-style-3">Department FAQs.</h2>
                    </div>

                    <div className="faq-accordion" id="accordion">
                      {service.faqs.map((faq, index) => {
                        const isOpen = activeFaq === index;
                        return (
                          <div
                            key={index}
                            className="accordion-item wow fadeInUp"
                            data-wow-delay={`${index * 0.15}s`}
                          >
                            <h2 className="accordion-header">
                              <button
                                className={`accordion-button ${
                                  isOpen ? "" : "collapsed"
                                }`}
                                type="button"
                                onClick={() =>
                                  setActiveFaq(isOpen ? null : index)
                                }
                                aria-expanded={isOpen}
                              >
                                {faq.question}
                              </button>
                            </h2>
                            {isOpen && (
                              <div className="accordion-collapse collapse show">
                                <div className="accordion-body">
                                  <p>{faq.answer}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Key Benefits End */}
              </div>
            </div>

            <div className="col-lg-4 col-md-5">
              {/* Service Side Bar Start */}
              <div className="services-sidebar">
                {service.cardImage && (
                  <div
                    className="p-3 rounded-4 mb-4 text-center shadow-sm wow fadeInUp"
                    style={{
                      background: "linear-gradient(135deg, rgba(7, 51, 47, 0.04) 0%, rgba(247, 165, 130, 0.08) 100%)",
                      border: "1px solid rgba(7, 51, 47, 0.12)",
                    }}
                  >
                    <span
                      className="badge mb-3 px-3 py-1 rounded-pill"
                      style={{
                        backgroundColor: "#07332F",
                        color: "var(--accent-color, #F7A582)",
                        fontSize: "11px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      Specialty Clinical Profile
                    </span>
                    <div className="overflow-hidden rounded-3 shadow-sm mx-auto" style={{ maxWidth: "230px" }}>
                      <img
                        src={service.cardImage}
                        alt={`${service.title} Specialty Profile`}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  </div>
                )}

                <div className="medical-service wow fadeInUp">
                  <div className="medical-service-title">
                    <h2>IRAJ Specialties</h2>
                  </div>

                  <div className="medical-service-list">
                    <ul>
                      {otherServices.map((item, idx) => (
                        <li key={idx}>
                          <div className="service-item">
                            <div className="service-icon">
                              <img src={item.icon || "/images/icon-service-single-medical-1.svg"} alt={item.title} />
                            </div>
                            <div className="service-title">
                              <h3>
                                <Link href={`/services/${item.slug}`}>
                                  {item.title}
                                </Link>
                              </h3>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-btn">
                    <Link href="/services" className="btn-default">
                      View All Departments
                    </Link>
                  </div>
                </div>

                {/* Emergency Card in Sidebar */}
                <div
                  className="p-4 rounded-4 mt-4 text-white text-center shadow-sm"
                  style={{ backgroundColor: "#07332F" }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: "50px", height: "50px", backgroundColor: "rgba(247, 165, 130, 0.2)", color: "var(--accent-color, #F7A582)" }}
                  >
                    <i className="fa-solid fa-phone-volume fs-4"></i>
                  </div>
                  <h4 className="fw-bold mb-1">Need Immediate Care?</h4>
                  <p className="text-white-50 small mb-3">
                    24/7 Emergency, SICU, AMCU &amp; Ambulance support in Gajuwaka.
                  </p>
                  <a
                    href="tel:+919801081080"
                    className="btn btn-sm btn-light fw-bold px-3 py-2 w-100"
                    style={{ color: "#07332F" }}
                  >
                    Call: +91 98010 81080
                  </a>
                </div>
              </div>
              {/* Service Side Bar End */}
            </div>
          </div>
        </div>
      </div>
      {/* Services Single Section End */}

      {/* Our Working Best Section Start */}
      <div className="working-step">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center">
                <h3 className="wow fadeInUp">CARE PATHWAYS</h3>
                <h2 className="text-anime-style-3">
                  Our Coordinated Patient Care Process.
                </h2>
              </div>
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-md-6 order-lg-1 order-md-1 order-1">
              <div className="working-process-item wow fadeInUp">
                <div className="icon-box">
                  <img src="/images/icon-working-process-1.svg" alt="Step 1" />
                </div>
                <div className="working-process-content">
                  <h3>1. Consultation &amp; Triage</h3>
                  <p>
                    Thorough clinical assessment by specialist doctors with zero delay.
                  </p>
                </div>
                <div className="working-process-step">
                  <h2>01</h2>
                </div>
              </div>
            </div>

            <div className="col-md-6 order-lg-2 order-md-2 order-2">
              <div
                className="working-process-item bg-color wow fadeInUp"
                data-wow-delay="0.25s"
              >
                <div className="icon-box">
                  <img src="/images/icon-working-process-2.svg" alt="Step 2" />
                </div>
                <div className="working-process-content">
                  <h3>2. Rapid Diagnostic Testing</h3>
                  <p>
                    Same-day lab tests and non-invasive imaging in accredited in-house facilities.
                  </p>
                </div>
                <div className="working-process-step">
                  <h2>02</h2>
                </div>
              </div>
            </div>

            <div className="col-md-6 order-lg-3 order-md-3 order-4">
              <div
                className="working-process-item bg-color wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="icon-box">
                  <img src="/images/icon-working-process-3.svg" alt="Step 3" />
                </div>
                <div className="working-process-content">
                  <h3>3. Evidence-Based Treatment</h3>
                  <p>
                    Personalized medical therapy, modular OT surgery, or ICU monitoring.
                  </p>
                </div>
                <div className="working-process-step">
                  <h2>03</h2>
                </div>
              </div>
            </div>

            <div className="col-md-6 order-lg-4 order-md-4 order-3">
              <div
                className="working-process-item wow fadeInUp"
                data-wow-delay="0.75s"
              >
                <div className="icon-box">
                  <img src="/images/icon-working-process-4.svg" alt="Step 4" />
                </div>
                <div className="working-process-content">
                  <h3>4. Post-Care &amp; Rehabilitation</h3>
                  <p>
                    Dedicated post-discharge follow-ups and personalized physiotherapy.
                  </p>
                </div>
                <div className="working-process-step">
                  <h2>04</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our Working Best Section End */}

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/Y-x0efG1seA"
      />
    </>
  );
}
