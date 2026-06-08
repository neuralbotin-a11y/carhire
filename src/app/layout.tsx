// layout.tsx — Root layout. Wraps every page with Navbar.

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "CarHire Goa — Self Drive Car Rentals",
  description: "Book self-drive rental cars in Goa. Simple, affordable, no driver needed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-brand-offwhite">
          {children}
        </main>
      </body>
    </html>
  );
}