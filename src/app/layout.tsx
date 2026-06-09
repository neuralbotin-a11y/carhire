// layout.tsx — Root layout. Wraps every page with Navbar.

import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ui/ConditionalNavbar";

export const metadata: Metadata = {
  title: "SmartWheels — Self Drive Car Rentals in Goa",
  description: "Book self-drive rental cars in Goa. Simple, affordable, no driver needed.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConditionalNavbar />
        <main className="min-h-screen bg-brand-offwhite">
          {children}
        </main>
      </body>
    </html>
  );
}