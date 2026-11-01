import Image from "next/image";

const steps = [
  {
    number: "01",
    icon: "/images/icon-work-step-1.svg",
    title: "Book An Appointment",
    desc: "Easily schedule your visit online or by phone with your preferred specialist.",
  },
  {
    number: "02",
    icon: "/images/icon-work-step-2.svg",
    title: "Conduct Checkup",
    desc: "Comprehensive diagnostic assessment and consultation with board-certified doctors.",
  },
  {
    number: "03",
    icon: "/images/icon-work-step-3.svg",
    title: "Perform Treatment",
    desc: "Advanced medical care tailored to your specific health requirements.",
  },
  {
    number: "04",
    icon: "/images/icon-work-step-4.svg",
    title: "Prescribe & Follow-up",
    desc: "Digital prescriptions, wellness roadmap, and continuous follow-up care.",
  },
];

export default function ProcessSection() {
  return (
    <div className="how-we-work py-5">
      <div className="container">
        <div className="row section-row align-items-center mb-5">
          <div className="col-md-6">
            <div className="section-title">
              <h3 className="wow fadeInUp text-uppercase text-primary fw-bold small">
                How We Work
              </h3>
              <h2 className="text-anime-style-3 fw-bold">
                A Comprehensive Directory For Your Healthcare.
              </h2>
            </div>
          </div>

          <div className="col-md-6 mt-3 mt-md-0">
            <div className="section-title-content wow fadeInUp text-muted">
              <p className="mb-0">
                We are your trusted healthcare partner. Our streamlined 4-step clinical workflow ensures seamless care from initial consultation to complete recovery and continuous well-being.
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {steps.map((step, idx) => (
            <div key={idx} className="col-lg-3 col-sm-6">
              <div
                className="work-step-item wow fadeInUp h-100 p-4 bg-white rounded-4 shadow-sm border border-light text-center position-relative"
                data-wow-delay={`${0.2 * (idx + 1)}s`}
              >
                <div className="icon-box mb-3 d-inline-flex p-3 bg-light rounded-circle">
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={48}
                    height={48}
                  />
                </div>

                <div className="step-item-content">
                  <h3 className="h6 fw-bold text-capitalize mb-2">{step.title}</h3>
                  <p className="text-muted small mb-0">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
