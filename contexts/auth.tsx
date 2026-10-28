"use client";

import { getMe, login, logout } from "@/utils/authService";
import { createContext, useState, useEffect, useContext } from "react";
import type { PropsWithChildren } from "react";

type AuthContextState = {
  user: AuthUser | null;
  isPending?: boolean;
  login: (email: string, password: string) => Promise<void | string>;
  logout: () => Promise<void>;
};

const defaultState: AuthContextState = {
  user: null,
  isPending: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext<AuthContextState>(defaultState);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<typeof defaultState.user>(null);
  const [isPending, setIsPending] = useState(defaultState.isPending);

  const _login: typeof defaultState.login = async (email, password) => {
    try {
      const authenticated = await login(email, password);
      if (!authenticated) {
        throw "Invalid credentials";
      }
      await _getMe();
      return;
    } catch (e) {
      console.warn("error in logging in", e);
      return "invalid Credentials";
    }
  };

  const _logout: typeof defaultState.logout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("error in logging out", e);
    }
    setUser(null);
  };

  const _getMe = async () => {
    setIsPending(true);
    try {
      const user = await getMe();
      if (!user) {
        throw "User not found";
      }
      console.log("user", user);
      setUser(user);
    } catch (e) {
      console.warn("error in getting me", e);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    _getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isPending,
        login: _login,
        logout: _logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
