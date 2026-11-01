"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    msg: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", msg: "" });
    }, 5000);
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      {/* Google Map starts */}
      <div className="google-map">
        <div className="container-fluid">
          <div className="row no-gutters">
            <div className="col-md-12">
              <div className="google-map-iframe">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.378943801648!2d83.21448557593645!3d17.680608794356456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39686df731f82b%3A0xe9f75a7c2b3e8ad6!2sGajuwaka%2C%20Visakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="IRAJ Hospital Location Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Google Map Ends */}

      {/* Contact Infomation start */}
      <div className="contact-information wow fadeInUp" data-wow-delay="0.25s">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="contact-item">
                <div className="icon-box">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="contact-info-content">
                  <h3>Hospital Helpline</h3>
                  <p>
                    <a href="tel:+919801081080" className="text-decoration-none text-reset">
                      +91 98010 81080
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-item">
                <div className="icon-box">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-info-content">
                  <h3>Hospital Location</h3>
                  <p>26-4-9/1, Near Jug Junction, Gajuwaka</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-item">
                <div className="icon-box">
                  <i className="fas fa-envelope-open-text"></i>
                </div>
                <div className="contact-info-content">
                  <h3>Email Address</h3>
                  <p>
                    <a href="mailto:help@irajhospitals.com" className="text-decoration-none text-reset">
                      help@irajhospitals.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Infomation End */}

      {/* Contact Form start */}
      <div className="page-contact-form">
        <div className="container">
          <div className="row section-row text-center mb-4">
            <div className="col-lg-8 mx-auto">
              <div className="section-title">
                <h3 className="wow fadeInUp">GET IN TOUCH</h3>
                <h2 className="text-anime-style-3">We&apos;re Here To Help—Reach Us Anytime</h2>
                <p className="text-muted mt-2">
                  Have a question about admissions, doctors, or healthcare packages? Send us a message or contact us on WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="contact-us-form wow fadeInUp" data-wow-delay="0.5s">
                <form id="contactForm" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Enter Your Full Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Your Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        id="phone"
                        placeholder="WhatsApp Phone Number (+91 ...)"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        id="subject"
                        placeholder="Department or Subject of Enquiry"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group col-md-12 mb-4">
                      <textarea
                        name="msg"
                        className="form-control"
                        id="msg"
                        rows="4"
                        placeholder="Type Your Message or Clinical Query..."
                        value={formData.msg}
                        onChange={(e) =>
                          setFormData({ ...formData, msg: e.target.value })
                        }
                        required
                      ></textarea>
                    </div>

                    <div className="col-lg-12">
                      <div className="contact-form-btn">
                        <button type="submit" className="btn-default">
                          Send Message
                        </button>
                        {formSubmitted && (
                          <div
                            className="h3 text-success mt-3"
                            style={{ color: "#28a745", fontSize: "16px", fontWeight: "600" }}
                          >
                            Thank you! Your message has been sent successfully. Our reception team will reach out promptly.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form End */}
    </>
  );
}
