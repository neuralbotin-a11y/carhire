"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCATIONS, validateBooking } from "@/lib/pricing";

const NAVY = "#1a1f5e";
const WHITE = "#ffffff";
const OFFWHITE = "#f4f6fb";

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
  maxWidth: "100%",
  height: "3rem",
  boxSizing: "border-box",
  padding: "0.75rem 0.875rem",
  fontSize: "0.9375rem",
  fontFamily: "'DM Sans', sans-serif",
  color: NAVY,
  backgroundColor: OFFWHITE,
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  outline: "none",
};

const datetimeFieldStyle: React.CSSProperties = {
  ...fieldStyle,
  display: "block",
  minWidth: 0,
  maxWidth: "100%",
  WebkitAppearance: "none",
  appearance: "none",
};

const errorTextStyle: React.CSSProperties = {
  marginTop: "0.35rem",
  fontSize: "0.8125rem",
  color: "#dc2626",
  lineHeight: 1.4,
};

const ADVANCE_NOTICE_ERROR = "Pickup must be scheduled at least 24 hours in advance.";
const MINIMUM_DURATION_ERROR = "Minimum booking duration is 3 days (72 hours).";

const selectStyle: React.CSSProperties = {
  ...fieldStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1f5e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.875rem center",
  paddingRight: "2.25rem",
};

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState<string>(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [dropoffLocation, setDropoffLocation] = useState<string>(LOCATIONS[0]);
  const [searchHover, setSearchHover] = useState(false);
  const [pickupError, setPickupError] = useState("");
  const [returnError, setReturnError] = useState("");

  const now = toDatetimeLocal(new Date());

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    setPickupError("");
    setReturnError("");

    const dropoff = differentDropoff ? dropoffLocation : location;

    if (!pickupDate) {
      setPickupError("Please select a pickup date.");
      return;
    }

    if (!returnDate) {
      setReturnError("Please select a return date.");
      return;
    }

    const pickupDatetime = new Date(pickupDate);
    const returnDatetime = new Date(returnDate);

    const validation = validateBooking(pickupDatetime, returnDatetime);

    if (!validation.valid) {
      let pickupMsg = "";
      let returnMsg = "";

      for (const error of validation.errors) {
        if (error === ADVANCE_NOTICE_ERROR) {
          pickupMsg = error;
        } else if (error === MINIMUM_DURATION_ERROR) {
          returnMsg = error;
        } else {
          returnMsg = returnMsg ? `${returnMsg} ${error}` : error;
        }
      }

      if (pickupMsg) setPickupError(pickupMsg);
      if (returnMsg) setReturnError(returnMsg);
      return;
    }

    const params = new URLSearchParams({
      location,
      dropoff,
      pickup: pickupDate,
      return: returnDate,
    });

    router.push(`/cars?${params.toString()}`);
  }

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "4rem 1.5rem",
        paddingTop: "calc(72px + 4rem)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(26, 31, 94, 0.55)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "960px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            display: "inline-block",
            marginBottom: "1.25rem",
            padding: "0.35rem 1rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.9)",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            borderRadius: "999px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          Goa&apos;s trusted self-drive rentals
        </p>

        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: WHITE,
            marginBottom: "1rem",
            textShadow: "0 2px 24px rgba(0, 0, 0, 0.25)",
          }}
        >
          Explore Goa On Your Terms
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.88)",
            marginBottom: "2.75rem",
            lineHeight: 1.5,
            maxWidth: "520px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Self-drive car rentals. No driver. No hassle.
        </p>

        <form
          onSubmit={handleSearch}
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            backgroundColor: WHITE,
            borderRadius: "16px",
            padding: "1.75rem 1.5rem",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.06)",
            textAlign: "left",
          }}
        >
          <style>{`
            .widget-container {
              width: 100%;
              min-width: 0;
              box-sizing: border-box;
            }
            .widget-row-1 {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              width: 100%;
              min-width: 0;
              box-sizing: border-box;
            }
            .widget-field {
              flex: 1;
              min-width: 0;
              box-sizing: border-box;
            }
            .widget-search-btn {
              flex-shrink: 0;
              width: 140px;
              align-self: flex-start;
              box-sizing: border-box;
            }
            .widget-checkbox {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-top: 16px;
              box-sizing: border-box;
            }
            .widget-dropoff-wrap {
              width: calc((100% - 140px - 36px) / 3);
              max-width: calc((100% - 140px - 36px) / 3);
              margin-top: 16px;
              box-sizing: border-box;
            }
            @media (max-width: 767px) {
              .widget-container {
                display: flex;
                flex-direction: column;
              }
              .widget-row-1 {
                display: contents;
              }
              .widget-field,
              .widget-search-btn,
              .widget-dropoff-wrap {
                width: 100%;
                max-width: 100%;
              }
              .widget-location { order: 1; }
              .widget-pickup { order: 2; }
              .widget-return { order: 3; }
              .widget-checkbox { order: 4; margin-top: 0; }
              .widget-dropoff-wrap { order: 5; margin-top: 0; }
              .widget-search-btn { order: 6; }
              .widget-search-spacer { display: none; }
            }
          `}</style>

          <div className="widget-container">
            <div className="widget-row-1">
              <div className="widget-field widget-location">
                <label htmlFor="location" style={labelStyle}>
                  Location
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={selectStyle}
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="widget-field widget-pickup" style={{ overflow: "hidden" }}>
                <label htmlFor="pickup-date" style={labelStyle}>
                  Pickup Date
                </label>
                <input
                  id="pickup-date"
                  type="datetime-local"
                  value={pickupDate}
                  min={now}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    setPickupError("");
                  }}
                  style={datetimeFieldStyle}
                />
                {pickupError && <p style={errorTextStyle}>{pickupError}</p>}
              </div>

              <div className="widget-field widget-return" style={{ overflow: "hidden" }}>
                <label htmlFor="return-date" style={labelStyle}>
                  Return Date
                </label>
                <input
                  id="return-date"
                  type="datetime-local"
                  value={returnDate}
                  min={pickupDate || now}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    setReturnError("");
                  }}
                  style={datetimeFieldStyle}
                />
                {returnError && <p style={errorTextStyle}>{returnError}</p>}
              </div>

              <div className="widget-search-btn">
                <span className="widget-search-spacer" style={{ ...labelStyle, visibility: "hidden" }} aria-hidden="true">
                  Search
                </span>
                <button
                  type="submit"
                  onMouseEnter={() => setSearchHover(true)}
                  onMouseLeave={() => setSearchHover(false)}
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 1.5rem",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    color: WHITE,
                    backgroundColor: searchHover ? "#2d3494" : NAVY,
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    boxShadow: "0 4px 14px rgba(26, 31, 94, 0.35)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            <label
              htmlFor="different-dropoff"
              className="widget-checkbox"
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: NAVY,
                cursor: "pointer",
              }}
            >
              <input
                id="different-dropoff"
                type="checkbox"
                checked={differentDropoff}
                onChange={(e) => setDifferentDropoff(e.target.checked)}
                style={{ width: "1rem", height: "1rem", cursor: "pointer", accentColor: NAVY }}
              />
              Different drop-off location?
            </label>

            {differentDropoff && (
              <div className="widget-dropoff-wrap">
                <label htmlFor="dropoff-location" style={labelStyle}>
                  Drop-off Location
                </label>
                <select
                  id="dropoff-location"
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
            )}
          </div>
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.8125rem",
            color: "rgba(255, 255, 255, 0.65)",
            fontWeight: 500,
          }}
        >
          Easy cancellation · Transparent pricing · Quick confirmation
        </p>
      </div>
    </section>
  );
}
