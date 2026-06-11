"use client";

import { useState, useMemo } from "react";

const NAVY = "#1a1f5e";
const NAVY_LIGHT = "#2d3494";
const WHITE = "#ffffff";
const OFFWHITE = "#f4f6fb";

const ADMIN_EMAIL = "admin@smartwheels.in";
const ADMIN_PASSWORD = "admin123";

type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  duration: string;
  carName: string;
  totalPrice: number;
  status: BookingStatus;
};

type DateQuickFilter =
  | "all"
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "nextMonth"
  | "custom";

type StatusFilter =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Active"
  | "Completed"
  | "Cancelled";

type BookingRow = Booking & { notes: string };

type ChangeLogEntry = {
  timestamp: Date;
  admin_email: string;
  booking_id: string;
  customer_name: string;
  field_changed: "status";
  old_value: BookingStatus;
  new_value: BookingStatus;
  note: string;
};

type StatusModalState = {
  bookingId: string;
  customerName: string;
  oldStatus: BookingStatus;
  newStatus: BookingStatus;
  note: string;
};

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@gmail.com",
    pickupLocation: "Panaji",
    dropoffLocation: "Panaji",
    pickupDate: "12 Jun 2026, 10:00 AM",
    returnDate: "15 Jun 2026, 10:00 AM",
    duration: "3 days",
    carName: "Maruti Baleno",
    totalPrice: 4500,
    status: "Pending",
  },
  {
    id: "2",
    name: "Priya Fernandes",
    phone: "+91 91234 56789",
    email: "priya.f@outlook.com",
    pickupLocation: "Airport (Dabolim)",
    dropoffLocation: "Calangute",
    pickupDate: "18 Jun 2026, 2:00 PM",
    returnDate: "20 Jun 2026, 2:00 PM",
    duration: "2 days",
    carName: "Maruti Baleno",
    totalPrice: 3000,
    status: "Confirmed",
  },
];

const DATE_FILTER_OPTIONS: { key: DateQuickFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "thisWeek", label: "This Week" },
  { key: "thisMonth", label: "This Month" },
  { key: "nextMonth", label: "Next Month" },
  { key: "custom", label: "Custom" },
];

const STATUS_FILTER_OPTIONS: StatusFilter[] = [
  "All",
  "Pending",
  "Confirmed",
  "Active",
  "Completed",
  "Cancelled",
];

const STATUS_FILTER_ACTIVE_STYLES: Record<
  StatusFilter,
  React.CSSProperties
> = {
  All: { backgroundColor: NAVY, color: WHITE, border: `1px solid ${NAVY}` },
  Pending: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
    border: "1px solid #fde047",
  },
  Confirmed: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
  },
  Active: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    border: "1px solid #93c5fd",
  },
  Completed: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
  },
  Cancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  },
};

const tripLabelStyle: React.CSSProperties = {
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#9ca3af",
  marginBottom: "0.25rem",
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function parseBookingDate(dateStr: string): Date | null {
  const datePart = dateStr.split(",")[0]?.trim();
  if (!datePart) return null;
  const parsed = new Date(datePart);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDateRange(
  filter: DateQuickFilter,
  customFrom: string,
  customTo: string
): { start: Date | null; end: Date | null } {
  const now = new Date();
  const today = startOfDay(now);

  switch (filter) {
    case "all":
      return { start: null, end: null };
    case "today":
      return { start: today, end: endOfDay(now) };
    case "thisWeek": {
      const day = now.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const start = new Date(today);
      start.setDate(start.getDate() + mondayOffset);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { start, end: endOfDay(end) };
    }
    case "thisMonth": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start, end: endOfDay(end) };
    }
    case "nextMonth": {
      const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      return { start, end: endOfDay(end) };
    }
    case "custom": {
      const start = customFrom ? startOfDay(new Date(customFrom)) : null;
      const end = customTo ? endOfDay(new Date(customTo)) : null;
      return { start, end };
    }
  }
}

function isPickupInRange(
  pickupDateStr: string,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start && !end) return true;
  const pickup = parseBookingDate(pickupDateStr);
  if (!pickup) return false;
  if (start && pickup < start) return false;
  if (end && pickup > end) return false;
  return true;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: "0.5rem",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem",
  fontSize: "0.9375rem",
  fontFamily: "'DM Sans', sans-serif",
  color: NAVY,
  backgroundColor: OFFWHITE,
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  outline: "none",
};

const STATUS_STYLES: Record<BookingStatus, React.CSSProperties> = {
  Pending: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
    border: "1px solid #fcd34d",
  },
  Confirmed: {
    backgroundColor: "#d1fae5",
    color: "#047857",
    border: "1px solid #6ee7b7",
  },
  Cancelled: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fca5a5",
  },
};

function LoginForm({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitHover, setSubmitHover] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin();
      return;
    }

    setError("Invalid email or password. Please try again.");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: OFFWHITE,
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: WHITE,
          borderRadius: "16px",
          padding: "2rem 1.75rem",
          boxShadow: "0 8px 32px rgba(26, 31, 94, 0.1), 0 0 0 1px rgba(26, 31, 94, 0.04)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: NAVY,
            marginBottom: "0.35rem",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          SmartWheels Admin
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "1.75rem",
          }}
        >
          Sign in to manage bookings
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="admin-email" style={labelStyle}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={fieldStyle}
              placeholder="admin@smartwheels.in"
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="admin-password" style={labelStyle}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={fieldStyle}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: "0.8125rem",
                color: "#b91c1c",
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "8px",
                padding: "0.65rem 0.75rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              color: WHITE,
              backgroundColor: submitHover ? "#2d3494" : NAVY,
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              boxShadow: "0 4px 14px rgba(26, 31, 94, 0.25)",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function formatLogTime(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function StatusChangeModal({
  modal,
  onNoteChange,
  onConfirm,
  onCancel,
}: {
  modal: StatusModalState;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [confirmHover, setConfirmHover] = useState(false);
  const noteTrimmed = modal.note.trim();
  const canConfirm = noteTrimmed.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(26, 31, 94, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: WHITE,
          borderRadius: "14px",
          padding: "1.5rem",
          boxShadow: "0 16px 48px rgba(26, 31, 94, 0.2)",
        }}
      >
        <h3
          id="status-modal-title"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: NAVY,
            marginBottom: "0.5rem",
          }}
        >
          Confirm status change
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.25rem" }}>
          Changing status for <strong style={{ color: NAVY }}>{modal.customerName}</strong>{" "}
          from <strong>{modal.oldStatus}</strong> to <strong>{modal.newStatus}</strong>.
          A note is required before saving.
        </p>

        <label htmlFor="status-change-note" style={labelStyle}>
          Note (required)
        </label>
        <textarea
          id="status-change-note"
          value={modal.note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={4}
          placeholder="e.g. Customer confirmed via phone call"
          style={{
            ...fieldStyle,
            resize: "vertical",
            marginBottom: "1.25rem",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              color: NAVY,
              backgroundColor: WHITE,
              border: `1px solid ${NAVY}`,
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            onMouseEnter={() => setConfirmHover(true)}
            onMouseLeave={() => setConfirmHover(false)}
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              color: WHITE,
              backgroundColor: canConfirm
                ? confirmHover
                  ? "#2d3494"
                  : NAVY
                : "#9ca3af",
              border: "none",
              borderRadius: "8px",
              cursor: canConfirm ? "pointer" : "not-allowed",
              transition: "background-color 0.2s ease",
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [logoutHover, setLogoutHover] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>(() =>
    SAMPLE_BOOKINGS.map((b) => ({ ...b, notes: "" }))
  );
  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusModal, setStatusModal] = useState<StatusModalState | null>(null);
  const [dateFilter, setDateFilter] = useState<DateQuickFilter>("all");
  const [statusFilters, setStatusFilters] = useState<StatusFilter[]>(["All"]);
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const { start, end } = getDateRange(dateFilter, customDateFrom, customDateTo);
    const statusFilterActive =
      statusFilters.length > 0 && !statusFilters.includes("All");

    return bookings.filter((b) => {
      if (q) {
        const haystack = [
          b.name,
          b.phone,
          b.email,
          b.pickupLocation,
          b.dropoffLocation,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (dateFilter !== "all" && !isPickupInRange(b.pickupDate, start, end)) {
        return false;
      }

      if (
        statusFilterActive &&
        !statusFilters.includes(b.status as StatusFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [
    bookings,
    searchQuery,
    dateFilter,
    customDateFrom,
    customDateTo,
    statusFilters,
  ]);

  function handleStatusFilterClick(status: StatusFilter) {
    if (status === "All") {
      setStatusFilters(["All"]);
      return;
    }

    setStatusFilters((prev) => {
      const withoutAll = prev.filter((s) => s !== "All");
      const isSelected = withoutAll.includes(status);
      const next = isSelected
        ? withoutAll.filter((s) => s !== status)
        : [...withoutAll, status];
      return next.length === 0 ? ["All"] : next;
    });
  }

  function handleClearCustomDates() {
    setCustomDateFrom("");
    setCustomDateTo("");
    setDateFilter("all");
  }

  function handleStatusSelect(id: string, newStatus: BookingStatus) {
    const booking = bookings.find((b) => b.id === id);
    if (!booking || booking.status === newStatus) return;
    setStatusModal({
      bookingId: id,
      customerName: booking.name,
      oldStatus: booking.status,
      newStatus,
      note: "",
    });
  }

  function handleStatusConfirm() {
    if (!statusModal || !statusModal.note.trim()) return;

    const logEntry: ChangeLogEntry = {
      timestamp: new Date(),
      admin_email: ADMIN_EMAIL,
      booking_id: statusModal.bookingId,
      customer_name: statusModal.customerName,
      field_changed: "status",
      old_value: statusModal.oldStatus,
      new_value: statusModal.newStatus,
      note: statusModal.note.trim(),
    };

    setChangeLogs((prev) => [logEntry, ...prev]);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === statusModal.bookingId
          ? { ...b, status: statusModal.newStatus }
          : b
      )
    );
    setStatusModal(null);
  }

  function handleNoteChange(id: string, value: string) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, notes: value } : b))
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: OFFWHITE }}>
      {statusModal && (
        <StatusChangeModal
          modal={statusModal}
          onNoteChange={(note) =>
            setStatusModal((prev) => (prev ? { ...prev, note } : null))
          }
          onConfirm={handleStatusConfirm}
          onCancel={() => setStatusModal(null)}
        />
      )}

      <header
        style={{
          backgroundColor: WHITE,
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(26, 31, 94, 0.06)",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: NAVY,
              letterSpacing: "-0.02em",
            }}
          >
            SmartWheels Admin
          </h1>

          <button
            type="button"
            onClick={onLogout}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            style={{
              padding: "0.55rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              color: logoutHover ? WHITE : NAVY,
              backgroundColor: logoutHover ? NAVY : WHITE,
              border: `1px solid ${NAVY}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s ease, color 0.2s ease",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main
        style={{
          width: "100%",
          padding: "2rem 1.5rem 3rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.125rem",
                fontWeight: 700,
                color: NAVY,
                marginBottom: "0.25rem",
              }}
            >
              Bookings
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {filteredBookings.length} of {bookings.length} booking
              {bookings.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="booking-search" style={labelStyle}>
            Search bookings
          </label>
          <input
            id="booking-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, or location…"
            style={fieldStyle}
          />
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "860px",
            margin: "0 auto 1rem",
            backgroundColor: WHITE,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 16px rgba(26, 31, 94, 0.06)",
            padding: "1.25rem 1.5rem",
            boxSizing: "border-box",
          }}
        >
          {/* Row 1 — Date quick filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {DATE_FILTER_OPTIONS.map((option) => {
              const isActive = dateFilter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setDateFilter(option.key)}
                  style={{
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    borderRadius: "999px",
                    cursor: "pointer",
                    backgroundColor: isActive ? NAVY : WHITE,
                    color: isActive ? WHITE : NAVY,
                    border: `1px solid ${NAVY}`,
                    transition: "background-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Row 2 — Status filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: dateFilter === "custom" ? "1rem" : 0,
            }}
          >
            {STATUS_FILTER_OPTIONS.map((status) => {
              const isActive = statusFilters.includes(status);
              const activeStyle = isActive
                ? STATUS_FILTER_ACTIVE_STYLES[status]
                : {
                    backgroundColor: WHITE,
                    color: NAVY,
                    border: `1px solid ${NAVY}`,
                  };
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusFilterClick(status)}
                  style={{
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    borderRadius: "999px",
                    cursor: "pointer",
                    ...activeStyle,
                    transition: "background-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Row 3 — Custom date range */}
          {dateFilter === "custom" && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                gap: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <div style={{ flex: "1 1 140px", minWidth: "140px" }}>
                <label htmlFor="custom-date-from" style={labelStyle}>
                  From
                </label>
                <input
                  id="custom-date-from"
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  style={{
                    ...fieldStyle,
                    boxSizing: "border-box",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <div style={{ flex: "1 1 140px", minWidth: "140px" }}>
                <label htmlFor="custom-date-to" style={labelStyle}>
                  To
                </label>
                <input
                  id="custom-date-to"
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  style={{
                    ...fieldStyle,
                    boxSizing: "border-box",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleClearCustomDates}
                style={{
                  flex: "0 0 auto",
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  color: NAVY,
                  backgroundColor: WHITE,
                  border: `1px solid ${NAVY}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {filteredBookings.length === 0 ? (
          <div
            style={{
              width: "100%",
              maxWidth: "860px",
              margin: "0 auto",
              backgroundColor: WHITE,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(26, 31, 94, 0.06)",
              padding: "2rem 1.25rem",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "0.875rem",
              boxSizing: "border-box",
            }}
          >
            No bookings match your filters.
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "860px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxSizing: "border-box",
            }}
          >
            {filteredBookings.map((booking) => (
              <article
                key={booking.id}
                style={{
                  backgroundColor: WHITE,
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(26, 31, 94, 0.06)",
                  padding: "1.25rem 1.5rem",
                  boxSizing: "border-box",
                }}
              >
                {/* Top row: name + status badge + WhatsApp */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                      flex: "1 1 auto",
                      minWidth: 0,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: NAVY,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {booking.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.3rem 0.65rem",
                        borderRadius: "999px",
                        whiteSpace: "nowrap",
                        ...STATUS_STYLES[booking.status],
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    title="Send WhatsApp message"
                    onClick={() => alert("WhatsApp integration coming soon")}
                    style={{
                      flexShrink: 0,
                      padding: "0.4rem 0.6rem",
                      fontSize: "1.125rem",
                      lineHeight: 1,
                      backgroundColor: OFFWHITE,
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    💬
                  </button>
                </div>

                {/* Second row: phone + email */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1.25rem",
                    marginBottom: "0.65rem",
                    fontSize: "0.875rem",
                    color: "#374151",
                  }}
                >
                  <span>{booking.phone}</span>
                  <span>{booking.email}</span>
                </div>

                {/* Third row: structured trip details */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div style={{ flex: "1 1 140px", minWidth: "140px" }}>
                    <div style={tripLabelStyle}>Pickup</div>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.4 }}>
                      <span style={{ color: NAVY, fontWeight: 700 }}>
                        {booking.pickupLocation}
                      </span>
                      <span style={{ color: "#6b7280" }}>
                        {" "}
                        · {booking.pickupDate}
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: "1 1 140px", minWidth: "140px" }}>
                    <div style={tripLabelStyle}>Drop-off</div>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.4 }}>
                      <span style={{ color: NAVY, fontWeight: 700 }}>
                        {booking.dropoffLocation}
                      </span>
                      <span style={{ color: "#6b7280" }}>
                        {" "}
                        · {booking.returnDate}
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: "1 1 140px", minWidth: "140px" }}>
                    <div style={tripLabelStyle}>Duration</div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: NAVY,
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      {booking.duration}
                    </div>
                  </div>
                </div>

                {/* Fourth row: car name + price */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    {booking.carName}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: NAVY,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ₹{booking.totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Bottom row: status dropdown + admin note */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusSelect(
                        booking.id,
                        e.target.value as BookingStatus
                      )
                    }
                    style={{
                      flex: "0 0 auto",
                      minWidth: "130px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      padding: "0.35rem 0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      outline: "none",
                      ...STATUS_STYLES[booking.status],
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <input
                    type="text"
                    value={booking.notes}
                    onChange={(e) => handleNoteChange(booking.id, e.target.value)}
                    placeholder="e.g. Called customer"
                    style={{
                      flex: "1 1 200px",
                      minWidth: "160px",
                      padding: "0.4rem 0.5rem",
                      fontSize: "0.8125rem",
                      fontFamily: "'DM Sans', sans-serif",
                      color: NAVY,
                      backgroundColor: OFFWHITE,
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        <div style={{ marginTop: "1.5rem" }}>
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              color: NAVY,
              marginBottom: "0.75rem",
            }}
          >
            Change Log
          </h3>
          <div
            style={{
              backgroundColor: WHITE,
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            {changeLogs.length === 0 ? (
              <p
                style={{
                  padding: "1rem 1.25rem",
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "#9ca3af",
                }}
              >
                No changes yet. Status updates will appear here.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                {changeLogs.map((entry, index) => (
                  <li
                    key={`${entry.booking_id}-${entry.timestamp.getTime()}-${index}`}
                    style={{
                      padding: "0.75rem 1.25rem",
                      borderBottom:
                        index < changeLogs.length - 1
                          ? "1px solid #f1f5f9"
                          : "none",
                      fontSize: "0.8125rem",
                      color: "#374151",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatLogTime(entry.timestamp)}
                    </span>
                    <span style={{ fontWeight: 600, color: NAVY }}>
                      {entry.customer_name}
                    </span>
                    <span>
                      Status: {entry.old_value} → {entry.new_value}
                    </span>
                    <span style={{ color: "#6b7280" }}>
                      — &ldquo;{entry.note}&rdquo;
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
}
