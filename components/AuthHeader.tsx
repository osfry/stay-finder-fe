"use client";

import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import T from "./typography";

export default function AuthHeader() {
  const auth = useAuth();

  console.log("auth", auth);

  return (
    <div>
      {!auth.user && (
        <T.Header>
          <Link href="/auth/login" className="hover:underline">
            Not logged in
          </Link>
        </T.Header>
      )}
      {auth.user && <T.Header>Logged in {auth.user.email}</T.Header>}
    </div>
  );
}
