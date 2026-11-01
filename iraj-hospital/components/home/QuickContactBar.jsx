import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteData";
import { Calendar } from "lucide-react";

export default function QuickContactBar() {
  return (
    <div className="home-contact-us">
      <div className="container">
        <div className="row g-4">
          {/* Card 1: Make Appointment */}
          <div className="col-lg-4 col-md-4">
            <div className="home-contact-item highlighted-box wow fadeInUp h-100" data-wow-delay="0.25s">
              <div className="highlighted-box-title">
                <h2>
                  Don&apos;t <strong>Hesitate </strong>To Contact Us
                </h2>
              </div>
              <div className="appointment-wrap mt-3">
                <Link className="appointment-btn d-inline-flex align-items-center gap-2" href="/appointment">
                  Make Appointment <Calendar size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Family Health */}
          <div className="col-lg-4 col-md-4">
            <div className="home-contact-item box-border wow fadeInUp h-100" data-wow-delay="0.35s">
              <div className="contact-icon mb-3">
                <Image
                  src="/images/icon-home-contact-1.svg"
                  alt="Family Health"
                  width={50}
                  height={50}
                />
              </div>
              <div className="contact-content">
                <h3 className="text-capitalize">Need Family Health</h3>
                <p className="mb-0">
                  We understand the importance of family health and overall well-being for a flourishing life.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: 24 Hours Service */}
          <div className="col-lg-4 col-md-4">
            <div className="home-contact-item wow fadeInUp h-100" data-wow-delay="0.45s">
              <div className="contact-icon mb-3">
                <Image
                  src="/images/icon-home-contact-2.svg"
                  alt="24 Hours Service"
                  width={50}
                  height={50}
                />
              </div>
              <div className="contact-content">
                <h3 className="text-capitalize">24 Hours Emergency</h3>
                <p className="mb-2">
                  Call our emergency hotline <strong>{siteConfig.emergencyPhone}</strong> anytime day or night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
