/** Base daily rental rate in rupees */
const BASE_RATE_PER_DAY = 1500;

/** Minimum billable days for any booking */
const MINIMUM_DAYS = 3;

/** Fixed washing fee applied to every booking */
const WASHING_CHARGE = 300;

/** Refundable security deposit (shown separately, not in subtotal) */
const SECURITY_DEPOSIT = 3000;

/** Night surcharge per pickup or drop-off during night hours */
const NIGHT_SURCHARGE_PER_EVENT = 300;

/** Maximum total night surcharge (pickup + drop-off) */
const MAX_NIGHT_SURCHARGE = 600;

/** Minimum booking duration in hours */
const MINIMUM_DURATION_HOURS = 72;

/** Minimum advance notice before pickup in hours */
const MINIMUM_ADVANCE_HOURS = 24;

export const LOCATIONS: string[] = [
  "Dabolim Airport",
  "Manohar Airport",
  "Madgaon Railway Station",
  "Vasco Da Gama Railway Station",
  "Panjim",
  "Margao",
];

export const LOCATION_CHARGES: Record<string, number> = {
  "Dabolim Airport": 500,
  "Manohar Airport": 1300,
  "Madgaon Railway Station": 0,
  "Vasco Da Gama Railway Station": 500,
  Panjim: 500,
  Margao: 0,
};

export interface PriceBreakdown {
  baseDays: number;
  baseRate: number;
  pickupLocationCharge: number;
  dropoffLocationCharge: number;
  nightSurcharge: number;
  washingCharge: number;
  subtotal: number;
  securityDeposit: number;
  totalPayable: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isNightHour(datetime: Date): boolean {
  const hour = datetime.getHours();
  return hour >= 21 || hour < 7;
}

function getBaseDays(pickupDatetime: Date, returnDatetime: Date): number {
  const diffMs = returnDatetime.getTime() - pickupDatetime.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(MINIMUM_DAYS, diffDays);
}

function getLocationCharge(location: string): number {
  return LOCATION_CHARGES[location] ?? 0;
}

export function calculatePrice(
  pickupLocation: string,
  dropoffLocation: string,
  pickupDatetime: Date,
  returnDatetime: Date
): PriceBreakdown {
  const baseDays = getBaseDays(pickupDatetime, returnDatetime);
  const baseRate = BASE_RATE_PER_DAY * baseDays;

  const pickupLocationCharge = getLocationCharge(pickupLocation);
  const dropoffLocationCharge = getLocationCharge(dropoffLocation);

  let nightSurcharge = 0;
  if (isNightHour(pickupDatetime)) {
    nightSurcharge += NIGHT_SURCHARGE_PER_EVENT;
  }
  if (isNightHour(returnDatetime)) {
    nightSurcharge += NIGHT_SURCHARGE_PER_EVENT;
  }
  nightSurcharge = Math.min(nightSurcharge, MAX_NIGHT_SURCHARGE);

  const washingCharge = WASHING_CHARGE;
  const subtotal =
    baseRate +
    pickupLocationCharge +
    dropoffLocationCharge +
    nightSurcharge +
    washingCharge;
  const securityDeposit = SECURITY_DEPOSIT;
  const totalPayable = subtotal + securityDeposit;

  return {
    baseDays,
    baseRate,
    pickupLocationCharge,
    dropoffLocationCharge,
    nightSurcharge,
    washingCharge,
    subtotal,
    securityDeposit,
    totalPayable,
  };
}

export function validateBooking(
  pickupDatetime: Date,
  returnDatetime: Date
): ValidationResult {
  const errors: string[] = [];
  const now = new Date();

  const advanceHours =
    (pickupDatetime.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (advanceHours < MINIMUM_ADVANCE_HOURS) {
    errors.push(
      "Pickup must be scheduled at least 24 hours in advance."
    );
  }

  const durationHours =
    (returnDatetime.getTime() - pickupDatetime.getTime()) / (1000 * 60 * 60);
  if (durationHours < MINIMUM_DURATION_HOURS) {
    errors.push(
      "Minimum booking duration is 3 days (72 hours)."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
