"use client";

export default function TopTickerBar() {
  const tickerItems = [
    {
      icon: "fa-solid fa-star text-warning",
      text: "Top Rated Multi-Speciality Hospital in Gajuwaka, Visakhapatnam",
    },
    {
      icon: "fa-solid fa-phone text-success",
      text: "Book your appointment today:",
      linkText: "+91 98010 81080",
      href: "tel:+919801081080",
    },
    {
      icon: "fa-brands fa-whatsapp text-success",
      text: "Instant WhatsApp Booking:",
      linkText: "Chat on WhatsApp",
      href: "https://wa.me/919801081080",
      isExternal: true,
    },
    {
      icon: "fa-solid fa-truck-medical text-danger",
      text: "24/7 Emergency & ICU Helpline: +91 98010 81080",
      href: "tel:+919801081080",
    },
    {
      icon: "fa-solid fa-shield-halved text-primary",
      text: "Advanced Multi-Speciality Medical Centre — The Care You Can Trust",
    },
    {
      icon: "fa-solid fa-award text-warning",
      text: "Expert Surgeons, Cardiologists, Orthopedics & Family Physicians",
    },
  ];

  return (
    <div className="top-marquee-bar">
      <div className="marquee-track">
        {/* Track 1 */}
        <div className="marquee-content">
          {tickerItems.map((item, idx) => (
            <span key={`t1-${idx}`} className="d-inline-flex align-items-center">
              <span className="marquee-item">
                <i className={item.icon}></i>
                <span>{item.text}</span>
                {item.linkText && item.href && (
                  <a
                    href={item.href}
                    className="marquee-link ms-1"
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {item.linkText}
                  </a>
                )}
              </span>
              <span className="marquee-dot">•</span>
            </span>
          ))}
        </div>

        {/* Track 2 (Duplicate for smooth infinite seamless loop) */}
        <div className="marquee-content" aria-hidden="true">
          {tickerItems.map((item, idx) => (
            <span key={`t2-${idx}`} className="d-inline-flex align-items-center">
              <span className="marquee-item">
                <i className={item.icon}></i>
                <span>{item.text}</span>
                {item.linkText && item.href && (
                  <a
                    href={item.href}
                    className="marquee-link ms-1"
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {item.linkText}
                  </a>
                )}
              </span>
              <span className="marquee-dot">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
