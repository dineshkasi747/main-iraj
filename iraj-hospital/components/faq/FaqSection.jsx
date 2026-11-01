import Image from "next/image";
import Link from "next/link";
import { faqsData } from "@/data/faqsData";
import FaqAccordion from "./FaqAccordion";

export default function FaqSection({ limit = 4, showImage = true }) {
  const displayFaqs = limit ? faqsData.slice(0, limit) : faqsData;

  return (
    <div className="our-faqs py-5">
      <div className="container">
        <div className="row align-items-center">
          {showImage && (
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="faq-counter-image position-relative">
                <div className="faq-image position-relative overflow-hidden rounded-4 shadow">
                  <figure className="reveal image-anime mb-0">
                    <Image
                      src="/images/home-faq-img.jpg"
                      alt="Doctor Consultation FAQs"
                      width={520}
                      height={480}
                      className="img-fluid w-100 object-fit-cover"
                    />
                  </figure>
                </div>

                {/* Counter Overlays */}
                <div className="counter-item position-absolute bottom-0 end-0 m-4 d-flex gap-3">
                  <div className="counter-box-1 bg-white p-3 rounded-4 shadow text-center border-start border-4 border-primary">
                    <div className="counter-content">
                      <h3 className="h4 fw-bold text-primary mb-0">100+</h3>
                      <p className="small text-muted mb-0 text-uppercase fw-semibold">Doctors</p>
                    </div>
                  </div>

                  <div className="counter-box-2 bg-white p-3 rounded-4 shadow text-center border-start border-4 border-info">
                    <div className="counter-content">
                      <h3 className="h4 fw-bold text-info mb-0">16+</h3>
                      <p className="small text-muted mb-0 text-uppercase fw-semibold">Offices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={showImage ? "col-lg-6" : "col-lg-12"}>
            <div className="faqs-content ps-lg-3">
              <div className="section-title mb-4">
                <h3 className="wow fadeInUp text-uppercase text-primary fw-bold small">
                  Frequently Asked Questions
                </h3>
                <h2 className="text-anime-style-3 fw-bold">
                  Consultations with Qualified Doctors.
                </h2>
              </div>

              <FaqAccordion items={displayFaqs} />

              <div className="mt-4">
                <Link href="/faq" className="btn-default">
                  View All FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
