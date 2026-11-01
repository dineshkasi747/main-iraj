"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_phone: "+91",
    department_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    payment_mode: "pay_at_hospital",
    amount: "300"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch via API routes instead of direct supabase (service key is server-only)
    fetch("/api/admin/departments")
      .then(r => r.json())
      .then(d => setDepartments(d.departments || d || []))
      .catch(console.error);
    fetch("/api/admin/doctors")
      .then(r => r.json())
      .then(d => setDoctors(d.doctors || d || []))
      .catch(console.error);
  }, []);

  const availableDoctors = doctors.filter(d => d.department_id === formData.department_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await window.fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book appointment");
      
      router.push("/appointments");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manual Booking</h1>
          <div className="breadcrumb">Create an offline appointment (Walk-in / Phone Call)</div>
        </div>
        <button className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
      </div>

      <div className="card" style={{ maxWidth: 600, margin: "0 auto", padding: "30px" }}>
        {error && (
          <div style={{ padding: "12px", background: "var(--red-bg)", color: "var(--red)", borderRadius: "var(--radius-md)", marginBottom: "20px", fontSize: "14px" }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className="form-label">Patient Name</label>
            <input required type="text" className="form-control" placeholder="e.g. John Doe" 
              value={formData.patient_name} onChange={e => setFormData({...formData, patient_name: e.target.value})} />
          </div>

          <div>
            <label className="form-label">Patient Phone Number</label>
            <input required type="text" className="form-control" placeholder="+919876543210" 
              value={formData.patient_phone} onChange={e => setFormData({...formData, patient_phone: e.target.value})} />
          </div>

          <div>
            <label className="form-label">Department</label>
            <select required className="form-control" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value, doctor_id: ""})}>
              <option value="">-- Select Department --</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Doctor</label>
            <select required className="form-control" value={formData.doctor_id} onChange={e => setFormData({...formData, doctor_id: e.target.value})} disabled={!formData.department_id}>
              <option value="">-- Select Doctor --</option>
              {availableDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label className="form-label">Appointment Date</label>
              <input required type="date" className="form-control" min={new Date().toISOString().split("T")[0]}
                value={formData.appointment_date} onChange={e => setFormData({...formData, appointment_date: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Time Slot</label>
              <input required type="time" className="form-control" 
                value={formData.appointment_time} onChange={e => setFormData({...formData, appointment_time: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="form-label">Amount (₹)</label>
            <input required type="number" className="form-control" 
              value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "10px", width: "100%", justifyContent: "center", padding: "12px", fontSize: "15px" }}>
            {loading ? "Booking..." : "Confirm Offline Booking"}
          </button>
        </form>
      </div>
    </>
  );
}
