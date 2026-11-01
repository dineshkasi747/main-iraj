import Link from "next/link";
import Image from "next/image";
import { Calendar, Award, ShieldCheck, HeartPulse, Stethoscope } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <>
      {/* CTA Box */}
      <div className="cta-box py-5 my-4">
        <div className="container">
          <div className="row align-items-center bg-primary text-white p-4 p-md-5 rounded-4 shadow">
            <div className="col-lg-8">
              <div className="cta-item d-flex flex-column flex-md-row align-items-center gap-4 text-center text-md-start">
                <div className="icon-box p-3 bg-white bg-opacity-20 rounded-circle flex-shrink-0">
                  <Image
                    src="/images/icon-appointment.svg"
                    alt="Appointment"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="cta-content">
                  <h3 className="h2 fw-bold text-white mb-2">Open For Appointments</h3>
                  <p className="text-white-50 mb-0">
                    We are delighted to welcome you. Book your consultation today and take the first step towards better health and vitality.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
              <Link
                href="/appointment"
                className="btn btn-light btn-lg px-4 py-3 fw-bold text-primary shadow-sm d-inline-flex align-items-center gap-2"
                style={{ borderRadius: "10px" }}
              >
                Make Appointment <Calendar size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Feature Row */}
      <div className="why-choose-us py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <div className="section-title">
                <h3 className="text-uppercase text-primary fw-bold small">Why Choose IRAJ Hospital</h3>
                <h2 className="fw-bold">Committed to Clinical Excellence & Patient Wellness</h2>
                <p className="text-muted mt-2">
                  We combine world-class medical expertise with cutting-edge medical technology to deliver unmatched patient care.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border border-light text-center">
                <div className="mb-3 d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                  <Award size={36} />
                </div>
                <h3 className="h6 fw-bold mb-2">Certified Specialists</h3>
                <p className="text-muted small mb-0">
                  Board-certified doctors with decades of international clinical experience.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border border-light text-center">
                <div className="mb-3 d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                  <Stethoscope size={36} />
                </div>
                <h3 className="h6 fw-bold mb-2">Modern Diagnostic Labs</h3>
                <p className="text-muted small mb-0">
                  Fully automated high-throughput diagnostics ensuring rapid and accurate test results.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border border-light text-center">
                <div className="mb-3 d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                  <ShieldCheck size={36} />
                </div>
                <h3 className="h6 fw-bold mb-2">24/7 Emergency Care</h3>
                <p className="text-muted small mb-0">
                  Round-the-clock emergency response, ICU telemetry, and critical trauma care.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 border border-light text-center">
                <div className="mb-3 d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                  <HeartPulse size={36} />
                </div>
                <h3 className="h6 fw-bold mb-2">Patient-First Care</h3>
                <p className="text-muted small mb-0">
                  Compassionate care pathways designed for rapid recovery and minimal stress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
