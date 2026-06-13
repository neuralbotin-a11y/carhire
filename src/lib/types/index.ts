import type { PriceMetadata } from '@/lib/pricing';

// ── Enums ────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';

export type CarCategory    = 'hatchback' | 'sedan' | 'suv' | 'muv' | 'luxury';
export type FuelType       = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type TransmissionType = 'manual' | 'automatic';
export type CustomerStatus = 'active' | 'deactivated' | 'unverified';
export type TenantStatus   = 'active' | 'suspended' | 'pending' | 'offboarded';

// ── Status display helpers ────────────────────────────────────

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  active:    'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, { bg: string; text: string; border: string }> = {
  pending:   { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  confirmed: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  active:    { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  completed: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
  cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

// Allowed admin status transitions
export const BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active:    ['completed'],
  completed: [],
  cancelled: [],
};

export const PICKUP_LOCATIONS = [
  'Panaji',
  'Calangute',
  'Margao',
  'Vasco',
  'Airport (Dabolim)',
] as const;

export type PickupLocation = typeof PICKUP_LOCATIONS[number];

// ── Tenant ───────────────────────────────────────────────────

export interface Tenant {
  id:                   string;
  created_at:           string;
  name:                 string;
  slug:                 string;
  status:               TenantStatus;
  contact_name:         string;
  contact_email:        string;
  contact_phone:        string;
  commission_pct:       number;
  security_deposit_amt: number;
  requires_docs:        boolean;
  service_locations:    string[];
  logo_url:             string | null;
  brand_color:          string | null;
}

// ── Car ──────────────────────────────────────────────────────

export interface CarModel {
  id:               string;
  tenant_id:        string;
  name:             string;
  category:         CarCategory;
  fuel:             FuelType;
  transmission:     TransmissionType;
  seats:            number;
  year:             number | null;
  total_units:      number;
  price_per_day:    number;
  security_deposit: number;
  location_prices:  Record<string, number>;
  specs:            Record<string, unknown>;
  image_urls:       string[];
  is_active:        boolean;
}

// ── Customer ─────────────────────────────────────────────────

export interface Customer {
  id:                 string;
  created_at:         string;
  auth_user_id:       string | null;
  name:               string;
  phone:              string;
  email:              string;
  date_of_birth:      string | null;
  address_line1:      string | null;
  city:               string | null;
  state:              string | null;
  pincode:            string | null;
  status:             CustomerStatus;
  kyc_verified:       boolean;
  deactivated_at:     string | null;
  deactivation_reason: string | null;
}

// ── Booking ──────────────────────────────────────────────────

export interface Booking {
  id:                   string;
  created_at:           string;
  updated_at:           string;
  tenant_id:            string;
  customer_id:          string | null;
  model_id:             string | null;
  unit_id:              string | null;
  // Customer snapshot
  customer_name:        string;
  customer_phone:       string;
  customer_email:       string;
  customer_address:     string | null;
  // Car snapshot
  car_name:             string;
  car_category:         CarCategory;
  transmission:         TransmissionType;
  fuel:                 FuelType;
  seats:                number;
  // Trip
  pickup_location:      string;
  dropoff_location:     string | null;
  pickup_datetime:      string;
  return_datetime:      string;
  assigned_registration: string | null;
  // Pricing
  price_per_day:        number;
  total_price:          number;
  security_deposit:     number;
  promo_code:           string | null;
  discount_amount:      number;
  // Status
  status:               BookingStatus;
  admin_note:           string | null;
  // Timestamps
  confirmed_at:         string | null;
  pickup_confirmed_at:  string | null;
  return_confirmed_at:  string | null;
  cancelled_at:         string | null;
  cancelled_by:         string | null;
  cancellation_reason:  string | null;
  // Extra
  special_requests:     string | null;
  payment_id:           string | null;
  invoice_url:          string | null;
  metadata:             Record<string, unknown>;
}

// Booking with computed duration from v_bookings_full view
export interface BookingFull extends Booking {
  duration_days: number;
  tenant_name:   string;
  tenant_slug:   string;
}

// ── Audit Log ────────────────────────────────────────────────

export interface AuditLog {
  id:            string;
  created_at:    string;
  tenant_id:     string;
  admin_email:   string;
  booking_id:    string;
  customer_name: string;
  field_changed: string;
  old_value:     string | null;
  new_value:     string;
  note:          string;
}

// ── Booking form input ────────────────────────────────────────

export interface BookingFormInput {
  customer_name:     string;
  customer_phone:    string;
  customer_email:    string;
  customer_address:  string;
  pickup_location:   string;
  dropoff_location:  string;
  different_dropoff: boolean;
  pickup_datetime:   string;
  return_datetime:   string;
  special_requests:  string;
  total_price:       number;
  metadata:          PriceMetadata;
}

// ── Service result wrapper ────────────────────────────────────

export type ServiceResult<T> =
  | { data: T;    error: null }
  | { data: null; error: string };