"use client";

import { useCallback, useEffect, useState } from "react";

export type SessionUser = {
  name: string;
  email: string;
  provider: "google";
};

const STORAGE_KEY = "emotia_session";
const SESSION_EVENT = "emotia-session-updated";

function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function writeSession(user: SessionUser | null) {
  if (typeof window === "undefined") return;

  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  window.dispatchEvent(new CustomEvent(SESSION_EVENT));
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);

  const syncSession = useCallback(() => {
    setUser(readSession());
  }, []);

  useEffect(() => {
    syncSession();

    const handleChange = () => syncSession();
    window.addEventListener("storage", handleChange);
    window.addEventListener(SESSION_EVENT, handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener(SESSION_EVENT, handleChange);
    };
  }, [syncSession]);

  const loginWithGoogle = useCallback(() => {
    const demoUser: SessionUser = {
      name: "Evelyn Burgoa",
      email: "evelynburgoa@gmail.com",
      provider: "google",
    };

    writeSession(demoUser);
    setUser(demoUser);
    return demoUser;
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  return {
    user,
    isLoggedIn: Boolean(user),
    loginWithGoogle,
    logout,
  };
}
