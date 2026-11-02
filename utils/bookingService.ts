import type { Booking, BookingDates } from "@/types/booking";

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`;

export async function getMyBookings(): Promise<Booking[]> {
  try {
    const response = await fetch(`${BASE}/mine`, { credentials: "include" });
    return response.ok ? await response.json() : [];
  } catch {
    return [];
  }
}

export async function updateBooking(
  id: string,
  changes: Partial<BookingDates> & { guests?: number; guest_name?: string },
): Promise<true | string> {
  try {
    const response = await fetch(`${BASE}/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    return response.ok ? true : "Could not update the booking.";
  } catch {
    return "Could not reach the server.";
  }
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function createBooking(booking: {
  property_id: string;
  guest_name: string;
  guest_email: string;
  guests: number;
} & BookingDates): Promise<true | string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...booking, status: "pending" }),
      },
    );
    if (response.status === 401) {
      return "You need to be logged in to book.";
    }
    if (!response.ok) {
      return "Could not create the booking. Check the fields and try again.";
    }
    return true;
  } catch {
    return "Could not reach the server.";
  }
}
