export async function login(email: string, password: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    return true;
  }
  return false;
}

export async function register(
  email: string,
  password: string,
): Promise<true | string> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    return true;
  }
  const data = await response.json().catch(() => null);
  return typeof data?.message === "string" ? data.message : "Registration failed";
}

export async function logout() {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout/`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
}

export async function getMe(): Promise<AuthUser | null> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me/`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data?.user as AuthUser | null;
  }
  return null;
}
