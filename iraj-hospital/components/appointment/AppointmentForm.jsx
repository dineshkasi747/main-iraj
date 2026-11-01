"use client";

import { useState } from "react";
import { servicesData } from "@/data/servicesData";
import { doctorsData } from "@/data/doctorsData";
import { Calendar, CheckCircle2, Clock, User, Phone, Mail, FileText } from "lucide-react";

export default function AppointmentForm({ preselectedDoctor = "", preselectedService = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: preselectedService || servicesData[0]?.title || "",
    doctor: preselectedDoctor || doctorsData[0]?.name || "",
    date: "",
    timeSlot: "09:00 AM - 10:00 AM",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:30 AM - 11:30 AM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:30 PM - 04:30 PM",
    "05:00 PM - 06:00 PM",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: servicesData[0]?.title || "",
      doctor: doctorsData[0]?.name || "",
      date: "",
      timeSlot: "09:00 AM - 10:00 AM",
      message: "",
    });
  };

  if (isSubmitted) {
    return (
      <div className="appointment-success-box p-4 p-md-5 rounded-4 text-center bg-white shadow-sm border border-success">
        <div className="mb-3 d-inline-flex p-3 bg-success bg-opacity-10 text-success rounded-circle">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="h4 fw-bold text-success mb-2">Appointment Scheduled Successfully!</h3>
        <p className="text-muted mb-4">
          Thank you, <strong>{formData.name}</strong>. Your consultation with <strong>{formData.doctor}</strong> for <strong>{formData.service}</strong> is reserved on <strong>{formData.date || "Tomorrow"}</strong> at <strong>{formData.timeSlot}</strong>.
        </p>
        <div className="p-3 bg-light rounded-3 text-start small mb-4">
          <p className="mb-1"><strong>Confirmation sent to:</strong> {formData.email}</p>
          <p className="mb-1"><strong>SMS notification:</strong> {formData.phone}</p>
          <p className="mb-0"><strong>Emergency hotline:</strong> 808 707 6060</p>
        </div>
        <button onClick={handleReset} className="btn btn-primary px-4 py-2 rounded-pill">
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="appointment-form p-4 p-md-5 bg-white rounded-4 shadow-sm border border-light">
      <div className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <User size={14} className="text-primary me-1" /> Full Name *
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <Mail size={14} className="text-primary me-1" /> Email Address *
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="e.g. john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <Phone size={14} className="text-primary me-1" /> Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            placeholder="e.g. (+0) 123 456 789"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Department / Service */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">Medical Department *</label>
          <select
            name="service"
            className="form-select form-control"
            value={formData.service}
            onChange={handleChange}
            required
          >
            {servicesData.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">Preferred Specialist *</label>
          <select
            name="doctor"
            className="form-select form-control"
            value={formData.doctor}
            onChange={handleChange}
            required
          >
            {doctorsData.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name} — {doc.role} ({doc.department.replace("Department of ", "")})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold text-dark">
            <Calendar size={14} className="text-primary me-1" /> Appointment Date *
          </label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Time Slot */}
        <div className="col-md-12">
          <label className="form-label small fw-semibold text-dark">
            <Clock size={14} className="text-primary me-1" /> Preferred Time Slot
          </label>
          <div className="d-flex flex-wrap gap-2">
            {timeSlots.map((slot, idx) => (
              <button
                key={idx}
                type="button"
                className={`btn btn-sm ${
                  formData.timeSlot === slot
                    ? "btn-primary shadow-sm"
                    : "btn-outline-secondary"
                } rounded-pill px-3`}
                onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="col-md-12">
          <label className="form-label small fw-semibold text-dark">
            <FileText size={14} className="text-primary me-1" /> Symptoms or Health Notes (Optional)
          </label>
          <textarea
            name="message"
            rows="3"
            className="form-control"
            placeholder="Briefly describe your symptoms or reason for visit..."
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit */}
        <div className="col-md-12 mt-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="btn-default w-100 py-3 d-inline-flex justify-content-center align-items-center gap-2"
          >
            {loading ? "Confirming Slot..." : "Confirm & Book Appointment"}
          </button>
        </div>
      </div>
    </form>
  );
}
