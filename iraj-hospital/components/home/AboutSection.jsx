"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import VideoModal from "@/components/common/VideoModal";
import { Play, CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <div className="about-us py-5">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Col: Images & Video Card */}
            <div className="col-lg-6">
              <div className="about-img position-relative">
                <div className="about-us-image d-flex gap-3 mb-4">
                  <div className="about-us-image-1">
                    <figure className="image-anime reveal mb-0">
                      <Image
                        src="/images/about-img-1.jpg"
                        alt="Medical team"
                        width={280}
                        height={340}
                        className="rounded-4 img-fluid shadow-sm"
                      />
                    </figure>
                  </div>
                  <div className="about-us-image-2">
                    <figure className="image-anime reveal mb-0">
                      <Image
                        src="/images/about-img-2.jpg"
                        alt="Modern medical diagnostic"
                        width={280}
                        height={340}
                        className="rounded-4 img-fluid shadow-sm"
                      />
                    </figure>
                  </div>
                </div>

                <div className="about-video wow fadeInUp position-relative">
                  <figure className="image-anime mb-0 position-relative rounded-4 overflow-hidden">
                    <Image
                      src="/images/about-video-img.jpg"
                      alt="Hospital care video"
                      width={580}
                      height={240}
                      className="img-fluid w-100 object-fit-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setVideoOpen(true)}
                      className="btn-video position-absolute top-50 start-50 translate-middle border-0 bg-transparent text-white"
                      style={{ cursor: "pointer" }}
                    >
                      <span className="d-inline-flex align-items-center gap-2 bg-dark bg-opacity-75 px-4 py-2 rounded-pill shadow">
                        <Play size={20} className="text-primary fill-primary" /> Watch Facility Tour
                      </span>
                    </button>
                  </figure>
                </div>
              </div>
            </div>

            {/* Right Col: About Content */}
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="about-content ps-lg-4">
                <div className="section-title mb-3">
                  <h3 className="wow fadeInUp text-uppercase text-primary fw-bold small">
                    About IRAJ Hospital
                  </h3>
                  <h2 className="text-anime-style-3 fw-bold">
                    Our Best Services & Popular Treatments Here.
                  </h2>
                </div>

                <div className="about-content-body mb-4">
                  <p className="wow fadeInUp text-muted">
                    We take immense pride in offering a wide range of best-in-class medical services and clinical treatments tailored to cater to your family&apos;s diverse healthcare needs with empathy and modern technology.
                  </p>
                </div>

                <div className="about-content-footer">
                  <ul className="wow fadeInUp list-unstyled mb-4 d-flex flex-column gap-2" data-wow-delay="0.25s">
                    <li className="d-flex align-items-center gap-2 text-dark fw-medium">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                      Comprehensive mental health & rehabilitation solutions
                    </li>
                    <li className="d-flex align-items-center gap-2 text-dark fw-medium">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                      Rapid patient recovery & minimal invasiveness protocols
                    </li>
                    <li className="d-flex align-items-center gap-2 text-dark fw-medium">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                      World-class diagnostic laboratory and surgical suites
                    </li>
                  </ul>

                  <div className="d-flex align-items-center gap-4">
                    <Link href="/about" className="btn-default wow fadeInUp" data-wow-delay="0.5s">
                      Read More About Us
                    </Link>
                    <Image
                      src="/images/signature.png"
                      alt="Chief Medical Officer Signature"
                      width={120}
                      height={45}
                      className="opacity-75"
                    />
                  </div>
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
