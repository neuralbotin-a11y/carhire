import Link from "next/link";

const NAVY = "#1a1f5e";
const OFFWHITE = "#f4f6fb";

const pickupLocations = [
  "Dabolim Airport",
  "Manohar Airport",
  "Madgaon Railway Station",
  "Vasco Da Gama Railway Station",
  "Panjim",
  "Margao",
];

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/cars" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Manage My Bookings", href: "/login" },
];

const headingStyle: React.CSSProperties = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: "10px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "#aaaaaa",
  margin: "0 0 8px",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  color: "#555555",
  lineHeight: 1.5,
};

const iconColor = "#888888";

const iconStyle: React.CSSProperties = {
  width: "14px",
  height: "14px",
  flexShrink: 0,
  color: iconColor,
};

const contactItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const locationItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "6px",
};

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={iconStyle}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      style={iconStyle}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={iconStyle}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ ...iconStyle, marginTop: "3px" }}
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: OFFWHITE,
        borderTop: "1px solid #e8eaf0",
        padding: "24px 24px 14px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        .footer-grid {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }
        .footer-col {
          flex: 1;
          min-width: 0;
        }
        .footer-link {
          color: #555555;
          text-decoration: none;
        }
        .footer-link:hover {
          color: ${NAVY};
        }
        @media (max-width: 768px) {
          .footer-grid {
            flex-direction: column;
            gap: 20px;
          }
          .footer-locations-list {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 960px) {
          .footer-grid {
            flex-wrap: wrap;
            gap: 32px 40px;
          }
          .footer-col {
            flex: 1 1 calc(50% - 20px);
          }
        }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="footer-grid">
          {/* Col 1 — About */}
          <div className="footer-col">
            <h3 style={headingStyle}>About</h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#555555",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              <span style={{ color: NAVY, fontWeight: 500 }}>SmartWheels</span>{" "}
              is a local self-drive car hire service across Goa.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#555555",
                lineHeight: 1.5,
                margin: "6px 0 0",
                fontStyle: "italic",
              }}
            >
              Book with us for worry free rentals.
            </p>
          </div>

          {/* Col 2 — Pages */}
          <div className="footer-col">
            <h3 style={headingStyle}>Pages</h3>
            <ul style={listStyle}>
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div className="footer-col">
            <h3 style={headingStyle}>Contact</h3>
            <ul style={listStyle}>
              <li style={contactItemStyle}>
                <PhoneIcon />
                <a href="tel:07774056566" className="footer-link">
                  07774056566
                </a>
              </li>
              <li style={contactItemStyle}>
                <WhatsAppIcon />
                <a
                  href="https://wa.me/917774056566"
                  className="footer-link"
                >
                  WhatsApp
                </a>
              </li>
              <li style={contactItemStyle}>
                <EmailIcon />
                <a
                  href="mailto:neuralbot.in@gmail.com"
                  className="footer-link"
                >
                  neuralbot.in@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — Pickup locations */}
          <div className="footer-col">
            <h3 style={headingStyle}>Pickup &amp; Drop</h3>
            <ul
              className="footer-locations-list"
              style={{
                ...listStyle,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "12px",
              }}
            >
              {pickupLocations.map((location) => (
                <li key={location} style={locationItemStyle}>
                  <PinIcon />
                  <span>{location}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #e8eaf0",
            marginTop: "20px",
            paddingTop: "10px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#999999",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Copyright © 2026 SmartWheels. All rights reserved. smartwheels.in
          </p>
        </div>
      </div>
    </footer>
  );
}
