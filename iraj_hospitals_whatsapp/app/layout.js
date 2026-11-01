import "./globals.css";

export const metadata = {
  title: {
    default: "Iraj Hospitals — WhatsApp Admin",
    template: "%s | Iraj Admin",
  },
  description: "WhatsApp automation control panel for IRAJ Multi-Speciality Hospital, Gajuwaka",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
