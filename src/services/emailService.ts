interface BookingEmailData {
  bookingId: string
  carName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupLocation: string
  dropoffLocation: string
  pickupDatetime: string
  returnDatetime: string
  durationDays: number
  pricePerDay: number
  totalPrice: number
  securityDeposit: number
}

export async function sendBookingEmails(booking: BookingEmailData): Promise<void> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error('[emailService] BREVO_API_KEY is not set');
      return;
    }

    const sender = { name: 'SmartWheels', email: 'bookings@smartwheels.in' };

    const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
    const bookingRef = `AG-${String(booking.bookingId).slice(0, 8).toUpperCase()}`;

    // Email 1: Customer confirmation
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1f5e;">Booking Request Received</h2>
        <p>Hi ${booking.customerName},</p>
        <p>Thanks for choosing SmartWheels! Your booking request has been received and we'll confirm shortly via WhatsApp or email.</p>
        <table style="width:100%; border-collapse: collapse; margin: 1.5rem 0;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Booking Ref</td><td style="padding: 8px 0; font-weight: bold; color: #1a1f5e;">${bookingRef}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Car</td><td style="padding: 8px 0;">${booking.carName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Pickup</td><td style="padding: 8px 0;">${booking.pickupLocation} — ${new Date(booking.pickupDatetime).toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Drop-off</td><td style="padding: 8px 0;">${booking.dropoffLocation} — ${new Date(booking.returnDatetime).toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Duration</td><td style="padding: 8px 0;">${booking.durationDays} days</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Rate</td><td style="padding: 8px 0;">${fmt(booking.pricePerDay)} / day</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Security Deposit</td><td style="padding: 8px 0;">${fmt(booking.securityDeposit)} (refundable on return)</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Total Payable</td><td style="padding: 8px 0; font-weight: bold; font-size: 1.1em; color: #1a1f5e;">${fmt(booking.totalPrice)}</td></tr>
        </table>
        <p style="color: #6b7280; font-size: 0.875rem;">Questions? Contact us at bookings@smartwheels.in or +91 777 405 6566</p>
      </div>
    `;

    // Email 2: Admin notification
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1f5e;">New Booking Request</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Booking Ref</td><td style="padding: 8px 0; font-weight: bold;">${bookingRef}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Customer</td><td style="padding: 8px 0;">${booking.customerName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;">${booking.customerPhone}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;">${booking.customerEmail}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Car</td><td style="padding: 8px 0;">${booking.carName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Pickup</td><td style="padding: 8px 0;">${booking.pickupLocation} — ${new Date(booking.pickupDatetime).toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Drop-off</td><td style="padding: 8px 0;">${booking.dropoffLocation} — ${new Date(booking.returnDatetime).toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Duration</td><td style="padding: 8px 0;">${booking.durationDays} days</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Total</td><td style="padding: 8px 0; font-weight: bold;">${fmt(booking.totalPrice)}</td></tr>
        </table>
      </div>
    `;

    const sendEmail = async (to: { email: string; name: string }, subject: string, html: string) => {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, to: [to], subject, htmlContent: html }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`[emailService] Brevo error (${res.status}):`, text);
      }
    };

    await sendEmail(
      { email: booking.customerEmail, name: booking.customerName },
      'Booking Confirmed – SmartWheels Goa',
      customerHtml
    );

    await sendEmail(
      { email: 'bookings@smartwheels.in', name: 'SmartWheels Admin' },
      `New Booking – ${booking.customerName} – ${booking.carName}`,
      adminHtml
    );

  } catch (err) {
    console.error('[emailService] Unexpected error:', err);
  }
}
