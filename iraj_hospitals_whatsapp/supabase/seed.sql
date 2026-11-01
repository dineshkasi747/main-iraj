-- ============================================================
-- Iraj Hospitals WhatsApp Automation — Full Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── departments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── doctors ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  department_id       UUID REFERENCES departments(id),
  qualification       TEXT,
  specialization      TEXT,
  registration_number TEXT,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── doctor_schedules ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id             UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week           INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun,1=Mon,...
  start_time            TIME NOT NULL,
  end_time              TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 20,
  is_active             BOOLEAN DEFAULT TRUE
);

-- ─── appointments ──────────────────────────────────────────
CREATE TYPE appointment_status AS ENUM (
  'pending_payment', 'confirmed', 'cancelled', 'completed', 'waiting_onboarding'
);
CREATE TYPE payment_mode AS ENUM ('online', 'pay_at_hospital');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'not_required');
CREATE TYPE appointment_source AS ENUM ('whatsapp', 'offline', 'website_lead');

CREATE TABLE IF NOT EXISTS appointments (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id            UUID REFERENCES doctors(id),
  patient_name         TEXT NOT NULL,
  patient_phone        TEXT NOT NULL,
  appointment_date     DATE NOT NULL,
  appointment_time     TIME NOT NULL,
  status               appointment_status DEFAULT 'pending_payment',
  payment_mode         payment_mode DEFAULT 'pay_at_hospital',
  payment_status       payment_status DEFAULT 'pending',
  amount               NUMERIC DEFAULT 300,
  razorpay_order_id    TEXT,
  razorpay_payment_id  TEXT,
  source               appointment_source DEFAULT 'whatsapp',
  reminder_sent        BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (doctor_id, appointment_date, appointment_time)
);

-- ─── conversations ─────────────────────────────────────────
CREATE TYPE conversation_status AS ENUM ('active', 'completed', 'error', 'waiting_onboarding');

CREATE TABLE IF NOT EXISTS conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_phone   TEXT UNIQUE NOT NULL,
  message_history JSONB DEFAULT '[]',
  current_state   TEXT DEFAULT 'greeting',
  known_facts     JSONB DEFAULT '{}',
  status          conversation_status DEFAULT 'active',
  last_error      TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── leads ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name          TEXT,
  patient_phone         TEXT,
  source                TEXT DEFAULT 'website_appointment_form',
  linked_appointment_id UUID REFERENCES appointments(id),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── hospital_context ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospital_context (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content    TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── settings ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  default_appointment_fee       NUMERIC DEFAULT 300,
  booking_window_days           INTEGER DEFAULT 7,
  reminder_hours_before         INTEGER DEFAULT 1,
  welcome_message_template_name TEXT DEFAULT 'hello_world',
  hospital_contact_email        TEXT DEFAULT 'help@irajhospitals.com',
  hospital_contact_phone        TEXT DEFAULT '+919801081080',
  updated_at                    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── error_logs ────────────────────────────────────────────
CREATE TYPE error_type AS ENUM (
  'whatsapp_api_failure', 'llm_api_failure', 'conversation_error', 'payment_error'
);

CREATE TABLE IF NOT EXISTS error_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type          error_type NOT NULL,
  patient_phone TEXT,
  details       TEXT,
  resolved      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  name         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Enable Realtime ───────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE error_logs;

-- ============================================================
-- SEED DATA: Departments & Doctors
-- ============================================================

-- Departments
INSERT INTO departments (id, name) VALUES
  ('11111111-0001-0001-0001-000000000001', 'Neuro Sciences – Neurology'),
  ('11111111-0001-0001-0001-000000000002', 'Neuro Sciences – Neurosurgery'),
  ('11111111-0001-0001-0001-000000000003', 'Neuro & Interventional Radiology'),
  ('11111111-0001-0001-0001-000000000004', 'Endocrinology / Hormones'),
  ('11111111-0001-0001-0001-000000000005', 'Cardiac / Heart Sciences – Cardiology'),
  ('11111111-0001-0001-0001-000000000006', 'Cardiac / Heart Sciences – Cardiothoracic & Vascular Surgery'),
  ('11111111-0001-0001-0001-000000000007', 'Renal / Kidney Sciences – Nephrology'),
  ('11111111-0001-0001-0001-000000000008', 'Renal / Kidney Sciences – Urology'),
  ('11111111-0001-0001-0001-000000000009', 'Gastro Sciences – Medical Gastroenterology'),
  ('11111111-0001-0001-0001-000000000010', 'Gastro Sciences – Surgical Gastroenterology'),
  ('11111111-0001-0001-0001-000000000011', 'Oncology / Cancer – Radiation Oncology'),
  ('11111111-0001-0001-0001-000000000012', 'Plastic Surgery'),
  ('11111111-0001-0001-0001-000000000013', 'Orthopaedics / Bone & Joint'),
  ('11111111-0001-0001-0001-000000000014', 'General / Laparoscopic Surgery'),
  ('11111111-0001-0001-0001-000000000015', 'Otolaryngology / ENT'),
  ('11111111-0001-0001-0001-000000000016', 'Obstetrics & Gynaecology'),
  ('11111111-0001-0001-0001-000000000017', 'Paediatrics'),
  ('11111111-0001-0001-0001-000000000018', 'Internal Medicine'),
  ('11111111-0001-0001-0001-000000000019', 'Anaesthesia & Critical Care Medicine'),
  ('11111111-0001-0001-0001-000000000020', 'TB & Chest Diseases'),
  ('11111111-0001-0001-0001-000000000021', 'Resident Doctors')
ON CONFLICT (id) DO NOTHING;

-- Doctors (with registration numbers where available)
INSERT INTO doctors (name, department_id, qualification, specialization, registration_number) VALUES
  -- Neuro Sciences – Neurology
  ('Dr. V Manasa', '11111111-0001-0001-0001-000000000001', 'MD (General Medicine)(KGH), DM (Neurology)(KGH)', 'Neurologist', 'APMC/FMR/80391'),
  ('Dr. CH Mounika', '11111111-0001-0001-0001-000000000001', 'MD (General Medicine)(KGH), DM (Neurology)(NIMS)', 'Neurologist', 'APMC/FMR/96736'),
  -- Neuro Sciences – Neurosurgery
  ('Dr. Vijay Terapalli', '11111111-0001-0001-0001-000000000002', 'MS (General Surgery), Mch (Neuro Surgery)(KGH), Fellowship Endoscopic Skull Base/Brain/Spine Surgery', 'Neuro Surgeon', '49211'),
  -- Neuro & Interventional Radiology
  ('Dr. Rajesh Poosarla', '11111111-0001-0001-0001-000000000003', 'MD (Radio Diagnostics), DNB (Radio Diagnostics), DM (Neuro Radiology)', 'Interventional Radiologist', '63349'),
  -- Endocrinology
  ('Dr. P Venu Madhavi', '11111111-0001-0001-0001-000000000004', 'MD (General Medicine)(Osmania), DM (Endocrinology)(Osmania)', 'Endocrinologist', '68213'),
  -- Cardiology
  ('Dr. Davala Vasu Babu', '11111111-0001-0001-0001-000000000005', 'MD (General Medicine), DrNB (Cardiology)', 'Cardiologist', '62115'),
  ('Dr. Rakesh Dubba', '11111111-0001-0001-0001-000000000005', 'MD (General Medicine), DM (Cardiology), PDF (EP) Medanta The Medicity', 'Cardiologist', '64237'),
  -- CTVS
  ('Dr. Revanth Reddy Maramreddy', '11111111-0001-0001-0001-000000000006', 'MS (General Surgery), Mch (Cardio Thoracic and Vascular Surgery, PGIMER Chandigarh)', 'Cardio Thoracic and Vascular Surgeon', 'APMC/FMR/74992'),
  -- Nephrology
  ('Dr. Krishnam Raju Penmatsa', '11111111-0001-0001-0001-000000000007', 'MD (General Medicine), DM, DNB (Nephrology), Clinical Fellowship Adult Nephrology (Canada), AHSCP (USA) Certified', 'Nephrologist', '61579'),
  -- Urology
  ('Dr. M Sudarshan Rao', '11111111-0001-0001-0001-000000000008', 'MS (General Surgery), Mch (Urology)', 'Urologist', NULL),
  -- Medical Gastroenterology
  ('Dr. V Sasanka', '11111111-0001-0001-0001-000000000009', 'MD (General Medicine), DrNB (Gastroenterology)', 'Gastroenterologist', 'APMC/FMR/81392'),
  -- Surgical Gastroenterology
  ('Dr. Kinjarapu Ravi Shankar', '11111111-0001-0001-0001-000000000010', 'MS (General Surgery), DNB (Surgical Gastroenterology)', 'Surgical Gastroenterologist', '49197'),
  -- Oncology
  ('Dr. P S Bhattacharyya', '11111111-0001-0001-0001-000000000011', 'MD (Radiotherapy)', 'Radiation Oncologist', 'APMC/FMR/84420'),
  -- Plastic Surgery
  ('Dr. Uday Kumar Chapa', '11111111-0001-0001-0001-000000000012', 'MS (General Surgery)(JIPMER), Mch (Plastic Surgery)(PGIMER Chandigarh)', 'Plastic Surgeon', 'APMC/FMR/98055'),
  ('Dr. Nitesh Reddy Dharmala', '11111111-0001-0001-0001-000000000012', 'MS (General Surgery), Mch (Plastic Surgery)(VMMC & Safdarjung Hospital, New Delhi)', 'Plastic Surgeon', 'APMC/FMR/96632'),
  -- Orthopaedics
  ('Dr. D S S Phani', '11111111-0001-0001-0001-000000000013', 'MBBS, MS (Orthopaedics)', 'Orthopaedician', 'APMC/FMR/97753'),
  ('Dr. B M K Phaniteja', '11111111-0001-0001-0001-000000000013', 'MBBS, DNB (Orthopaedics)', 'Orthopaedician', 'APMC/FMR/81761'),
  ('Dr. Yoganadh Sadhu', '11111111-0001-0001-0001-000000000013', 'MBBS, MS (Orthopaedics)', 'Orthopaedician', 'APMC/FMR/97756'),
  ('Dr. Golla Sushanth', '11111111-0001-0001-0001-000000000013', 'MBBS, MS (Orthopaedics)', 'Orthopaedician', '68459'),
  ('Dr. Lalam Pavan', '11111111-0001-0001-0001-000000000013', 'MBBS, Diploma in Orthopaedics', 'Orthopaedician', '70945'),
  -- General Surgery
  ('Dr. Kodali Gopi', '11111111-0001-0001-0001-000000000014', 'MBBS, MS (General Surgery)', 'General/Laparoscopic Surgeon', 'APMC/FMR/83592'),
  ('Dr. M Yesu Prasad', '11111111-0001-0001-0001-000000000014', 'MBBS, MS (General Surgery)', 'General/Laparoscopic Surgeon', 'APMC/FMR/80360'),
  -- ENT
  ('Dr. Tummidi Veera Venkata Vinay Kumar', '11111111-0001-0001-0001-000000000015', 'MBBS, MS (ENT)', 'ENT Surgeon', '70756'),
  ('Dr. Sirisha Sirugudi', '11111111-0001-0001-0001-000000000015', 'MBBS, MS (ENT)', 'ENT Surgeon', 'APMC/FMR/96531'),
  -- Gynaecology
  ('Dr. G V K Jyothirmai', '11111111-0001-0001-0001-000000000016', 'MBBS, MS (OBG)', 'Obstetrician & Gynaecologist', 'APMC/FMR/117885'),
  ('Dr. S Pavani', '11111111-0001-0001-0001-000000000016', 'MBBS, MS (OBG)', 'Obstetrician & Gynaecologist', '68364'),
  ('Dr. Y Samatha', '11111111-0001-0001-0001-000000000016', 'MBBS, DGO', 'Obstetrician & Gynaecologist', '44550'),
  -- Paediatrics
  ('Dr. L Avinash', '11111111-0001-0001-0001-000000000017', 'DCH, DNB (Paediatrics)', 'Paediatrician', 'APMC/FMR/90172'),
  -- Internal Medicine
  ('Dr. K Uday Bhaskar', '11111111-0001-0001-0001-000000000018', 'MBBS, MD (General Medicine)', 'General Physician', 'APMC/FMR/101795'),
  -- Anaesthesia
  ('Dr. CH Ashwani Dutt', '11111111-0001-0001-0001-000000000019', 'MBBS, MD (Anaesthesia & Critical Care Medicine)', 'Anaesthesiologist & Intensivist', 'APMC/FMR/90182'),
  -- TB & Chest
  ('Sayyapureddi Bandhavi', '11111111-0001-0001-0001-000000000020', 'MBBS, MD (Respiratory Medicine), IDCCM', 'Pulmonologist & Intensivist', 'APMC/FMR/101334'),
  -- Resident Doctors
  ('Dr. Daliboina Sekhar', '11111111-0001-0001-0001-000000000021', 'MD (General Physician) Ukr., Fellowship in Diabetes, Fellowship in Clinical Cardiology, MBA in Hospital Management', 'General Physician', 'APMC/FMR/97976'),
  ('Dr. Rao Babu Panku', '11111111-0001-0001-0001-000000000021', 'MD (General Physician) Ukr., Fellowship in Diabetes', 'General Physician', 'APMC/FMR/123344');

-- ─── Default Schedules (Mon–Sat, 2 sessions, 20-min slots) ────
-- We insert schedules for all doctors after fetching their IDs
-- Days: 1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes)
SELECT d.id, day.day_of_week, session.start_time::TIME, session.end_time::TIME, 20
FROM doctors d
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS day(day_of_week)
CROSS JOIN (VALUES ('09:00','13:00'),('17:00','20:00')) AS session(start_time, end_time);

-- ─── Default Settings Row ──────────────────────────────────
INSERT INTO settings (
  default_appointment_fee, booking_window_days, reminder_hours_before,
  welcome_message_template_name, hospital_contact_email, hospital_contact_phone
) VALUES (
  300, 7, 1,
  'hello_world',
  'help@irajhospitals.com',
  '+919801081080'
) ON CONFLICT DO NOTHING;

-- ─── Default Hospital Context ──────────────────────────────
INSERT INTO hospital_context (content) VALUES (
  'IRAJ Multi-Speciality Hospital is located at 26-4-9/1, Near Jug Junction, Gajuwaka, Visakhapatnam, Andhra Pradesh. We are a NABH-accredited hospital offering 24/7 emergency and trauma care. Our OPD operates from 9 AM to 8 PM, Monday through Saturday. We have 21 specialties including Neurology, Cardiology, Orthopaedics, Gynaecology, General Surgery, ENT, Paediatrics, and more. Appointment consultation fee is ₹300. Patients can book appointments via WhatsApp or the website. For emergencies, contact us at +91 98010 81080. We accept online payments via Razorpay as well as pay-at-hospital. WhatsApp appointment reminders are sent 1 hour before the scheduled time.'
) ON CONFLICT DO NOTHING;
