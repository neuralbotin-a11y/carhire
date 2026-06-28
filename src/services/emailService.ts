// ⚠️ SERVER-SIDE ONLY — never import this from a client component.
// Sends transactional emails through the Brevo API using the secret BREVO_API_KEY.

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

const SENDER = { name: 'SmartWheels', email: 'bookings@smartwheels.in' };
const ADMIN_EMAIL = 'bookings@smartwheels.in';

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDatetime: string;
  returnDatetime: string;
  durationDays: number;
  pricePerDay: number;
  totalPrice: number;
  securityDeposit: number;
  carName: string;
  bookingId: string;
}

// ── Formatting helpers ───────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
    hour12:  true,
  });
}

// ── Email templates ──────────────────────────────────────────

function customerEmailHtml(b: BookingEmailData): string {
  const ref = b.bookingId.slice(0, 8);
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5;">
    <h2 style="color: #1a1f5e;">Booking Confirmed</h2>
    <p>Hi ${b.customerName},</p>
    <p>Thank you for booking with <strong>SmartWheels Goa</strong>. Your reservation is confirmed. Here are your booking details:</p>

    <p style="margin: 16px 0;"><strong>Booking reference:</strong> ${ref}</p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0;"><strong>Car</strong></td><td style="padding: 6px 0;">${b.carName}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Pickup location</strong></td><td style="padding: 6px 0;">${b.pickupLocation}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Dropoff location</strong></td><td style="padding: 6px 0;">${b.dropoffLocation}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Pickup</strong></td><td style="padding: 6px 0;">${formatDateTime(b.pickupDatetime)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Return</strong></td><td style="padding: 6px 0;">${formatDateTime(b.returnDatetime)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Duration</strong></td><td style="padding: 6px 0;">${b.durationDays} day${b.durationDays === 1 ? '' : 's'}</td></tr>
    </table>

    <h3 style="color: #1a1f5e; margin-top: 24px;">Pricing</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0;"><strong>Price per day</strong></td><td style="padding: 6px 0;">${formatCurrency(b.pricePerDay)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Security deposit</strong></td><td style="padding: 6px 0;">${formatCurrency(b.securityDeposit)} <span style="color: #777; font-size: 13px;">(Refundable on return)</span></td></tr>
      <tr><td style="padding: 6px 0; border-top: 1px solid #ddd;"><strong>Total amount payable</strong></td><td style="padding: 6px 0; border-top: 1px solid #ddd;"><strong>${formatCurrency(b.totalPrice)}</strong></td></tr>
    </table>

    <p style="margin-top: 24px;">Need to reach us?<br/>
      <strong>+91 777 405 6566</strong> &nbsp;|&nbsp; <strong>bookings@smartwheels.in</strong>
    </p>

    <p style="color: #777; font-size: 13px; margin-top: 24px;">SmartWheels Goa — Drive Smart.</p>
  </div>`;
}

function adminEmailHtml(b: BookingEmailData): string {
  const ref = b.bookingId.slice(0, 8);
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 640px; color: #111; line-height: 1.5;">
    <h2>New Booking Received</h2>
    <p><strong>Booking reference:</strong> ${ref} (${b.bookingId})</p>

    <h3>Customer</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 4px 0;"><strong>Name</strong></td><td style="padding: 4px 0;">${b.customerName}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Email</strong></td><td style="padding: 4px 0;">${b.customerEmail}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Phone</strong></td><td style="padding: 4px 0;">${b.customerPhone}</td></tr>
    </table>

    <h3>Trip</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 4px 0;"><strong>Car</strong></td><td style="padding: 4px 0;">${b.carName}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Pickup location</strong></td><td style="padding: 4px 0;">${b.pickupLocation}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Dropoff location</strong></td><td style="padding: 4px 0;">${b.dropoffLocation}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Pickup</strong></td><td style="padding: 4px 0;">${formatDateTime(b.pickupDatetime)}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Return</strong></td><td style="padding: 4px 0;">${formatDateTime(b.returnDatetime)}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Duration</strong></td><td style="padding: 4px 0;">${b.durationDays} day${b.durationDays === 1 ? '' : 's'}</td></tr>
    </table>

    <h3>Pricing</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 4px 0;"><strong>Price per day</strong></td><td style="padding: 4px 0;">${formatCurrency(b.pricePerDay)}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Security deposit</strong></td><td style="padding: 4px 0;">${formatCurrency(b.securityDeposit)} (Refundable on return)</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Total amount payable</strong></td><td style="padding: 4px 0;"><strong>${formatCurrency(b.totalPrice)}</strong></td></tr>
    </table>
  </div>`;
}

// ── Brevo API ────────────────────────────────────────────────

interface BrevoPayload {
  sender: { name: string; email: string };
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

async function sendViaBrevo(payload: BrevoPayload, label: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error(`[emailService] BREVO_API_KEY is not set — skipping ${label} email.`);
    return;
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key':      apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '<unreadable body>');
    console.error(
      `[emailService] Failed to send ${label} email. Status ${res.status}: ${body}`,
    );
  }
}

// ── Public API ───────────────────────────────────────────────

export async function sendBookingEmails(booking: BookingEmailData): Promise<void> {
  try {
    const customerEmail: BrevoPayload = {
      sender:  SENDER,
      to:      [{ email: booking.customerEmail, name: booking.customerName }],
      subject: 'Booking Confirmed – SmartWheels Goa',
      htmlContent: customerEmailHtml(booking),
    };

    const adminEmail: BrevoPayload = {
      sender:  SENDER,
      to:      [{ email: ADMIN_EMAIL }],
      subject: `New Booking – ${booking.customerName} – ${booking.carName}`,
      htmlContent: adminEmailHtml(booking),
    };

    await Promise.all([
      sendViaBrevo(customerEmail, 'customer confirmation'),
      sendViaBrevo(adminEmail, 'admin notification'),
    ]);
  } catch (err) {
    // Booking is already persisted in Supabase — never surface email failures.
    console.error('[emailService] Unexpected error sending booking emails:', err);
  }
}
