"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      {/* Main Footer Start */}
      <div className="main-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              {/* About Footer Start */}
              <div className="about-footer">
                {/* Footer Logo Start */}
                <div className="footer-logo">
                  <Link href="/" className="d-inline-flex align-items-center mb-3 text-decoration-none">
                    <img
                      src="/images/iraj-logo-full.png"
                      alt="IRAJ Hospitals"
                      style={{
                        height: "54px",
                        width: "auto",
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                      }}
                    />
                  </Link>
                </div>
                {/* Footer Logo End */}

                {/* Footer Content Start */}
                <div className="footer-content">
                  <p>
                    A premier multi-speciality hospital in Gajuwaka, Visakhapatnam with fully-equipped 24/7 Emergency and critical care with advanced laminar flow operation theaters, and compassionate family-centric healthcare.
                  </p>
                </div>
                {/* Footer Content End */}

                {/* Footer Social Links Start */}
                <div className="footer-social-links">
                  <ul>
                    <li>
                      <a href="https://wa.me/919801081080" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                        <i className="fa-brands fa-whatsapp"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/irajhospitals/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/profile.php?id=61581884108145" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://maps.app.goo.gl/wobxTtxhLTqc4Axq6" target="_blank" rel="noopener noreferrer" aria-label="Location Map">
                        <i className="fa-solid fa-location-dot"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.irajhospitals.com" target="_blank" rel="noopener noreferrer" aria-label="Official Website">
                        <i className="fa-solid fa-globe"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Footer Social Links End */}
              </div>
              {/* About Footer End */}
            </div>

            <div className="col-lg-2 col-md-3 col-5">
              {/* Footer Quick Links Start */}
              <div className="footer-quick-links">
                <h2>quick links</h2>
                <ul>
                  <li><Link href="/">home</Link></li>
                  <li><Link href="/about">about us</Link></li>
                  <li><Link href="/our-team">doctors</Link></li>
                  <li><Link href="/services">services</Link></li>
                  <li><Link href="/contact">contact us</Link></li>
                </ul>
              </div>
              {/* Footer Quick Links End */}
            </div>

            <div className="col-lg-3 col-md-4 col-7">
              {/* Footer Contact Details Start */}
              <div className="footer-contact-details">
                <h2>contact details</h2>
                {/* Footer Contact Info Box Start */}
                <div className="footer-contact-box">
                  <div className="footer-info-box">
                    <div className="icon-box">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <p>26-4-9/1, Near Jug Junction, Gajuwaka, Visakhapatnam</p>
                  </div>

                  <div className="footer-info-box">
                    <div className="icon-box">
                      <i className="fa-solid fa-envelope-open-text"></i>
                    </div>
                    <p>help@irajhospitals.com</p>
                  </div>

                  <div className="footer-info-box">
                    <div className="icon-box">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <p>+91 98010 81080</p>
                  </div>

                  <div className="footer-info-box">
                    <div className="icon-box">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <p>24/7 Emergency &amp; Trauma Care</p>
                  </div>
                </div>
                {/* Footer Contact Info Box End */}
              </div>
              {/* Footer Contact Details End */}
            </div>

            <div className="col-lg-3 col-md-5">
              {/* Footer Newsletter Start */}
              <div className="footer-newsletter">
                <h2>newsletter</h2>
                <div className="subscribe-content">
                  <h3>subscribe to our newsletter</h3>
                  <p>Stay informed and never miss out on health tips and medical updates from IRAJ Hospital.</p>
                </div>
                <div className="footer-newsletter-form">
                  <form
                    id="newslettersForm"
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Thank you for subscribing to IRAJ Hospital updates!");
                    }}
                  >
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="mail"
                        placeholder="Enter Your Email"
                        required
                        suppressHydrationWarning={true}
                      />
                      <button type="submit" className="btn-default" suppressHydrationWarning={true}>
                        send{" "}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* Footer Newsletter End */}
            </div>
          </div>

          {/* Footer Copyright Section Start */}
          <div className="footer-copyright">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer-copyright-text">
                  <p>
                    copyright {new Date().getFullYear()} © <span>IRAJ Multi-Speciality Hospital</span> all right reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Footer Copyright Section End */}
        </div>
      </div>
      {/* Main Footer End */}
    </footer>
  );
}
