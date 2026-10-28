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
      {auth.user && (
          <div className="flex items-center gap-3">
              <T.Header>Logged in {auth.user.email}</T.Header>
              <button
                  type="button"
                  onClick={auth.logout}
                  className="text-sm font-medium hover:underline"
              >
                  Log out
              </button>
          </div>
      )}
    </div>
  );
}
