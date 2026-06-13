const NAVY = "#1a1f5e";
const WHITE = "#ffffff";
const OFFWHITE = "#f4f6fb";

const STEPS = [
  {
    title: "Choose Your Dates & Location",
    description:
      "Pick your pickup location, drop-off location, and travel dates on the homepage. Minimum booking is 3 days.",
  },
  {
    title: "Select Your Car",
    description:
      'Browse available cars and click "Select This Car" to proceed to the booking form.',
  },
  {
    title: "Enter Your Details",
    description:
      "Fill in your name, phone number, and email. Your price breakdown is calculated automatically — including location charges, night surcharges if applicable, and washing charge.",
  },
  {
    title: "Submit Your Booking",
    description:
      "Submit the form. Your booking is logged instantly and our team will contact you within a short time to confirm.",
  },
  {
    title: "Confirmation via Call or WhatsApp",
    description:
      "We confirm your booking by phone or WhatsApp. No instant auto-confirmation — a real person reviews every booking.",
  },
  {
    title: "Pick Up Your Car",
    description:
      "Show up at your chosen location at your pickup time. A refundable security deposit of ₹3,000 is collected at the time of handover.",
  },
  {
    title: "Return Your Car",
    description:
      "When you're ready to return the car, simply call us to arrange a drop-off at your preferred location. Our representative will meet you, inspect the vehicle, and provide you with the final settlement amount. Your refundable security deposit will be returned at this point, minus any applicable deductions.",
  },
];

export default function HowItWorksPage() {
  return (
    <div
      style={{
        paddingTop: "72px",
        minHeight: "100vh",
        backgroundColor: OFFWHITE,
        paddingBottom: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 0",
          boxSizing: "border-box",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "36px",
              fontWeight: 700,
              color: NAVY,
              margin: "0 0 0.75rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            How It Works
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1rem",
              color: "#6b7280",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Renting a car with SmartWheels is simple and transparent.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {STEPS.map((step, index) => (
            <article
              key={step.title}
              style={{
                backgroundColor: WHITE,
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 16px rgba(26, 31, 94, 0.08)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: NAVY,
                    color: WHITE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: NAVY,
                      margin: "0 0 0.5rem",
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "15px",
                      color: "#444444",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
