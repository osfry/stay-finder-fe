"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";
import type { BookingDates } from "@/types/booking";
import type { Property } from "@/types/property";
import { useAuth } from "@/contexts/auth";
import { createBooking } from "@/utils/bookingService";
import BookingPicker from "./BookingPicker";

type PropertyBookerCardProps = {
  property: Property;
};

const cardClass =
  "block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950";
const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300";

export default function PropertyBookerCard({
  property,
}: PropertyBookerCardProps) {
  const { user, isPending } = useAuth();
  const [bookingDates, setBookingDates] = useState<BookingDates>();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  const nights = bookingDates
    ? differenceInCalendarDays(
        parseISO(bookingDates.check_out),
        parseISO(bookingDates.check_in),
      )
    : 0;
  const totalPrice = nights * property.price_per_night;

  if (isPending) {
    return <div className={cardClass}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className={cardClass}>
        <Link href="/auth/login" className="underline">
          Log in
        </Link>{" "}
        to book this stay.
      </div>
    );
  }

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bookingDates) {
      setError("Select check-in and check-out dates.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    setError(undefined);
    setSuccess(false);
    setPending(true);
    const result = await createBooking({
      property_id: property.property_id,
      guest_name: String(formData.get("guest_name")).trim(),
      guest_email: user.email,
      guests: Number(formData.get("guests")),
      ...bookingDates,
    });
    setPending(false);
    if (typeof result === "string") {
      setError(result);
      return;
    }
    setSuccess(true);
  };

  return (
    <form onSubmit={onSubmit} className={`${cardClass} flex flex-col gap-4`}>
      <BookingPicker initialDates={bookingDates} selectDates={setBookingDates} />
      <label className="flex flex-col gap-1 text-sm">
        Your name
        <input name="guest_name" required minLength={2} className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Guests
        <input
          name="guests"
          type="number"
          min={1}
          max={property.max_guests}
          defaultValue={1}
          required
          className={fieldClass}
        />
      </label>
      {nights > 0 && (
        <div className="rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-900">
          <p>
            {nights} {nights === 1 ? "night" : "nights"} × {property.price_per_night} kr
          </p>
          <p className="mt-1 font-semibold">Total: {totalPrice} kr</p>
        </div>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Booking created!
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Booking…" : "Book"}
      </button>
    </form>
  );
}
