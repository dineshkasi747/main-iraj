import Link from "next/link";
import { doctorsData } from "@/data/doctorsData";
import DoctorCard from "./DoctorCard";

export default function SpecialistsSection({
  limit = 4,
  showHeading = true,
  title = "Our Medical Specialists",
  subtitle = "Our Dedicated Doctors",
}) {
  const displayDoctors = limit ? doctorsData.slice(0, limit) : doctorsData;

  return (
    <div className="our-team py-5 bg-light">
      <div className="container">
        {showHeading && (
          <div className="row align-items-end mb-4">
            <div className="col-lg-7 col-md-8">
              <div className="section-title">
                <h3 className="wow fadeInUp text-uppercase text-primary fw-bold small">
                  {subtitle}
                </h3>
                <h2 className="text-anime-style-3 fw-bold">
                  {title}
                </h2>
              </div>
            </div>
            <div className="col-lg-5 col-md-4 text-md-end mt-3 mt-md-0">
              <Link href="/our-team" className="btn-default">
                View All Doctors
              </Link>
            </div>
          </div>
        )}

        <div className="row g-4">
          {displayDoctors.map((doctor, index) => (
            <div key={doctor.id} className="col-lg-3 col-md-6">
              <DoctorCard doctor={doctor} delay={`${0.15 * (index + 1)}s`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
