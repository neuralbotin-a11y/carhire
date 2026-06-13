import { supabase } from '@/lib/supabase';
import {
  Booking,
  BookingFull,
  BookingFormInput,
  BookingStatus,
  ServiceResult,
  BOOKING_TRANSITIONS,
} from '@/lib/types';

// ── Helpers ──────────────────────────────────────────────────

export function computeDurationDays(pickup: string, returnDt: string): number {
  const ms   = new Date(returnDt).getTime() - new Date(pickup).getTime();
  const days = ms / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.ceil(days));
}

// ── Get tenant ID for SmartWheels ────────────────────────────
// Until multi-tenant UI is built, all bookings go to SmartWheels tenant

async function getSmartWheelsTenantId(): Promise<string | null> {
  const { data } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', 'smartwheels')
    .single();
  return data?.id ?? null;
}

// ── Get Baleno model ID ───────────────────────────────────────

async function getBalenoModelId(tenantId: string): Promise<{ id: string; price_per_day: number; security_deposit: number } | null> {
  const { data } = await supabase
    .from('car_models')
    .select('id, price_per_day, security_deposit')
    .eq('tenant_id', tenantId)
    .eq('name', 'Maruti Baleno')
    .single();
  return data ?? null;
}

// ── Service ──────────────────────────────────────────────────

export const bookingService = {

  async create(input: BookingFormInput): Promise<ServiceResult<Booking>> {
    const tenantId = await getSmartWheelsTenantId();
    if (!tenantId) return { data: null, error: 'Tenant not found.' };

    const car = await getBalenoModelId(tenantId);
    if (!car) return { data: null, error: 'Car not found.' };

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        tenant_id:         tenantId,
        model_id:          car.id,
        // Customer snapshot
        customer_name:     input.customer_name.trim(),
        customer_phone:    input.customer_phone.trim(),
        customer_email:    input.customer_email.toLowerCase().trim(),
        customer_address:  input.customer_address?.trim() || null,
        // Car snapshot
        car_name:          'Maruti Baleno',
        car_category:      'hatchback',
        transmission:      'manual',
        fuel:              'petrol',
        seats:             5,
        // Trip
        pickup_location:   input.pickup_location,
        dropoff_location:  input.different_dropoff && input.dropoff_location
          ? input.dropoff_location
          : null,
        pickup_datetime:   input.pickup_datetime,
        return_datetime:   input.return_datetime,
        // Pricing
        price_per_day:     car.price_per_day,
        total_price:       input.total_price,
        security_deposit:  input.metadata.securityDeposit,
        discount_amount:   0,
        metadata:          input.metadata,
        // Extra
        special_requests:  input.special_requests?.trim() || null,
        status:            'pending',
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  },

  async getAll(filters?: {
    status?:   BookingStatus;
    search?:   string;
    location?: string;
    from?:     string;
    to?:       string;
  }): Promise<ServiceResult<BookingFull[]>> {
    let query = supabase
      .from('v_bookings_full')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status)   query = query.eq('status', filters.status);
    if (filters?.location) query = query.eq('pickup_location', filters.location);
    if (filters?.from)     query = query.gte('created_at', filters.from);
    if (filters?.to)       query = query.lte('created_at', filters.to);
    if (filters?.search) {
      const q = `%${filters.search}%`;
      query = query.or(
        `customer_name.ilike.${q},customer_email.ilike.${q},customer_phone.ilike.${q},pickup_location.ilike.${q}`
      );
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data: (data ?? []) as BookingFull[], error: null };
  },

  async getById(id: string): Promise<ServiceResult<BookingFull>> {
    const { data, error } = await supabase
      .from('v_bookings_full')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as BookingFull, error: null };
  },

  async updateStatus(
    id:        string,
    newStatus: BookingStatus,
    note:      string,
    adminEmail: string,
  ): Promise<ServiceResult<Booking>> {
    if (!note.trim()) {
      return { data: null, error: 'A note is required when changing status.' };
    }

    // Fetch current booking
    const { data: existing, error: fetchErr } = await supabase
      .from('bookings')
      .select('status, customer_name, tenant_id')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) return { data: null, error: 'Booking not found.' };

    // Validate transition
    if (!BOOKING_TRANSITIONS[existing.status as BookingStatus].includes(newStatus)) {
      return {
        data: null,
        error: `Cannot move from "${existing.status}" to "${newStatus}".`,
      };
    }

    // Build update payload
    const updates: Record<string, unknown> = {
      status:     newStatus,
      admin_note: note.trim(),
      updated_at: new Date().toISOString(),
    };

    if (newStatus === 'confirmed') {
      updates.confirmed_at = new Date().toISOString();
    }
    if (newStatus === 'active') {
      updates.pickup_confirmed_at = new Date().toISOString();
    }
    if (newStatus === 'completed') {
      updates.return_confirmed_at = new Date().toISOString();
    }
    if (newStatus === 'cancelled') {
      updates.cancelled_at        = new Date().toISOString();
      updates.cancelled_by        = 'admin';
      updates.cancellation_reason = note.trim();
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    // Write audit log
    await supabase.from('audit_logs').insert({
      tenant_id:     existing.tenant_id,
      admin_email:   adminEmail,
      booking_id:    id,
      customer_name: existing.customer_name,
      field_changed: 'status',
      old_value:     existing.status,
      new_value:     newStatus,
      note:          note.trim(),
    });

    return { data, error: null };
  },
};