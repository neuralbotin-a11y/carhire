Project Claude state as on 9th Jun 05:54. Use this to start new Claude Chat.

SmartWheels — Project Handoff Doc
Brand: SmartWheels (smartwheels.in), self-drive car hire portal, Goa
Live URL: https://carhire-ashen.vercel.app
Repo: https://github.com/neuralbotin-a11y/carhire
Stack: Next.js 14, TypeScript, Tailwind v3, Supabase (next), Vercel
Colors: navy #1a1f5e, navyLight #2d3494, white #ffffff, offwhite #f4f6fb
Rule: Always use inline styles — no Tailwind classes in components
Fonts: Outfit (headings), DM Sans (body) via Google Fonts
File structure:
src/
  app/
    page.tsx          ← Homepage with hero + search widget
    cars/page.tsx     ← Car results + booking form
    admin/page.tsx    ← Admin dashboard with login
  components/
    ui/
      Navbar.tsx      ← Shared navbar, used in layout.tsx
      Button.tsx      ← Shared button component
  app/layout.tsx      ← Root layout, includes Navbar
  app/globals.css     ← Global styles
public/
  logo.svg            ← SmartWheels logo
  baleno.png          ← Maruti Baleno car image
Pages built:

Homepage: hero banner, search widget (location, pickup datetime, return datetime, different dropoff checkbox)
Cars page: summary bar, Baleno card, booking form (name, phone, email, total price, submit)
Admin page: email/password login (admin@smartwheels.in / admin123), bookings table, status dropdown, mandatory note modal, WhatsApp button placeholder, search

Locations: Panaji, Calangute, Margao, Vasco, Airport (Dabolim)
Car: Maruti Baleno, Petrol, Manual, 5 Seater, ₹1500/day
Pricing: flat ₹1500/day for now, will vary by location later
Build phases:

✅ Phase 1: Booking form + admin dashboard
👉 Phase 2: Supabase integration (next)
Phase 3: Real car listings + availability
Phase 4: Customer login + KYC (DL, PAN)
Phase 5: Payments + WhatsApp notifications

Supabase schema (to be created):

bookings — id, created_at, customer_name, phone, email, pickup_location, dropoff_location, pickup_datetime, return_datetime, duration_days, total_price, status, car_id, metadata (jsonb)
audit_logs — id, timestamp, admin_email, booking_id, customer_name, field_changed, old_value, new_value, note
customer_documents — id, booking_id, document_type, file_url, uploaded_at, verified
cars — id, name, specs, price_per_day, image_url, available

Admin decisions:

Notes mandatory when changing booking status
All status changes logged to audit_logs in Supabase
WhatsApp button per row — UI only for now
Table is searchable by name, phone, email, location
