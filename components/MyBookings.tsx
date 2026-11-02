"use client";

import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useAuth } from "@/contexts/auth";
import {
  deleteBooking,
  getMyBookings,
  updateBooking,
} from "@/utils/bookingService";
import { getPropertyById } from "@/utils/propertyService";
import type { Booking, BookingDates } from "@/types/booking";
import type { Property } from "@/types/property";
import BookingPicker from "./BookingPicker";
import T from "./typography";

const cardClass =
  "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950";
const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300";

function getNights(dates: BookingDates) {
  return differenceInCalendarDays(
    parseISO(dates.check_out),
    parseISO(dates.check_in),
  );
}

type BookingItemProps = {
  booking: Booking;
  property?: Property | null;
  onChanged: (booking: Booking) => void;
  onDeleted: (id: string) => void;
};

function BookingItem({
  booking,
  property,
  onChanged,
  onDeleted,
}: BookingItemProps) {
  const [editing, setEditing] = useState(false);
  const [dates, setDates] = useState<BookingDates | undefined>({
    check_in: booking.check_in,
    check_out: booking.check_out,
  });
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const shown = editing && dates ? dates : booking;
  const nights = getNights(shown);

  const onSave = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dates) {
      setError("Select check-in and check-out dates.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const changes = {
      ...dates,
      guest_name: String(formData.get("guest_name")).trim(),
      guests: Number(formData.get("guests")),
    };
    setError(undefined);
    setPending(true);
    const result = await updateBooking(booking.booking_id, changes);
    setPending(false);
    if (typeof result === "string") {
      setError(result);
      return;
    }
    onChanged({ ...booking, ...changes });
    setEditing(false);
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this booking?")) {
      return;
    }
    if (await deleteBooking(booking.booking_id)) {
      onDeleted(booking.booking_id);
    } else {
      window.alert("Could not delete the booking.");
    }
  };

  return (
    <div className={`${cardClass} flex flex-col gap-3`}>
      <div>
        <Link
          href={`/properties/${booking.property_id}`}
          className="font-semibold hover:underline"
        >
          {property?.title ?? "Property"}
        </Link>
        {property && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {property.location}
          </p>
        )}
      </div>

      {editing ? (
        <form onSubmit={onSave} className="flex flex-col gap-4">
          <BookingPicker initialDates={dates} selectDates={setDates} />
          <label className="flex flex-col gap-1 text-sm">
            Your name
            <input
              name="guest_name"
              required
              minLength={2}
              defaultValue={booking.guest_name}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Guests
            <input
              name="guests"
              type="number"
              min={1}
              max={property?.max_guests}
              defaultValue={booking.guests}
              required
              className={fieldClass}
            />
          </label>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-3 text-sm font-medium">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(undefined);
                setDates({
                  check_in: booking.check_in,
                  check_out: booking.check_out,
                });
              }}
              className="hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="text-sm">
            <p>
              {booking.check_in} → {booking.check_out} ({nights}{" "}
              {nights === 1 ? "night" : "nights"})
            </p>
            <p>
              {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
              {property && nights > 0 && (
                <> · Total {nights * property.price_per_night} kr</>
              )}
            </p>
            <p className="capitalize text-zinc-500">{booking.status}</p>
          </div>
          <div className="flex gap-3 text-sm font-medium">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="text-red-600 hover:underline dark:text-red-400"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function MyBookings() {
  const { user, isPending } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>();
  const [properties, setProperties] = useState<
    Record<string, Property | null>
  >({});

  useEffect(() => {
    if (!user) {
      return;
    }
    getMyBookings().then(async (list) => {
      setBookings(list);
      const ids = [...new Set(list.map((b) => b.property_id))];
      const entries = await Promise.all(
        ids.map(async (id) => [id, await getPropertyById(id)] as const),
      );
      setProperties(Object.fromEntries(entries));
    });
  }, [user]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <p>
        <Link href="/auth/login" className="underline">
          Log in
        </Link>{" "}
        to see your bookings.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <T.Header size="lg">My bookings</T.Header>
      {!bookings && <p>Loading...</p>}
      {bookings?.length === 0 && <p>You don&apos;t have any bookings yet.</p>}
      <div className="flex flex-col gap-3">
        {bookings?.map((booking) => (
          <BookingItem
            key={booking.booking_id}
            booking={booking}
            property={properties[booking.property_id]}
            onChanged={(next) =>
              setBookings((prev) =>
                prev?.map((b) => (b.booking_id === next.booking_id ? next : b)),
              )
            }
            onDeleted={(id) =>
              setBookings((prev) => prev?.filter((b) => b.booking_id !== id))
            }
          />
        ))}
      </div>
    </div>
  );
}
