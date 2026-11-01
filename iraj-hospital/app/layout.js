import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNavigation from "@/components/layout/MobileBottomNavigation";
import Preloader from "@/components/common/Preloader";
import ScrollToTop from "@/components/common/ScrollToTop";
import AnimationManager from "@/components/common/AnimationManager";
import MagicCursor from "@/components/common/MagicCursor";
import { AuthProvider } from "@/context/AuthContext";
import GlobalPhonePrompt from "@/components/auth/GlobalPhonePrompt";
import { siteConfig } from "@/data/siteData";

export const metadata = {
  metadataBase: new URL("https://www.irajhospitals.com"),
  title: {
    default: `${siteConfig.name} - ${siteConfig.fullName} | Gajuwaka, Visakhapatnam`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "IRAJ Hospital",
    "IRAJ Multi-Speciality Hospital",
    "Hospital in Gajuwaka",
    "Visakhapatnam Hospital",
    "Healthcare Visakhapatnam",
    "Emergency Care",
    "ICU Care",
    "General Surgery",
    "Pediatrics",
    "Cardiology",
    "Orthopedics",
    "Gynecology",
    "Appointment Booking",
  ],
  authors: [{ name: "IRAJ Multi-Speciality Hospital" }],
  icons: {
    icon: "/images/iraj-logo.png",
    shortcut: "/images/iraj-logo.png",
    apple: "/images/iraj-logo.png",
  },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.fullName}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/iraj-logo-full.png",
        width: 906,
        height: 388,
        alt: siteConfig.name,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
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
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/all.css" />
        <link rel="stylesheet" href="/css/animate.css" />
        <link rel="stylesheet" href="/css/custom.css" />
      </head>
      <body className="tt-magic-cursor">
        <AuthProvider>
          <Preloader />
          <MagicCursor />
          <AnimationManager />
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBottomNavigation />
          <ScrollToTop />
          <GlobalPhonePrompt />
        </AuthProvider>
      </body>
    </html>
  );
}

