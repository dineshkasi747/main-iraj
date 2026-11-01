"use client";

import { useState, useEffect } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DoctorsClient() {
  const [departments, setDepartments] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedDept, setExpandedDept] = useState(null);

  // Modals state
  const [deptModal, setDeptModal] = useState({ open: false, id: null, name: "" });
  const [docModal, setDocModal] = useState({ open: false, id: null, department_id: "", name: "", specialization: "", qualification: "", registration_number: "" });
  const [schedModal, setSchedModal] = useState({ open: false, doctor_id: null, doctor_name: "", schedules: [] });
  const [historySheet, setHistorySheet] = useState({ open: false, type: "", id: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      const res = await window.fetch(`/api/admin/departments-full?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        setDepartments(d.departments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filtered = departments.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.doctors?.some(
        (doc) => doc.name.toLowerCase().includes(q) || doc.specialization?.toLowerCase().includes(q)
      )
    );
  });

  const totalDoctors = departments.reduce((acc, d) => acc + (d.doctors?.length || 0), 0);
  const activeDoctors = departments.reduce((acc, d) => acc + (d.doctors?.filter((doc) => doc.is_active).length || 0), 0);

  // --- API Handlers ---
  const saveDept = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const method = deptModal.id ? "PUT" : "POST";
      const url = deptModal.id ? `/api/admin/departments/${deptModal.id}` : `/api/admin/departments`;
      const res = await window.fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: deptModal.name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDeptModal({ open: false, id: null, name: "" });
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const deleteDept = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      const res = await window.fetch(`/api/admin/departments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchDepartments();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveDoc = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const method = docModal.id ? "PUT" : "POST";
      const url = docModal.id ? `/api/admin/doctors/${docModal.id}` : `/api/admin/doctors`;
      const res = await window.fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(docModal) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDocModal({ open: false, id: null, department_id: "", name: "", specialization: "", qualification: "", registration_number: "" });
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const toggleDocStatus = async (doc) => {
    if (!confirm(`Are you sure you want to ${doc.is_active ? "disable" : "enable"} ${doc.name}?`)) return;
    try {
      const res = await window.fetch(`/api/admin/doctors/${doc.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !doc.is_active }) });
      if (!res.ok) throw new Error("Failed to update status");
      fetchDepartments();
    } catch (err) {
      alert(err.message);
    }
  };

  const openSched = (doc) => {
    const existing = doc.doctor_schedules || [];
    const full = Array.from({ length: 7 }, (_, i) => {
      const found = existing.find(s => s.day_of_week === i);
      return found ? { ...found } : { day_of_week: i, is_active: false, start_time: "09:00:00", end_time: "17:00:00", slot_duration_minutes: 20 };
    });
    setSchedModal({ open: true, doctor_id: doc.id, doctor_name: doc.name, schedules: full });
  };

  const saveSched = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await window.fetch(`/api/admin/schedules`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doctor_id: schedModal.doctor_id, schedules: schedModal.schedules }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSchedModal({ open: false, doctor_id: null, doctor_name: "", schedules: [] });
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const updateSchedDay = (index, field, value) => {
    const newS = [...schedModal.schedules];
    newS[index] = { ...newS[index], [field]: value };
    setSchedModal({ ...schedModal, schedules: newS });
  };

  // --- Subcomponents ---
  const DoctorCard = ({ doctor }) => {
    const activeDays = (doctor.doctor_schedules || []).filter((s) => s.is_active).map((s) => s.day_of_week);

    return (
      <div style={{ padding: "14px", borderRadius: "10px", background: doctor.is_active ? "var(--bg-card)" : "#F8FAFC", border: `1px solid ${doctor.is_active ? "var(--border)" : "#E2E8F0"}`, opacity: doctor.is_active ? 1 : 0.65 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--teal-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "var(--teal)", flexShrink: 0 }}>
                {doctor.name.replace("Dr. ", "").replace("Dr ", "").charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-heading)" }}>{doctor.name}</div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{doctor.specialization || "General"}</div>
              </div>
            </div>
            {doctor.qualification && <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>{doctor.qualification}</div>}
            
            <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
              {DAYS.map((day, i) => (
                <span key={day} style={{ padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, background: activeDays.includes(i) ? "var(--teal-light)" : "var(--bg-page)", color: activeDays.includes(i) ? "var(--teal)" : "var(--text-xmuted)", border: `1px solid ${activeDays.includes(i) ? "var(--teal)" : "var(--border)"}` }}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
          <button className="btn btn-sm btn-outline" onClick={() => setDocModal({ open: true, id: doctor.id, department_id: doctor.department_id, name: doctor.name.replace("Dr. ", ""), specialization: doctor.specialization || "", qualification: doctor.qualification || "", registration_number: doctor.registration_number || "" })}>
            Edit details
          </button>
          <button className="btn btn-sm btn-outline" onClick={() => openSched(doctor)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Schedule
          </button>
          <button onClick={() => setHistorySheet({ open: true, type: "doctor", id: doctor.id, name: doctor.name })} className="btn btn-sm btn-outline" title="View all appointments for this doctor">
            History
          </button>
          <button className="btn btn-sm btn-outline" onClick={() => toggleDocStatus(doctor)} style={{ marginLeft: "auto", color: doctor.is_active ? "var(--status-red-text)" : "var(--teal)" }}>
            {doctor.is_active ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    );
  };

  if (pageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors &amp; Departments</h1>
          <div className="breadcrumb">{departments.length} departments · {activeDoctors}/{totalDoctors} doctors active</div>
        </div>
        <button className="btn btn-primary" onClick={() => setDeptModal({ open: true, id: null, name: "" })}>
          + Add Department
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { value: departments.length, label: "Departments", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16"></path><path d="M8 8h8"></path><path d="M8 12h8"></path><path d="M8 16h8"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>, bg: "#EFF6FF", color: "#1D4ED8" },
          { value: totalDoctors, label: "Total Doctors", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>, bg: "#F0FDF4", color: "var(--green)" },
          { value: activeDoctors, label: "Active Doctors", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, bg: "#F0FDF4", color: "var(--green)" },
        ].map((s) => (
          <div key={s.label} style={{ flex: "1 1 160px", padding: "16px 18px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "20px", position: "relative" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: "absolute", left: "14px", top: "11.5px", color: "var(--text-muted)", pointerEvents: "none"}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" className="form-control" placeholder="Search department or doctor name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 400, paddingLeft: 38 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((dept) => {
          const isExpanded = expandedDept === dept.id;
          return (
            <div key={dept.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", background: isExpanded ? "#F0FDF4" : "var(--bg-card)", borderBottom: isExpanded ? "1px solid var(--border)" : "none", transition: "background 0.15s ease" }}>
                <button onClick={() => setExpandedDept(isExpanded ? null : dept.id)} style={{ flex: "1 1 200px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: isExpanded ? "var(--teal-light)" : "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", flexShrink: 0, border: "1px solid var(--border)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle></svg></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-heading)" }}>{dept.name}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>{dept.doctors?.length || 0} doctors</div>
                  </div>
                  <div style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </button>
                <div style={{ padding: "16px 20px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={(e) => { e.stopPropagation(); setHistorySheet({ open: true, type: "department", id: dept.id, name: dept.name }); }} className="btn btn-sm btn-outline" title="View all appointments for this department">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "4px"}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    History
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); setDeptModal({ open: true, id: dept.id, name: dept.name }); }}>Edit</button>
                  <button className="btn btn-sm btn-outline" style={{ color: "var(--status-red-text)" }} onClick={(e) => deleteDept(dept.id, e)}>Delete</button>
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: "16px 20px" }}>
                  <button className="btn btn-sm btn-primary" style={{ marginBottom: "16px" }} onClick={() => setDocModal({ open: true, id: null, department_id: dept.id, name: "", specialization: "", qualification: "", registration_number: "" })}>
                    + Add Doctor
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "10px" }}>
                    {(dept.doctors || []).map((doc) => <DoctorCard key={doc.id} doctor={doc} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODALS */}
      {/* Department Modal */}
      {deptModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 400, padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{deptModal.id ? "Edit Department" : "Add Department"}</h3>
            {error && <div style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <form onSubmit={saveDept}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Department Name</label>
              <input required type="text" className="input" value={deptModal.name} onChange={e => setDeptModal({...deptModal, name: e.target.value})} style={{ width: "100%", marginBottom: 16 }} />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setDeptModal({ open: false, id: null, name: "" })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Modal */}
      {docModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 500, padding: 24, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ marginBottom: 16 }}>{docModal.id ? "Edit Doctor" : "Add Doctor"}</h3>
            {error && <div style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <form onSubmit={saveDoc}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Name</label>
              <input required type="text" className="input" value={docModal.name} placeholder="e.g. John Doe (Dr. is added automatically)" onChange={e => setDocModal({...docModal, name: e.target.value})} style={{ width: "100%", marginBottom: 16 }} />
              
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Specialization</label>
              <input type="text" className="input" value={docModal.specialization} placeholder="e.g. Neurologist" onChange={e => setDocModal({...docModal, specialization: e.target.value})} style={{ width: "100%", marginBottom: 16 }} />
              
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Qualification</label>
              <input type="text" className="input" value={docModal.qualification} placeholder="e.g. MBBS, MD" onChange={e => setDocModal({...docModal, qualification: e.target.value})} style={{ width: "100%", marginBottom: 16 }} />
              
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Registration Number</label>
              <input type="text" className="input" value={docModal.registration_number} onChange={e => setDocModal({...docModal, registration_number: e.target.value})} style={{ width: "100%", marginBottom: 24 }} />
              
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setDocModal({ open: false, id: null, department_id: "", name: "", specialization: "", qualification: "", registration_number: "" })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {schedModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 600, padding: 24, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ marginBottom: 16 }}>Schedule: {schedModal.doctor_name}</h3>
            {error && <div style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <form onSubmit={saveSched}>
              {schedModal.schedules.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px", background: "#f8f9fa", borderRadius: "8px" }}>
                  <label style={{ width: 60, fontWeight: "bold", display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={s.is_active} onChange={e => updateSchedDay(i, "is_active", e.target.checked)} />
                    {DAYS[i]}
                  </label>
                  <input type="time" className="input" value={s.start_time.substring(0, 5)} onChange={e => updateSchedDay(i, "start_time", e.target.value + ":00")} disabled={!s.is_active} style={{ width: 110, padding: "4px 8px" }} />
                  <span>to</span>
                  <input type="time" className="input" value={s.end_time.substring(0, 5)} onChange={e => updateSchedDay(i, "end_time", e.target.value + ":00")} disabled={!s.is_active} style={{ width: 110, padding: "4px 8px" }} />
                  <span style={{ marginLeft: "auto", fontSize: 12 }}>Slot (min):</span>
                  <input type="number" className="input" value={s.slot_duration_minutes} onChange={e => updateSchedDay(i, "slot_duration_minutes", e.target.value)} disabled={!s.is_active} style={{ width: 60, padding: "4px 8px" }} />
                </div>
              ))}
              
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
                <button type="button" className="btn btn-outline" onClick={() => setSchedModal({ open: false, doctor_id: null, doctor_name: "", schedules: [] })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Schedule"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Side Sheet */}
      {historySheet.open && (
        <HistorySheet
          type={historySheet.type}
          id={historySheet.id}
          name={historySheet.name}
          onClose={() => setHistorySheet({ open: false, type: "", id: "", name: "" })}
        />
      )}
    </>
  );

  function HistorySheet({ type, id, name, onClose }) {
    const [appointments, setAppointments] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [histFilters, setHistFilters] = useState({ date_from: "", date_to: "", status: "" });

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const params = new URLSearchParams({ [`${type}_id`]: id, limit: "100" });
        if (histFilters.date_from) params.set("date_from", histFilters.date_from);
        if (histFilters.date_to) params.set("date_to", histFilters.date_to);
        if (histFilters.status) params.set("status", histFilters.status);
        const res = await window.fetch(`/api/admin/appointments?${params}`);
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.appointments || []);
        }
      } catch (err) {
        console.error(err);
      }
      setLoadingHistory(false);
    };

    useEffect(() => {
      fetchHistory();
    }, [type, id, histFilters]);

    const handleExport = () => {
      const params = new URLSearchParams({ [`${type}_id`]: id });
      if (histFilters.date_from) params.set("date_from", histFilters.date_from);
      if (histFilters.date_to) params.set("date_to", histFilters.date_to);
      if (histFilters.status) params.set("status", histFilters.status);
      window.open(`/api/admin/appointments/export?${params}`, "_blank");
    };

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
        <div style={{ width: "480px", maxWidth: "100%", background: "var(--bg-page)", height: "100%", display: "flex", flexDirection: "column", boxShadow: "-4px 0 25px rgba(0,0,0,0.15)", animation: "slideIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: "20px", background: "var(--bg-card)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", color: "var(--text-heading)" }}>History: {name}</h3>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{appointments.length} appointments found</div>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "24px", color: "var(--text-muted)", padding: "0 8px" }}>&times;</button>
          </div>

          {/* Filters */}
          <div style={{ padding: "12px 20px", background: "var(--bg-card)", borderBottom: "1px solid var(--border)", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <input type="date" className="form-control" value={histFilters.date_from} onChange={e => setHistFilters({...histFilters, date_from: e.target.value})} style={{ width: "130px", padding: "6px 8px", fontSize: "12px" }} />
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>to</span>
            <input type="date" className="form-control" value={histFilters.date_to} onChange={e => setHistFilters({...histFilters, date_to: e.target.value})} style={{ width: "130px", padding: "6px 8px", fontSize: "12px" }} />
            <select className="form-control" value={histFilters.status} onChange={e => setHistFilters({...histFilters, status: e.target.value})} style={{ width: "auto", padding: "6px 8px", fontSize: "12px" }}>
              <option value="">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_payment">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn btn-sm btn-outline" onClick={handleExport} style={{ marginLeft: "auto", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Export</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            {loadingHistory ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}><div className="spinner"></div></div>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: "var(--radius-lg)" }}>
                <div>No history found.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {appointments.map(appt => (
                  <div key={appt.id} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-card)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "flex-start" }}>
                      <div>
                        <strong style={{ fontSize: "14px", color: "var(--text-heading)", display: "block" }}>{appt.patient_name}</strong>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{appt.patient_phone}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12.5px", color: "var(--teal)", fontWeight: "700" }}>{appt.appointment_date}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{appt.appointment_time?.substring(0,5)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--border)" }}>
                      <span className={`badge ${appt.status === 'completed' ? 'badge-gray' : appt.status === 'cancelled' ? 'badge-red' : 'badge-green'}`}>
                        {appt.status?.replace("_", " ")}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
                        {appt.doctors?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: "16px 20px", background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
            <a href={`/appointments?${type}_id=${id}`} className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
              View Details & Filters in Appointments <span style={{marginLeft: "6px"}}>→</span>
            </a>
          </div>
        </div>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>
      </div>
    );
  }
}

