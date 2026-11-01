"use client";

import { useState } from "react";
import { CheckCircle2, Send, User, Mail, Phone, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="p-4 p-md-5 bg-white rounded-4 shadow-sm border border-success text-center">
        <div className="mb-3 d-inline-flex p-3 bg-success bg-opacity-10 text-success rounded-circle">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="h4 fw-bold text-success mb-2">Message Sent Successfully!</h3>
        <p className="text-muted mb-4">
          Thank you for reaching out, <strong>{formData.name}</strong>. Our clinical administration team will respond to <strong>{formData.email}</strong> within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
          }}
          className="btn btn-primary px-4 py-2 rounded-pill"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form p-4 p-md-5 bg-white rounded-4 shadow-sm border border-light">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <User size={14} className="text-primary me-1" /> Your Name *
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <Mail size={14} className="text-primary me-1" /> Email Address *
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <Phone size={14} className="text-primary me-1" /> Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            placeholder="e.g. (+0) 123 456 789"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <MessageSquare size={14} className="text-primary me-1" /> Subject *
          </label>
          <input
            type="text"
            name="subject"
            className="form-control"
            placeholder="Subject of inquiry"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12">
          <label className="form-label small fw-semibold text-dark">Your Message *</label>
          <textarea
            name="message"
            rows="4"
            className="form-control"
            placeholder="Write your message or inquiry here..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="col-md-12 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-default w-100 py-3 d-inline-flex justify-content-center align-items-center gap-2"
          >
            <Send size={18} /> {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </form>
  );
}
