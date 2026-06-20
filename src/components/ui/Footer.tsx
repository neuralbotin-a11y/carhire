import Link from "next/link";

const FOOTER_BG = "#2e2e32";
const FOOTER_MUTED = "#b0b0b0";
const ACCENT = "#6ecdd4";
const ICON_BG = "#404045";

const MAPS_URL = "https://maps.app.goo.gl/RTm3QK2RFpcNE6rA6";
const INSTAGRAM_URL =
  "https://www.instagram.com/autogalleryofficial/?hl=en";
const WHATSAPP_URL = "https://wa.me/917774056566";
const ADDRESS =
  "Arlem Bypass, Madgaon, Goa 403602";
const PHONE = "+91 777 405 6566";
const EMAIL = "bookings@smartwheels.in";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/cars" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "My Bookings", href: "/login" },
];

const contactIconStyle: React.CSSProperties = {
  width: "24px",
  height: "24px",
  borderRadius: "4px",
  backgroundColor: ICON_BG,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: "#ffffff",
};

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="18" height="18" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: FOOTER_BG,
        fontFamily: "'DM Sans', sans-serif",
        color: "#ffffff",
      }}
    >
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 24px 24px;
          align-items: start;
        }
        .footer-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 14px;
          letter-spacing: -0.02em;
        }
        .footer-brand-name span {
          color: ${ACCENT};
        }
        .footer-nav-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0;
          margin-bottom: 16px;
        }
        .footer-nav-link {
          font-size: 13px;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-nav-link:hover {
          color: ${ACCENT};
        }
        .footer-nav-sep {
          color: #666666;
          margin: 0 10px;
          font-size: 13px;
          user-select: none;
        }
        .footer-copy {
          font-size: 12px;
          color: ${FOOTER_MUTED};
          margin: 0;
        }
        .footer-contact-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .footer-contact-text {
          font-size: 13px;
          line-height: 1.5;
          color: #ffffff;
          margin: 0;
          padding-top: 3px;
        }
        .footer-contact-link {
          color: #ffffff;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-contact-link:hover {
          color: ${ACCENT};
        }
        .footer-email-link {
          color: ${ACCENT};
          text-decoration: none;
        }
        .footer-email-link:hover {
          text-decoration: underline;
        }
        .footer-about-title {
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 10px;
          color: #ffffff;
        }
        .footer-about-text {
          font-size: 13px;
          line-height: 1.55;
          color: ${FOOTER_MUTED};
          margin: 0 0 18px;
        }
        .footer-social-row {
          display: flex;
          gap: 8px;
        }
        .footer-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background-color: ${ICON_BG};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }
        .footer-social-btn:hover {
          background-color: #505055;
        }
        .footer-bottom {
          max-width: 1100px;
          margin: 0 auto;
          padding: 16px 24px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-bottom-text {
          font-size: 12px;
          color: ${FOOTER_MUTED};
          margin: 0;
          text-align: center;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 24px 20px 20px;
          }
        }
        @media (max-width: 768px) {
          .footer-bottom {
            padding: 16px 20px 20px;
          }
        }
      `}</style>

      <div className="footer-grid">
        {/* Col 1 — Brand & nav */}
        <div>
          <p className="footer-brand-name">
            Smart<span>Wheels</span>
          </p>
          <nav className="footer-nav-row" aria-label="Footer navigation">
            {navLinks.map((link, i) => (
              <span key={link.href} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <span className="footer-nav-sep">|</span>}
                <Link href={link.href} className="footer-nav-link">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        {/* Col 2 — Contact */}
        <div>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <div style={contactIconStyle}>
                <PinIcon />
              </div>
              <p className="footer-contact-text">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-link"
                >
                  {ADDRESS}
                </a>
              </p>
            </li>
            <li className="footer-contact-item">
              <div style={contactIconStyle}>
                <PhoneIcon />
              </div>
              <p className="footer-contact-text">
                <a href={`tel:${PHONE}`} className="footer-contact-link">
                  {PHONE}
                </a>
              </p>
            </li>
            <li className="footer-contact-item">
              <div style={contactIconStyle}>
                <EmailIcon />
              </div>
              <p className="footer-contact-text">
                <a href={`mailto:${EMAIL}`} className="footer-email-link">
                  {EMAIL}
                </a>
              </p>
            </li>
          </ul>
        </div>

        {/* Col 3 — About & social */}
        <div>
          <h3 className="footer-about-title">About the company</h3>
          <p className="footer-about-text">
            SmartWheels is a local self-drive car hire service across Goa.
            Book with us for worry-free rentals with transparent pricing and
            flexible pickup locations.
          </p>
          <div className="footer-social-row">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn"
              aria-label="SmartWheels on Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn"
              aria-label="Chat with SmartWheels on WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-bottom-text">
          SmartWheels © 2026 · Designed & built by Neuralbot
        </p>
      </div>
    </footer>
  );
}
