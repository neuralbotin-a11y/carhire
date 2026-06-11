"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { bookingService } from "@/services/booking.service";

const NAVY = "#1a1f5e";
const WHITE = "#ffffff";
const OFFWHITE = "#f4f6fb";
const PRICE_PER_DAY = 1500;

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: "0.5rem",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem",
  fontSize: "0.9375rem",
  fontFamily: "'DM Sans', sans-serif",
  color: NAVY,
  backgroundColor: OFFWHITE,
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  outline: "none",
};

const cardShadow: React.CSSProperties = {
  boxShadow: "0 8px 32px rgba(26, 31, 94, 0.1), 0 0 0 1px rgba(26, 31, 94, 0.04)",
};

function formatDatetime(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDays(pickup: string, returnDate: string) {
  if (!pickup || !returnDate) return 1;
  const start = new Date(pickup);
  const end = new Date(returnDate);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 1;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function CarsPageContent() {
  const searchParams = useSearchParams();

  const location = searchParams.get("location") ?? "";
  const dropLocation = searchParams.get("dropLocation") ?? "";
  const pickup = searchParams.get("pickup") ?? "";
  const returnDate = searchParams.get("returnDate") ?? "";

  const days = useMemo(() => getDays(pickup, returnDate), [pickup, returnDate]);
  const totalPrice = days * PRICE_PER_DAY;

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectHover, setSelectHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const { error } = await bookingService.create({
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email,
      customer_address: address,
      pickup_location: location,
      dropoff_location: dropLocation,
      different_dropoff: !!dropLocation && dropLocation !== location,
      pickup_datetime: pickup,
      return_datetime: returnDate,
      special_requests: specialRequests,
    });

    if (error) {
      setSubmitError(error);
    } else {
      setSubmitted(true);
    }

    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "2rem 1.5rem 3rem",
        }}
      >
        <div
          style={{
            ...cardShadow,
            backgroundColor: WHITE,
            borderRadius: "16px",
            padding: "3rem 2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <span style={{ fontSize: "1.75rem", color: "#16a34a" }}>✓</span>
          </div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: NAVY,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Booking Request Received!
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              lineHeight: 1.6,
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            Thanks {firstName}! We&apos;ll confirm your booking via WhatsApp or email within a few
            hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "2rem 1.5rem 3rem",
      }}
    >
      <div
        style={{
          ...cardShadow,
          backgroundColor: WHITE,
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem 2rem",
        }}
      >
        {[
          { label: "Pickup Location", value: location || "—" },
          { label: "Drop-off Location", value: dropLocation || "—" },
          { label: "Pickup", value: formatDatetime(pickup) },
          { label: "Return", value: formatDatetime(returnDate) },
          {
            label: "Duration",
            value: `${days} day${days === 1 ? "" : "s"}`,
          },
        ].map((item) => (
          <div key={item.label} style={{ minWidth: "140px" }}>
            <p style={{ ...labelStyle, marginBottom: "0.35rem" }}>{item.label}</p>
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: NAVY,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          ...cardShadow,
          backgroundColor: WHITE,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              flex: "1 1 280px",
              position: "relative",
              minHeight: "200px",
              backgroundColor: OFFWHITE,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Image
              src="/baleno.png"
              alt="Maruti Baleno"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column" }}>
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: NAVY,
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Maruti Baleno
            </h1>

            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "1rem",
              }}
            >
              Petrol · Manual · 5 Seater
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              {["Petrol", "Manual", "5 Seater"].map((badge) => (
                <span
                  key={badge}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: NAVY,
                    backgroundColor: OFFWHITE,
                    padding: "0.35rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            <p style={{ marginBottom: "1.25rem" }}>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: NAVY,
                }}
              >
                ₹{PRICE_PER_DAY.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.875rem", color: "#6b7280", marginLeft: "0.25rem" }}>
                /day
              </span>
            </p>

            <button
              type="button"
              onClick={() => setShowBookingForm(true)}
              onMouseEnter={() => setSelectHover(true)}
              onMouseLeave={() => setSelectHover(false)}
              style={{
                marginTop: "auto",
                alignSelf: "flex-start",
                padding: "0.75rem 1.75rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                color: WHITE,
                backgroundColor: selectHover ? "#2d3494" : NAVY,
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                boxShadow: "0 4px 14px rgba(26, 31, 94, 0.25)",
              }}
            >
              Select This Car
            </button>
          </div>
        </div>

        {showBookingForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: "1px solid #e2e8f0",
              padding: "1.5rem",
              backgroundColor: OFFWHITE,
            }}
          >
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.125rem",
                fontWeight: 700,
                color: NAVY,
                marginBottom: "1.25rem",
              }}
            >
              Complete Your Booking
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label htmlFor="full-name" style={labelStyle}>
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label htmlFor="phone" style={labelStyle}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label htmlFor="email" style={labelStyle}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="address" style={labelStyle}>
                  Address in Goa (where you&apos;re staying)
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="special-requests" style={labelStyle}>
                  Special Requests (optional)
                </label>
                <textarea
                  id="special-requests"
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  style={{ ...fieldStyle, resize: "vertical" }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginTop: "1.25rem",
                padding: "1.25rem",
                backgroundColor: WHITE,
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div>
                <p style={{ ...labelStyle, marginBottom: "0.25rem" }}>Total Price</p>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: NAVY,
                  }}
                >
                  ₹{totalPrice.toLocaleString("en-IN")}
                </p>
                <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {days} day{days === 1 ? "" : "s"} × ₹{PRICE_PER_DAY.toLocaleString("en-IN")}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                {submitError && (
                  <div
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "10px",
                      color: "#dc2626",
                      fontSize: "0.875rem",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  onMouseEnter={() => setSubmitHover(true)}
                  onMouseLeave={() => setSubmitHover(false)}
                  style={{
                    padding: "0.8rem 2rem",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    color: WHITE,
                    backgroundColor: submitting ? "#6b7280" : submitHover ? "#2d3494" : NAVY,
                    border: "none",
                    borderRadius: "10px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s ease",
                    boxShadow: "0 4px 14px rgba(26, 31, 94, 0.35)",
                    whiteSpace: "nowrap",
                    opacity: submitting ? 0.8 : 1,
                  }}
                >
                  {submitting ? "Submitting…" : "Submit Booking Request"}
                </button>

                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#16a34a",
                    textAlign: "right",
                  }}
                >
                  ✓ No payment now — we&apos;ll confirm via WhatsApp or email before any charge
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "2rem 1.5rem",
            color: NAVY,
            fontSize: "0.9375rem",
          }}
        >
          Loading cars…
        </div>
      }
    >
      <CarsPageContent />
    </Suspense>
  );
}
