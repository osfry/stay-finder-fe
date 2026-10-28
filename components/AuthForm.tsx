"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import T from "./typography";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm() {
  const auth = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const login = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    setError(undefined);
    setPending(true);
    const response = await auth.login(email, password);
    setPending(false);
    if (typeof response === "string") {
      setError(response);
      return;
    }
    router.push("/");
  };

  return (
    <form
      onSubmit={login}
      className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-300 bg-white p-6 text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <T.Header>Log in</T.Header>
      <input name="email" type="email" placeholder="Enter email" required className="w-full" />
      <input name="password" type="password" placeholder="Enter Password" required className="w-full" />
      <button type="submit" disabled={pending}>
        Log in
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <p className="text-sm text-zinc-600 dark:text-zinc-400">Don't have an account?</p>
      <Link
        href="/auth/register"
        className="block w-full rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Register
      </Link>
    </form>
  );
}
