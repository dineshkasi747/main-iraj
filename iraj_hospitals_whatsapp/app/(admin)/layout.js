import "@/app/globals.css";
import AdminShell from "@/components/layout/AdminShell";

export const metadata = {
  title: {
    default: "Iraj Hospitals — WhatsApp Admin",
    template: "%s | Iraj Admin",
  },
  description: "WhatsApp automation control panel for IRAJ Multi-Speciality Hospital, Gajuwaka",
};

export default function DashboardLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
