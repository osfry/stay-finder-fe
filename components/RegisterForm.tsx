"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import T from "./typography";
import { register } from "@/utils/authService";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    setError(undefined);
    setPending(true);
    try {
      const result = await register(email, password);
      if (typeof result === "string") {
        setError(result);
        return;
      }
      router.push("/auth/login");
    } catch {
      setError("Could not reach the server");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-300 bg-white p-6 text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <T.Header>Register</T.Header>
      <input name="email" type="email" placeholder="Enter email" required className="w-full" />
      <input
        name="password"
        type="password"
        placeholder="Enter Password (min 6 characters)"
        minLength={6}
        required
        className="w-full"
      />
      <button type="submit" disabled={pending}>
        Register
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?
      </p>
      <Link
        href="/auth/login"
        className="block w-full rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Log in
      </Link>
    </form>
  );
}
