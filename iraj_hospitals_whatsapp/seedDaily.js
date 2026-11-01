import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedData() {
  console.log("Seeding 20 dummy appointments for today (19-09-2026)...");

  // Fetch some doctors to attach to the appointments
  const { data: doctors } = await supabase.from("doctors").select("id, department_id").limit(3);
  if (!doctors || doctors.length === 0) {
    console.error("No doctors found in the database. Cannot seed.");
    return;
  }

  const today = "2026-09-19";
  
  // Create times spread around the current time (16:16)
  // Let's create a mix of past (overdue), soon, and later today.
  const times = [
    "15:00", "15:30", "16:00", // Past
    "16:30", "16:45", "17:00", "17:15", // < 1 Hr
    "17:30", "17:45", "18:00", // < 2 Hr
    "18:30", "19:00", "19:30", "20:00", // Later
    "10:00", "11:00", "12:00", "13:00", "14:00", "14:30" // Morning
  ];

  const dummyNames = [
    "Rahul Sharma", "Priya Patel", "Amit Singh", "Neha Gupta", "Vikram Reddy",
    "Anjali Desai", "Suresh Kumar", "Pooja Rao", "Ravi Verma", "Kavita Iyer",
    "Kiran Joshi", "Sanjay Nambiar", "Sneha Menon", "Deepak Nair", "Divya Pillai",
    "Arun Chacko", "Meera Krishnan", "Manoj Tiwari", "Swati Das", "Nitin Bose"
  ];

  const appointments = [];

  for (let i = 0; i < 20; i++) {
    const doc = doctors[i % doctors.length];
    
    appointments.push({
      patient_name: dummyNames[i],
      patient_phone: `+9198765432${i.toString().padStart(2, '0')}`,
      doctor_id: doc.id,
      appointment_date: today,
      appointment_time: times[i],
      status: "confirmed",
      payment_mode: i % 2 === 0 ? "online" : "pay_at_hospital",
      payment_status: i % 2 === 0 ? "paid" : "pending",
      source: i % 3 === 0 ? "whatsapp" : i % 3 === 1 ? "website_lead" : "offline",
      reminder_sent: false
    });
  }

  const { data, error } = await supabase.from("appointments").insert(appointments);

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log(`Successfully inserted ${appointments.length} dummy appointments!`);
  }
}

seedData();
