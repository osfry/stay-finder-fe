"use client";

import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import type { PropsWithChildren } from "react";

type AuthGateProps = PropsWithChildren<{
  action?: string;
}>;

export default function AuthGate({
  children,
  action = "continue",
}: AuthGateProps) {
  const auth = useAuth();

  if (auth.isPending) {
    return <p>Loading...</p>;
  }
  if (!auth.user) {
    return (
      <p>
        <Link href="/auth/login" className="underline">
          Log in
        </Link>{" "}
        to {action}.
      </p>
    );
  }
  return children;
}
