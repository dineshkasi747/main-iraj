const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data: doctors } = await supabase.from('doctors').select('id, name, doctor_schedules(*)').limit(1);
  const doc = doctors[0];
  console.log("Original schedules count:", doc.doctor_schedules.length);

  const schedules = doc.doctor_schedules.map(s => {
    return {
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time,
      slot_duration_minutes: s.slot_duration_minutes,
      is_active: false // force all to false
    };
  });

  const res = await fetch('http://localhost:3000/api/admin/schedules', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctor_id: doc.id, schedules })
  });
  
  const text = await res.text();
  console.log('API response:', res.status, text);

  const { data: newDoctors } = await supabase.from('doctors').select('id, name, doctor_schedules(*)').eq('id', doc.id).limit(1);
  console.log("New schedules active counts:");
  newDoctors[0].doctor_schedules.forEach(s => console.log(`Day ${s.day_of_week}: ${s.is_active}`));
}
test();
