"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth";

const linkClass =
  "text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white";

export default function UserNavLinks() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
      <Link href="/host/properties" className={linkClass}>
        My properties
      </Link>
      <Link href="/bookings" className={linkClass}>
        My bookings
      </Link>
    </>
  );
}
