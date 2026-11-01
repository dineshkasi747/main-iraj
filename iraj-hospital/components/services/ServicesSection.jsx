import Link from "next/link";
import Image from "next/image";
import { servicesData } from "@/data/servicesData";
import { ArrowRight } from "lucide-react";

export default function ServicesSection({ limit = 6, showHeading = true }) {
  const displayServices = limit ? servicesData.slice(0, limit) : servicesData;

  return (
    <div className="medical-services py-5">
      <div className="container">
        {showHeading && (
          <div className="row align-items-end mb-4">
            <div className="col-lg-6 col-md-8">
              <div className="medical-service-heading">
                <div className="section-title">
                  <h3 className="wow fadeInUp text-uppercase text-primary fw-bold small">
                    Medical Services
                  </h3>
                  <h2 className="text-anime-style-3 fw-bold">
                    We&apos;re Providing Best Healthcare Services.
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-4 text-md-end mt-3 mt-md-0">
              <Link href="/services" className="btn-default">
                View All Services
              </Link>
            </div>
          </div>
        )}

        <div className="row g-4">
          {displayServices.map((service, index) => (
            <div key={service.id} className="col-lg-4 col-md-6">
              <div
                className="medical-service-item wow fadeInUp h-100 d-flex flex-column justify-content-between p-4 bg-white rounded-4 shadow-sm border border-light"
                data-wow-delay={`${0.15 * (index + 1)}s`}
                style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
              >
                <div className="medical-service-content">
                  <div className="icon-box mb-3 p-3 bg-light rounded-3 d-inline-block">
                    <Image
                      src={service.homeIcon || service.icon}
                      alt={service.title}
                      width={44}
                      height={44}
                    />
                  </div>

                  <div className="medical-content">
                    <h3 className="h5 fw-bold mb-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-dark text-decoration-none hover-primary"
                      >
                        {service.title}
                      </Link>
                    </h3>
                    <p className="text-muted small mb-0">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="medical-service-btn mt-4 pt-3 border-top">
                  <Link
                    href={`/services/${service.slug}`}
                    className="btn-services d-inline-flex align-items-center gap-2 text-primary fw-semibold text-decoration-none small"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
