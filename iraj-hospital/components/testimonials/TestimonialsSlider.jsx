"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { testimonialsData } from "@/data/testimonialsData";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonialsData[currentIndex];

  return (
    <div className="clients-testimonials py-5 bg-light position-relative">
      <div className="container">
        <div className="row section-row mb-4 align-items-end">
          <div className="col-lg-8 col-md-8">
            <div className="section-title">
              <h3 className="wow fadeInUp text-uppercase text-primary fw-bold small">
                Testimonials
              </h3>
              <h2 className="text-anime-style-3 fw-bold">
                What Patients Say About IRAJ Hospital.
              </h2>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 text-md-end d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
            <button
              onClick={prevSlide}
              className="btn btn-outline-primary rounded-circle p-2 d-inline-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="btn btn-primary rounded-circle p-2 d-inline-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonial Active Slide */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="testimonial-card-interactive p-4 p-md-5 bg-white rounded-4 shadow-sm border border-light position-relative">
              <Quote
                size={60}
                className="position-absolute top-0 end-0 m-4 text-primary opacity-10"
              />

              <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
                <div className="testimonial-image flex-shrink-0">
                  <Image
                    src={current.avatar}
                    alt={current.name}
                    width={80}
                    height={80}
                    className="rounded-circle object-fit-cover shadow-sm border border-2 border-primary"
                  />
                </div>
                <div className="author-content text-center text-md-start">
                  <h3 className="h5 fw-bold mb-1">{current.name}</h3>
                  <p className="text-muted small mb-1">{current.role}</p>
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-1 text-warning">
                    {[...Array(current.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="testimonial-content">
                <p className="lead text-dark fst-italic mb-0">
                  &ldquo;{current.text}&rdquo;
                </p>
              </div>

              {/* Dots navigation */}
              <div className="d-flex justify-content-center gap-2 mt-4">
                {testimonialsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className="border-0 rounded-pill transition-all"
                    style={{
                      width: idx === currentIndex ? "24px" : "8px",
                      height: "8px",
                      backgroundColor: idx === currentIndex ? "#0077b6" : "#cbd5e1",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
