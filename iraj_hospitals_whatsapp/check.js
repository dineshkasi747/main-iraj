import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  console.log("Seeding 20 appointments...");
  const today = "2026-09-19";
  const times = [
    "15:00", "15:30", "16:00",
    "16:30", "16:45", "17:00", "17:15",
    "17:30", "17:45", "18:00",
    "18:30", "19:00", "19:30", "20:00",
    "10:00", "11:00", "12:00", "13:00", "14:00", "14:30"
  ];
  const dummyNames = [
    "Rahul Sharma", "Priya Patel", "Amit Singh", "Neha Gupta", "Vikram Reddy",
    "Anjali Desai", "Suresh Kumar", "Pooja Rao", "Ravi Verma", "Kavita Iyer",
    "Kiran Joshi", "Sanjay Nambiar", "Sneha Menon", "Deepak Nair", "Divya Pillai",
    "Arun Chacko", "Meera Krishnan", "Manoj Tiwari", "Swati Das", "Nitin Bose"
  ];

  const appointments = [];
  for (let i = 0; i < 20; i++) {
    appointments.push({
      patient_name: dummyNames[i],
      patient_phone: `+9198765432${i.toString().padStart(2, '0')}`,
      appointment_date: today,
      appointment_time: times[i],
      status: "confirmed",
      payment_mode: i % 2 === 0 ? "online" : "pay_at_hospital",
      payment_status: i % 2 === 0 ? "paid" : "pending",
      source: i % 3 === 0 ? "whatsapp" : i % 3 === 1 ? "website_lead" : "offline",
      reminder_sent: false
    });
  }

  const { data, error } = await supabase.from('appointments').insert(appointments).select();

  console.log("Error:", error);
  console.log("Inserted:", data?.length);
}

test();
