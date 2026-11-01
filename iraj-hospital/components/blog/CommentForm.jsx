"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle2 } from "lucide-react";

export default function CommentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center gap-2">
        <CheckCircle2 size={20} />
        <span>Thank you, {formData.name || "friend"}! Your comment has been submitted.</span>
      </div>
    );
  }

  return (
    <div className="comment-form-section">
      <h3 className="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <MessageSquare className="text-primary" size={20} /> Leave a Comment
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Your Name *"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              placeholder="Your Email *"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="col-12">
            <textarea
              rows="4"
              className="form-control"
              placeholder="Your Comment..."
              value={formData.comment}
              onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
              required
            ></textarea>
          </div>
          <div className="col-12">
            <button type="submit" className="btn-default py-2 px-4">
              Post Comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
