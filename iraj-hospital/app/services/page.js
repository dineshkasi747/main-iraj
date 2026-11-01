import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import { servicesData } from "@/data/servicesData";
import { doctorsData } from "@/data/doctorsData";

export const metadata = {
  title: "Clinical Departments & Services | IRAJ Hospitals Gajuwaka",
  description:
    "Explore 15+ comprehensive multi-specialty clinical departments at IRAJ Hospitals in Gajuwaka: Emergency Medicine, ICUs, Internal Medicine, Pediatrics, Ob/Gyn, Surgery, Orthopaedics, ENT, Pulmonology, Neuro, Cardiology, Gastro, and more.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Subpage Hero Section Start */}
      <PageHeader
        title="Departments &amp; Services"
        breadcrumbs={[{ label: "Services" }]}
      />
      {/* Subpage Hero Section End */}

      {/* Our Services Section Start */}
      <div className="our-services">
        <div className="container">
          <div className="row section-row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">OUR SPECIALTIES</h3>
                <h2 className="text-anime-style-3">Comprehensive, Coordinated Healthcare Under One Roof.</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {servicesData.map((srv, idx) => (
              <div key={srv.id} className="col-lg-4 col-md-6 col-12 mb-4">
                <div
                  className="our-services-item wow fadeInUp h-100 d-flex flex-column justify-content-between"
                  data-wow-delay={`${(idx % 3) * 0.15}s`}
                >
                  <div>
                    <div className="service-item-image d-flex align-items-center justify-content-between mb-3">
                      <img src={srv.icon} alt={srv.title} />
                      <span
                        className="badge px-3 py-1 rounded-pill"
                        style={{
                          backgroundColor: "rgba(247, 165, 130, 0.15)",
                          color: "var(--accent-color)",
                          border: "1px solid rgba(247, 165, 130, 0.3)",
                          fontSize: "12px",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                        }}
                      >
                        DEPT {String(srv.id).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="services-item-content">
                      <h3 style={{ minHeight: "56px" }}>{srv.title}</h3>
                      <p>{srv.shortDescription}</p>
                      <ul>
                        {(srv.subSpecialties && srv.subSpecialties.length > 0
                          ? srv.subSpecialties
                          : srv.bulletPoints.slice(0, 3)
                        ).map((it, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: "12px", fontSize: "16px" }}>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="services-item-btn mt-3">
                    <Link href={`/services/${srv.slug}`} className="btn-default">
                      Explore Department
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Our Services Section End */}

      {/* Services Specialist Section Start */}
      <div className="service-specialist">
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-md-6">
              <div className="section-title">
                <h3 className="wow fadeInUp">WHY IRAJ HOSPITALS</h3>
                <h2 className="text-anime-style-3">Advanced Clinical Facilities in Gajuwaka.</h2>
              </div>
            </div>
            <div className="col-md-6">
              <div className="section-title-content">
                <p className="wow fadeInUp">
                  From emergency resuscitation and dedicated surgical/medical intensive critical care units to modular laminar operating theatres, we provide dependable, family-centric healthcare.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 col-6">
              <div className="specialist-item wow fadeInUp">
                <div className="icon-box">
                  <img src="/images/icon-specialist-1.svg" alt="Cardiology" />
                </div>
                <div className="specialist-content">
                  <h3>Cardiology</h3>
                  <Link href="/services/cardiac-heart-sciences"><i className="fas fa-arrow-alt-circle-right"></i></Link>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="specialist-item wow fadeInUp" data-wow-delay="0.25s">
                <div className="icon-box">
                  <img src="/images/icon-specialist-2.svg" alt="Surgery" />
                </div>
                <div className="specialist-content">
                  <h3>General Surgery</h3>
                  <Link href="/services/general-surgery"><i className="fas fa-arrow-alt-circle-right"></i></Link>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="specialist-item wow fadeInUp" data-wow-delay="0.5s">
                <div className="icon-box">
                  <img src="/images/icon-specialist-3.svg" alt="Pediatrics" />
                </div>
                <div className="specialist-content">
                  <h3>Pediatrics</h3>
                  <Link href="/services/pediatrics-child-health"><i className="fas fa-arrow-alt-circle-right"></i></Link>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="specialist-item wow fadeInUp" data-wow-delay="0.75s">
                <div className="icon-box">
                  <img src="/images/icon-specialist-4.svg" alt="Orthopedics" />
                </div>
                <div className="specialist-content">
                  <h3>Orthopedics</h3>
                  <Link href="/services/orthopaedics"><i className="fas fa-arrow-alt-circle-right"></i></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Services Specialist Section End */}

      {/* Meet Our Team Start */}
      <div className="meet-our-team service-team">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12">
              <div className="section-title">
                <h3 className="wow fadeInUp">DOCTORS ON DUTY</h3>
                <h2 className="text-anime-style-3">Meet Our Medical Team.</h2>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {doctorsData.slice(0, 4).map((doc, idx) => (
              <div key={doc.id} className="col-lg-3 col-md-6">
                <div className="team-member-item wow fadeInUp h-100 d-flex flex-column justify-content-between" data-wow-delay={`${idx * 0.2}s`}>
                  <div>
                    <div className="team-image position-relative overflow-hidden">
                      <figure className="image-anime mb-0">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          style={{
                            width: "100%",
                            height: "260px",
                            objectFit: "cover",
                          }}
                        />
                      </figure>
                      <div className="team-social-list">
                        <ul>
                          <li><a href="https://www.instagram.com/irajhospitals/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
                          <li><a href={`https://wa.me/919801081080?text=Hello%20IRAJ%20Hospitals,%20I%20would%20like%20to%20consult%20with%20${encodeURIComponent(doc.name)}`} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a></li>
                          <li><a href="https://www.facebook.com/profile.php?id=61581884108145" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="team-body p-3">
                      <div className="team-content">
                        <span className="badge px-2 py-1 rounded-pill small mb-1" style={{ backgroundColor: "rgba(56, 211, 159, 0.15)", color: "#07332F" }}>
                          {doc.role}
                        </span>
                        <h2 className="h5 fw-bold mb-1">
                          <Link href={`/our-team/${doc.slug}`}>{doc.name}</Link>
                        </h2>
                        <p className="small text-muted mb-0">{doc.bio}</p>
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
    </>
  );
}
