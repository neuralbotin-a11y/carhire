import { supabase } from '@/lib/supabase';

export type { BookingStatus } from '@/lib/types';

export type CancellationActor = 'customer' | 'admin' | 'system';

// ── Audit log ────────────────────────────────────────────────

async function writeAuditLog({
  bookingId,
  customerName,
  adminEmail,
  oldValue,
  newValue,
  note,
}: {
  bookingId: string;
  customerName: string;
  adminEmail: string;
  oldValue: string;
  newValue: string;
  note: string;
}): Promise<void> {
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('tenant_id')
    .eq('id', bookingId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to write audit log: ${fetchError.message}`);
  }

  const { error } = await supabase.from('audit_logs').insert({
    tenant_id:     booking.tenant_id,
    admin_email:   adminEmail,
    booking_id:    bookingId,
    customer_name: customerName,
    field_changed: 'status',
    old_value:     oldValue,
    new_value:     newValue,
    note,
  });

  if (error) {
    throw new Error(`Failed to write audit log: ${error.message}`);
  }
}

// ── Status updates ───────────────────────────────────────────

export async function confirmBooking(params: {
  bookingId: string;
  customerName: string;
  adminEmail: string;
  assignedRegistration: string;
  discountAmount: number;
  promoCode?: string;
  adminNote: string;
  previousStatus: string;
}): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({
      status:                'confirmed',
      assigned_registration: params.assignedRegistration,
      discount_amount:       params.discountAmount,
      promo_code:            params.promoCode ?? null,
      admin_note:            params.adminNote,
      confirmed_at:          new Date().toISOString(),
      updated_at:            new Date().toISOString(),
    })
    .eq('id', params.bookingId);

  if (error) {
    throw new Error(`Failed to confirm booking: ${error.message}`);
  }

  await writeAuditLog({
    bookingId:    params.bookingId,
    customerName: params.customerName,
    adminEmail:   params.adminEmail,
    oldValue:     params.previousStatus,
    newValue:     'confirmed',
    note:         params.adminNote,
  });
}

export async function activateBooking(params: {
  bookingId: string;
  customerName: string;
  adminEmail: string;
  pickupConfirmedAt: string;
  specialRequests?: string;
  adminNote: string;
  previousStatus: string;
}): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({
      status:              'active',
      pickup_confirmed_at: params.pickupConfirmedAt,
      special_requests:    params.specialRequests ?? null,
      admin_note:          params.adminNote,
      updated_at:          new Date().toISOString(),
    })
    .eq('id', params.bookingId);

  if (error) {
    throw new Error(`Failed to activate booking: ${error.message}`);
  }

  await writeAuditLog({
    bookingId:    params.bookingId,
    customerName: params.customerName,
    adminEmail:   params.adminEmail,
    oldValue:     params.previousStatus,
    newValue:     'active',
    note:         params.adminNote,
  });
}

export async function completeBooking(params: {
  bookingId: string;
  customerName: string;
  adminEmail: string;
  returnConfirmedAt: string;
  finalAmount: number;
  discountAmount: number;
  penaltyAmount: number;
  washingDeduction: number;
  refundAmount: number;
  adminNote: string;
  previousStatus: string;
  existingMetadata: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({
      status:              'completed',
      total_price:         params.finalAmount,
      discount_amount:     params.discountAmount,
      return_confirmed_at: params.returnConfirmedAt,
      admin_note:          params.adminNote,
      metadata: {
        ...params.existingMetadata,
        penaltyAmount:    params.penaltyAmount,
        washingDeduction: params.washingDeduction,
        refundAmount:     params.refundAmount,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.bookingId);

  if (error) {
    throw new Error(`Failed to complete booking: ${error.message}`);
  }

  await writeAuditLog({
    bookingId:    params.bookingId,
    customerName: params.customerName,
    adminEmail:   params.adminEmail,
    oldValue:     params.previousStatus,
    newValue:     'completed',
    note:         params.adminNote,
  });
}

export async function cancelBooking(params: {
  bookingId: string;
  customerName: string;
  adminEmail: string;
  cancelledBy: CancellationActor;
  cancellationReason: string;
  refundAmount: number;
  adminNote: string;
  previousStatus: string;
  existingMetadata: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({
      status:              'cancelled',
      cancelled_by:        params.cancelledBy,
      cancellation_reason: params.cancellationReason,
      cancelled_at:        new Date().toISOString(),
      admin_note:          params.adminNote,
      metadata: {
        ...params.existingMetadata,
        refundAmount: params.refundAmount,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.bookingId);

  if (error) {
    throw new Error(`Failed to cancel booking: ${error.message}`);
  }

  await writeAuditLog({
    bookingId:    params.bookingId,
    customerName: params.customerName,
    adminEmail:   params.adminEmail,
    oldValue:     params.previousStatus,
    newValue:     'cancelled',
    note:         params.adminNote,
  });
}

export async function revertToPending(params: {
  bookingId: string;
  customerName: string;
  adminEmail: string;
  adminNote: string;
  previousStatus: string;
}): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({
      status:     'pending',
      admin_note: params.adminNote,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.bookingId);

  if (error) {
    throw new Error(`Failed to revert booking to pending: ${error.message}`);
  }

  await writeAuditLog({
    bookingId:    params.bookingId,
    customerName: params.customerName,
    adminEmail:   params.adminEmail,
    oldValue:     params.previousStatus,
    newValue:     'pending',
    note:         params.adminNote,
  });
}
