"use client";

import { useState } from "react";

const LOCATIONS = [
  "Panaji",
  "Calangute",
  "Margao",
  "Vasco",
  "Airport (Dabolim)",
] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1580584126903-c17d4184de1e?auto=format&fit=crop&w=1920&q=80";

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
  padding: "0.75rem 0.875rem",
  fontSize: "0.9375rem",
  fontFamily: "'DM Sans', sans-serif",
  color: NAVY,
  backgroundColor: OFFWHITE,
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  outline: "none",
};

export default function Home() {
  const [location, setLocation] = useState<string>(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [searchHover, setSearchHover] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(26, 31, 94, 0.78), rgba(26, 31, 94, 0.85)), url(${HERO_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "4rem 1.5rem",
      }}
    >
      <div
        style={{
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
            backgroundColor: WHITE,
            borderRadius: "16px",
            padding: "1.75rem 1.5rem",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.06)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: "1 1 180px", minWidth: "140px" }}>
              <label htmlFor="location" style={labelStyle}>
                Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  ...fieldStyle,
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1f5e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.875rem center",
                  paddingRight: "2.25rem",
                }}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: "1 1 160px", minWidth: "140px" }}>
              <label htmlFor="pickup-date" style={labelStyle}>
                Pickup Date
              </label>
              <input
                id="pickup-date"
                type="date"
                value={pickupDate}
                min={today}
                onChange={(e) => setPickupDate(e.target.value)}
                style={fieldStyle}
              />
            </div>

            <div style={{ flex: "1 1 160px", minWidth: "140px" }}>
              <label htmlFor="return-date" style={labelStyle}>
                Return Date
              </label>
              <input
                id="return-date"
                type="date"
                value={returnDate}
                min={pickupDate || today}
                onChange={(e) => setReturnDate(e.target.value)}
                style={fieldStyle}
              />
            </div>

            <div style={{ flex: "0 0 auto", minWidth: "120px" }}>
              <button
                type="submit"
                onMouseEnter={() => setSearchHover(true)}
                onMouseLeave={() => setSearchHover(false)}
                style={{
                  width: "100%",
                  padding: "0.8rem 2rem",
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
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.8125rem",
            color: "rgba(255, 255, 255, 0.65)",
            fontWeight: 500,
          }}
        >
          Free cancellation · Transparent pricing · Instant confirmation
        </p>
      </div>
    </section>
  );
}
