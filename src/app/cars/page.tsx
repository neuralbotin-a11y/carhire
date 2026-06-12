"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  LOCATIONS,
  calculatePrice,
  validateBooking,
  type PriceBreakdown,
} from "@/lib/pricing";
import { bookingService } from "@/services/booking.service";

const NAVY = "#1a1f5e";
const NAVY_LIGHT = "#2d3494";
const WHITE = "#ffffff";
const OFFWHITE = "#f4f6fb";
const BASE_RATE_PER_DAY = 1500;

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

const selectStyle: React.CSSProperties = {
  ...fieldStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1f5e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.875rem center",
  paddingRight: "2.25rem",
};

const datetimeFieldStyle: React.CSSProperties = {
  ...fieldStyle,
  display: "block",
  minWidth: 0,
  boxSizing: "border-box",
  WebkitAppearance: "none",
  appearance: "none",
};

const cardShadow: React.CSSProperties = {
  boxShadow: "0 8px 32px rgba(26, 31, 94, 0.1), 0 0 0 1px rgba(26, 31, 94, 0.04)",
};

const dividerStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "0.75rem 0",
};

function resolveLocation(param: string): string {
  if (LOCATIONS.includes(param)) return param;
  return LOCATIONS[0];
}

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isNightHour(datetime: Date): boolean {
  const hour = datetime.getHours();
  return hour >= 21 || hour < 7;
}

function getNightSurchargeNote(pickupDatetime: Date, returnDatetime: Date): string {
  const notes: string[] = [];
  if (isNightHour(pickupDatetime)) {
    notes.push("Pickup after 9 PM");
  }
  if (isNightHour(returnDatetime)) {
    notes.push("Drop-off before 7 AM");
  }
  return notes.join(" · ");
}

function formatRupee(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function PriceLine({
  label,
  amount,
  note,
  bold,
}: {
  label: string;
  amount: number;
  note?: string;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "1rem",
        fontSize: bold ? "0.9375rem" : "0.875rem",
        fontWeight: bold ? 600 : 400,
        color: NAVY,
      }}
    >
      <div style={{ flex: 1 }}>
        <span>{label}</span>
        {note && (
          <p
            style={{
              margin: "0.2rem 0 0",
              fontSize: "0.75rem",
              fontWeight: 400,
              color: "#6b7280",
              lineHeight: 1.4,
            }}
          >
            {note}
          </p>
        )}
      </div>
      <span style={{ whiteSpace: "nowrap" }}>{formatRupee(amount)}</span>
    </div>
  );
}

function PriceBreakdownCard({
  breakdown,
  pickupDatetime,
  returnDatetime,
}: {
  breakdown: PriceBreakdown;
  pickupDatetime: Date;
  returnDatetime: Date;
}) {
  return (
    <div style={{ flex: "1 1 280px", minWidth: "240px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <PriceLine
          label={`Base rate (₹${BASE_RATE_PER_DAY.toLocaleString("en-IN")} × ${breakdown.baseDays} days)`}
          amount={breakdown.baseRate}
        />
        <PriceLine label="Pickup location charge" amount={breakdown.pickupLocationCharge} />
        <PriceLine label="Drop-off location charge" amount={breakdown.dropoffLocationCharge} />
        {breakdown.nightSurcharge > 0 && (
          <PriceLine
            label="Night surcharge"
            amount={breakdown.nightSurcharge}
            note={getNightSurchargeNote(pickupDatetime, returnDatetime)}
          />
        )}
        <PriceLine label="Washing charge" amount={breakdown.washingCharge} />
      </div>

      <hr style={dividerStyle} />

      <PriceLine label="Subtotal" amount={breakdown.subtotal} bold />

      <div
        style={{
          marginTop: "0.75rem",
          padding: "0.75rem 1rem",
          backgroundColor: OFFWHITE,
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          <span style={{ fontStyle: "italic" }}>Refundable deposit</span>
          <span style={{ color: NAVY, fontWeight: 500 }}>{formatRupee(breakdown.securityDeposit)}</span>
        </div>
      </div>

      <hr style={dividerStyle} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: NAVY,
          }}
        >
          Total payable
        </span>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: NAVY,
          }}
        >
          {formatRupee(breakdown.totalPayable)}
        </span>
      </div>
    </div>
  );
}

function CarsPageContent() {
  const searchParams = useSearchParams();

  const [pickupLocation, setPickupLocation] = useState(() =>
    resolveLocation(searchParams.get("location") ?? "")
  );
  const [dropoffLocation, setDropoffLocation] = useState(() =>
    resolveLocation(
      searchParams.get("dropoff") ??
        searchParams.get("dropLocation") ??
        searchParams.get("location") ??
        ""
    )
  );
  const [pickup, setPickup] = useState(searchParams.get("pickup") ?? "");
  const [returnDate, setReturnDate] = useState(
    searchParams.get("return") ?? searchParams.get("returnDate") ?? ""
  );

  const pickupDatetime = useMemo(() => new Date(pickup), [pickup]);
  const returnDatetime = useMemo(() => new Date(returnDate), [returnDate]);

  const hasValidDates =
    !!pickup &&
    !!returnDate &&
    !Number.isNaN(pickupDatetime.getTime()) &&
    !Number.isNaN(returnDatetime.getTime());

  const validation = useMemo(() => {
    if (!hasValidDates) {
      return { valid: false, errors: [] as string[] };
    }
    return validateBooking(pickupDatetime, returnDatetime);
  }, [hasValidDates, pickupDatetime, returnDatetime]);

  const priceBreakdown = useMemo(() => {
    if (!hasValidDates) return null;
    return calculatePrice(pickupLocation, dropoffLocation, pickupDatetime, returnDatetime);
  }, [hasValidDates, pickupLocation, dropoffLocation, pickupDatetime, returnDatetime]);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectHover, setSelectHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

  const now = toDatetimeLocal(new Date());
  const firstName = fullName.trim().split(/\s+/)[0] || "there";
  const durationDays = priceBreakdown?.baseDays ?? 0;
  const submitDisabled = submitting || !validation.valid || !priceBreakdown;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitDisabled) return;

    setSubmitting(true);
    setSubmitError("");

    const { error } = await bookingService.create({
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email,
      customer_address: "",
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      different_dropoff: dropoffLocation !== pickupLocation,
      pickup_datetime: pickup,
      return_datetime: returnDate,
      special_requests: "",
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
        <div style={{ minWidth: "180px", flex: "1 1 180px" }}>
          <label htmlFor="summary-pickup-location" style={{ ...labelStyle, marginBottom: "0.35rem" }}>
            Pickup Location
          </label>
          <select
            id="summary-pickup-location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            style={selectStyle}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: "180px", flex: "1 1 180px" }}>
          <label htmlFor="summary-dropoff-location" style={{ ...labelStyle, marginBottom: "0.35rem" }}>
            Drop-off Location
          </label>
          <select
            id="summary-dropoff-location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            style={selectStyle}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: "180px", flex: "1 1 180px" }}>
          <label htmlFor="summary-pickup-datetime" style={{ ...labelStyle, marginBottom: "0.35rem" }}>
            Pickup
          </label>
          <input
            id="summary-pickup-datetime"
            type="datetime-local"
            value={pickup}
            min={now}
            onChange={(e) => setPickup(e.target.value)}
            style={datetimeFieldStyle}
          />
        </div>

        <div style={{ minWidth: "180px", flex: "1 1 180px" }}>
          <label htmlFor="summary-return-datetime" style={{ ...labelStyle, marginBottom: "0.35rem" }}>
            Return
          </label>
          <input
            id="summary-return-datetime"
            type="datetime-local"
            value={returnDate}
            min={pickup || now}
            onChange={(e) => setReturnDate(e.target.value)}
            style={datetimeFieldStyle}
          />
        </div>

        {validation.errors.length > 0 && (
          <div style={{ width: "100%", flex: "1 1 100%" }}>
            {validation.errors.map((error) => (
              <p
                key={error}
                style={{
                  margin: "0 0 0.35rem",
                  fontSize: "0.8125rem",
                  color: "#dc2626",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </p>
            ))}
          </div>
        )}

        <div style={{ minWidth: "140px" }}>
          <p style={{ ...labelStyle, marginBottom: "0.35rem" }}>Duration</p>
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: NAVY,
            }}
          >
            {hasValidDates
              ? `${durationDays} day${durationDays === 1 ? "" : "s"}`
              : "—"}
          </p>
        </div>
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
                ₹{BASE_RATE_PER_DAY.toLocaleString("en-IN")}
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
                backgroundColor: selectHover ? NAVY_LIGHT : NAVY,
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
              {priceBreakdown ? (
                <PriceBreakdownCard
                  breakdown={priceBreakdown}
                  pickupDatetime={pickupDatetime}
                  returnDatetime={returnDatetime}
                />
              ) : (
                <div style={{ flex: "1 1 280px", minWidth: "240px" }}>
                  <p style={{ ...labelStyle, marginBottom: "0.25rem" }}>Price</p>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Enter valid pickup and return dates to see pricing.
                  </p>
                </div>
              )}

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
                  disabled={submitDisabled}
                  onMouseEnter={() => setSubmitHover(true)}
                  onMouseLeave={() => setSubmitHover(false)}
                  style={{
                    padding: "0.8rem 2rem",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    color: WHITE,
                    backgroundColor: submitDisabled
                      ? "#6b7280"
                      : submitHover
                        ? NAVY_LIGHT
                        : NAVY,
                    border: "none",
                    borderRadius: "10px",
                    cursor: submitDisabled ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s ease",
                    boxShadow: "0 4px 14px rgba(26, 31, 94, 0.35)",
                    whiteSpace: "nowrap",
                    opacity: submitDisabled ? 0.8 : 1,
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
