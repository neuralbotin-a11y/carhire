"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAVY = "#1a1f5e";
const WHITE = "#ffffff";

const loginButtonStyle: React.CSSProperties = {
  backgroundColor: NAVY,
  color: WHITE,
  padding: "0.6rem 1.4rem",
  borderRadius: "999px",
  fontSize: "0.875rem",
  fontWeight: 600,
  textDecoration: "none",
  whiteSpace: "nowrap",
  textAlign: "center",
};

export default function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navLinkStyle: React.CSSProperties = {
    color: isHomepage ? WHITE : NAVY,
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
  };

  const navStyle: React.CSSProperties = isHomepage
    ? {
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        width: "100%",
      }
    : {
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        width: "100%",
      };

  const mobileMenuStyle: React.CSSProperties = isHomepage
    ? {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.18)",
        padding: "1rem 1.5rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }
    : {
        width: "100%",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        padding: "1rem 1.5rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      };

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <nav style={navStyle}>
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/logo.svg"
            alt="SmartWheels"
            style={{ height: "52px", width: "auto" }}
          />
        </Link>

        {isMobile ? (
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2.5rem",
              height: "2.5rem",
              fontSize: "1.5rem",
              color: isHomepage ? WHITE : NAVY,
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ☰
          </button>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <Link href="/" style={navLinkStyle}>
                Home
              </Link>
              <Link href="/cars" style={navLinkStyle}>
                Cars
              </Link>
              <Link href="how-it-works" style={navLinkStyle}>
                How It Works
              </Link>
            </div>

            <Link href="/login" style={loginButtonStyle}>
              Login / Sign Up
            </Link>
          </>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={mobileMenuStyle}>
          <Link
            href="/"
            style={navLinkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/cars"
            style={navLinkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Cars
          </Link>
          <Link
            href="#how-it-works"
            style={navLinkStyle}
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/login"
            style={{ ...loginButtonStyle, width: "100%", boxSizing: "border-box" }}
            onClick={() => setMenuOpen(false)}
          >
            Login / Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
