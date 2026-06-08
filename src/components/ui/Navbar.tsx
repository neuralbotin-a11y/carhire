"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{backgroundColor:"#ffffff", boxShadow:"0 2px 16px 0 rgba(26,31,94,0.08)", position:"sticky", top:0, zIndex:50, width:"100%"}}>
      <div style={{maxWidth:"1152px", margin:"0 auto", padding:"1rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between"}}>

        {/* Logo */}
        <Link href="/" style={{textDecoration:"none", display:"flex", alignItems:"center"}}>
        <img 
             src="/logo.svg" 
             alt="SmartWheels" 
            style={{height:"52px", width:"auto"}}
         />
         </Link>

        {/* Desktop Links — hidden on mobile */}
        <div style={{display:"flex", alignItems:"center", gap:"2rem", fontSize:"0.875rem", fontWeight:500}}>
          <Link href="/" style={{color:"#1a1f5e", textDecoration:"none"}}>Home</Link>
          <Link href="/cars" style={{color:"#1a1f5e", textDecoration:"none"}}>Our Fleet</Link>
          <Link href="#how-it-works" style={{color:"#1a1f5e", textDecoration:"none"}}>How It Works</Link>
          <Link href="/contact" style={{color:"#1a1f5e", textDecoration:"none"}}>Contact</Link>
        </div>

        {/* Book Now */}
        <Link
          href="/booking"
          style={{backgroundColor:"#1a1f5e", color:"#ffffff", padding:"0.6rem 1.4rem", borderRadius:"999px", fontSize:"0.875rem", fontWeight:600, textDecoration:"none", whiteSpace:"nowrap"}}
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}
