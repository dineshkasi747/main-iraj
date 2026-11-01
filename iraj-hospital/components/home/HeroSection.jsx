"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import VideoModal from "@/components/common/VideoModal";
import { Play } from "lucide-react";

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">We Care For Your Health</h3>
                  <h1 className="text-anime-style-3">
                    We Are Providing Best & Affordable Health Care.
                  </h1>
                </div>

                <div className="hero-body">
                  <p className="wow fadeInUp">
                    Our mission is to deliver the highest quality healthcare services with compassion and precision. We believe everyone deserves access to world-class medical care with state-of-the-art diagnostic technology and expert doctors.
                  </p>
                </div>

                <div className="hero-footer d-flex flex-wrap align-items-center gap-3">
                  <Link href="/appointment" className="btn-default wow fadeInUp">
                    Book Appointment
                  </Link>
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    className="btn-video wow fadeInUp border-0 bg-transparent"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="d-inline-flex align-items-center gap-2">
                      <Play size={20} className="text-primary fill-primary" /> Watch Video Tour
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="hero-images">
                <div className="hero-image-1">
                  <figure className="image-anime reveal mb-0">
                    <Image
                      src="/images/hero-img-1.jpg"
                      alt="Doctor Consultation"
                      width={380}
                      height={460}
                      className="img-fluid rounded-4 shadow"
                      priority
                    />
                  </figure>
                </div>
                <div className="hero-image-2">
                  <figure className="image-anime reveal mb-0">
                    <Image
                      src="/images/hero-img-2.jpg"
                      alt="Modern Clinic"
                      width={320}
                      height={390}
                      className="img-fluid rounded-4 shadow"
                      priority
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/Y-x0efG1seA"
      />
    </>
  );
}
