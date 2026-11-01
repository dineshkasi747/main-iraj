"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function DoctorCard({ doctor, delay = "0.2s" }) {
  const { user } = useAuth();

  return (
    <div
      className="team-member-item wow fadeInUp h-100 bg-white rounded-4 overflow-hidden shadow-sm border border-light"
      data-wow-delay={delay}
    >
      <div className="team-image position-relative overflow-hidden">
        <figure className="image-anime mb-0">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={400}
            height={420}
            className="img-fluid w-100 object-fit-cover"
            style={{ filter: !user ? "blur(2px)" : "none" }}
          />
        </figure>

        {!user ? (
          <Link
            href={`/login?redirect=/our-team/${doctor.slug}`}
            className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-decoration-none"
            style={{ backgroundColor: "rgba(7, 51, 47, 0.45)" }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-2"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#F7A582",
                color: "#07332F",
                fontSize: "18px",
              }}
            >
              <i className="fa-solid fa-lock"></i>
            </div>
            <span className="badge bg-dark text-white rounded-pill px-3 py-1 small fw-semibold shadow-sm">
              Sign In to View
            </span>
          </Link>
        ) : (
          /* Social Icons Overlay */
          <div className="team-social-icon position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-50 d-flex justify-content-center gap-3">
            {doctor.social?.twitter && (
              <a href={doctor.social.twitter} className="text-white hover-primary" aria-label="Twitter">
                <i className="fa-brands fa-twitter"></i>
              </a>
            )}
            {doctor.social?.facebook && (
              <a href={doctor.social.facebook} className="text-white hover-primary" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            )}
            {doctor.social?.instagram && (
              <a href={doctor.social.instagram} className="text-white hover-primary" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
            )}
            {doctor.social?.linkedin && (
              <a href={doctor.social.linkedin} className="text-white hover-primary" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            )}
          </div>
        )}
      </div>

      <div className="team-body p-4 text-center">
        <h3 className="h5 fw-bold mb-1">
          {user ? (
            <Link
              href={`/our-team/${doctor.slug}`}
              className="text-dark text-decoration-none hover-primary"
            >
              {doctor.name}
            </Link>
          ) : (
            <Link
              href={`/login?redirect=/our-team/${doctor.slug}`}
              className="text-dark text-decoration-none hover-primary"
            >
              {doctor.name} <i className="fa-solid fa-lock ms-1 small text-muted"></i>
            </Link>
          )}
        </h3>
        <p className="text-primary fw-medium small mb-2">{doctor.role}</p>
        <p className="text-muted small mb-0 line-clamp-2">
          {user ? doctor.bio : "Locked profile. Please sign in to view qualifications & booking."}
        </p>
      </div>
    </div>
  );
}
