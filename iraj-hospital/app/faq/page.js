"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";

export default function FaqPage() {
  const [activeFaq1, setActiveFaq1] = useState(0);
  const [activeFaq2, setActiveFaq2] = useState(0);

  const col1Faqs = [
    {
      q: "How do I book an appointment at IRAJ Hospitals?",
      a: "Use our online appointment form, call our hospital helpline at +91 98010 81080, or book instantly on WhatsApp. You'll receive an instant confirmation and token reminder.",
    },
    {
      q: "Do you provide cashless health insurance?",
      a: "Yes. IRAJ Hospitals supports major TPAs, private health insurers, and eligible government schemes. Please bring your government photo ID, health insurance policy card, and pre-authorization documents.",
    },
    {
      q: "What are the OPD and Emergency hours?",
      a: "General outpatient (OPD) clinics run Monday through Saturday from 9:00 AM to 6:00 PM. Emergency, Trauma, dedicated surgical/medical intensive critical care units, and inpatient care operate 24 hours a day, 7 days a week.",
    },
    {
      q: "Do you offer preventive health check packages?",
      a: "Yes. We offer preventive health packages tailored by age, gender, and clinical risk profile (Master Health, Cardiac Wellness, Diabetic Screening, Women's Health). Contact our front desk for details.",
    },
  ];

  const col2Faqs = [
    {
      q: "Is there an in-house pharmacy and laboratory on-site?",
      a: "Yes. We have a 24×7 in-house pharmacy dispensing 100% genuine medicines and an accredited diagnostics laboratory with automated analyzers for rapid turnaround times.",
    },
    {
      q: "What critical care and ICU facilities do you have?",
      a: "IRAJ Hospital is an advanced multi-speciality facility in Gajuwaka featuring dedicated surgical/medical intensive critical care units and neonatal intensive critical care unit with advanced equipment.",
    },
    {
      q: "What surgical operations are performed at IRAJ Hospital?",
      a: "We perform laparoscopic (minimally invasive) procedures, general surgeries, orthopedic joint replacements, trauma care, ENT surgeries, and gynecological operations in modular laminar airflow OTs.",
    },
    {
      q: "Where is IRAJ Hospital located?",
      a: "We are located at 26-4-9/1, Opp. Veerabhadra Transport, Near Jug Junction, Gajuwaka, Visakhapatnam, Andhra Pradesh. For directions or emergency transport, call +91 98010 81080.",
    },
  ];

  return (
    <>
      <PageHeader
        title="Help &amp; FAQs"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQs" },
        ]}
      />

      {/* FAQS Section Start */}
      <div className="faqs-page">
        <div className="container">
          <div className="row section-row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <div className="section-title">
                <h3 className="wow fadeInUp">FREQUENTLY ASKED QUESTIONS</h3>
                <h2 className="text-anime-style-3">Quick Answers to Common Queries.</h2>
                <p className="wow fadeInUp text-muted mt-2">
                  Everything you need to know about our medical services, appointments, insurance empanelment, and emergency care at IRAJ Hospitals.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="faq-accordion" id="accordion1">
                {col1Faqs.map((faq, index) => {
                  const isOpen = activeFaq1 === index;
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
                            setActiveFaq1(isOpen ? null : index)
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

            <div className="col-lg-6 col-md-12">
              <div className="faq-accordion" id="accordion2">
                {col2Faqs.map((faq, index) => {
                  const isOpen = activeFaq2 === index;
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
                            setActiveFaq2(isOpen ? null : index)
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
      {/* FAQS Section End */}
    </>
  );
}
