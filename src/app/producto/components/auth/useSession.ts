"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useStackApp, useUser } from "@stackframe/stack";

export type SessionUser = {
  name: string;
  email: string;
  provider: "google" | "credential";
};

const STORAGE_KEY = "emotia_catalog_session";
const SESSION_EVENT = "emotia-catalog-session";
const LOGOUT_PENDING_KEY = "emotia-logout-pending";

function resolveReturnTo(override?: string) {
  if (override) return override;
  if (typeof window === "undefined") return "/producto";

  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return path || "/producto";
}

function readStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function writeStoredUser(user: SessionUser | null) {
  if (typeof window === "undefined") return;

  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  window.dispatchEvent(new CustomEvent(SESSION_EVENT));
}

function readLogoutPending() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(LOGOUT_PENDING_KEY) === "true";
}

function writeLogoutPending(value: boolean) {
  if (typeof window === "undefined") return;

  if (value) {
    window.sessionStorage.setItem(LOGOUT_PENDING_KEY, "true");
  } else {
    window.sessionStorage.removeItem(LOGOUT_PENDING_KEY);
  }
}

function mapStackUserToSessionUser(
  stackUser: {
    displayName?: string | null;
    primaryEmail?: string | null;
  } | null,
  fallbackProvider: SessionUser["provider"] = "google"
): SessionUser | null {
  if (!stackUser) return null;

  const email = stackUser.primaryEmail || "";
  const name = stackUser.displayName?.trim() || email.split("@")[0] || "Usuario";

  return {
    name,
    email,
    provider: fallbackProvider,
  };
}

function isSameSessionUser(a: SessionUser | null, b: SessionUser | null) {
  if (!a && !b) return true;
  if (!a || !b) return false;

  return a.name === b.name && a.email === b.email && a.provider === b.provider;
}

export function useSession() {
  const stackApp = useStackApp();
  const stackHookUser = useUser();
  const partialUser = stackApp.usePartialUser({ from: "token" });
  const [user, setUser] = useState<SessionUser | null>(() => readStoredUser());
  const [isLoggingOut, setIsLoggingOut] = useState(() => readLogoutPending());

  const stackSessionUser = useMemo(
    () => mapStackUserToSessionUser(stackHookUser, user?.provider || "google"),
    [stackHookUser, user?.provider]
  );

  const partialSessionUser = useMemo(
    () => mapStackUserToSessionUser(partialUser, user?.provider || "google"),
    [partialUser, user?.provider]
  );

  const syncSession = useCallback(
    async () => {
      const runSync = async (attempt: number): Promise<void> => {
        const partialCurrentUser = await stackApp.getPartialUser({ from: "token" });
        const currentUser = await stackApp.getUser();
        const mappedUser =
          mapStackUserToSessionUser(partialCurrentUser, user?.provider || "google") ||
          mapStackUserToSessionUser(currentUser, user?.provider || "google");
        const logoutPending = readLogoutPending();

        if (mappedUser) {
          setUser((prev) => (isSameSessionUser(prev, mappedUser) ? prev : mappedUser));
          setIsLoggingOut(false);
          writeStoredUser(mappedUser);
          writeLogoutPending(false);

          return;
        }

        if (logoutPending && attempt < 8) {
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          await runSync(attempt + 1);
          return;
        }

        setUser((prev) => (prev === null ? prev : null));
        writeStoredUser(null);

        if (logoutPending) {
          setIsLoggingOut(false);
          writeLogoutPending(false);
        }
      };

      await runSync(0);
    },
    [stackApp, user?.provider]
  );

  useEffect(() => {
    if (!partialSessionUser || isLoggingOut) return;

    const storedUser = readStoredUser();
    if (isSameSessionUser(storedUser, partialSessionUser)) return;

    writeStoredUser(partialSessionUser);
  }, [isLoggingOut, partialSessionUser]);

  useEffect(() => {
    void syncSession();

    const syncStoredUser = () => {
      const nextUser = readStoredUser();
      setUser((prev) => (isSameSessionUser(prev, nextUser) ? prev : nextUser));
    };
    const syncOnFocus = () => {
      void syncSession();
    };

    window.addEventListener(SESSION_EVENT, syncStoredUser);
    window.addEventListener("storage", syncStoredUser);
    window.addEventListener("focus", syncOnFocus);
    window.addEventListener("pageshow", syncOnFocus);

    return () => {
      window.removeEventListener(SESSION_EVENT, syncStoredUser);
      window.removeEventListener("storage", syncStoredUser);
      window.removeEventListener("focus", syncOnFocus);
      window.removeEventListener("pageshow", syncOnFocus);
    };
  }, [syncSession]);

  const loginWithGoogle = useCallback(
    async (returnTo?: string) => {
      const targetPath = resolveReturnTo(returnTo);
      const oauthCallbackUrl = new URL(stackApp.urls.oauthCallback, window.location.origin);
      oauthCallbackUrl.searchParams.set("after_auth_return_to", targetPath);

      setIsLoggingOut(false);
      writeLogoutPending(false);
      await stackApp.signInWithOAuth("google", { returnTo: oauthCallbackUrl.toString() });
    },
    [stackApp]
  );

  const loginWithCredential = useCallback(
    async (email: string, password: string) => {
      const result = await stackApp.signInWithCredential({ email, password });

      if (result.status === "ok") {
        const nextUser: SessionUser = {
          name: email.split("@")[0] || "Usuario",
          email,
          provider: "credential",
        };

        setUser(nextUser);
        setIsLoggingOut(false);
        writeLogoutPending(false);
        writeStoredUser(nextUser);
      }

      return result;
    },
    [stackApp]
  );

  const registerWithCredential = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await stackApp.signUpWithCredential({ email, password });

      if (result.status === "ok") {
        const nextUser: SessionUser = {
          name: name.trim() || email.split("@")[0] || "Usuario",
          email,
          provider: "credential",
        };

        setUser(nextUser);
        setIsLoggingOut(false);
        writeLogoutPending(false);
        writeStoredUser(nextUser);
      }

      return result;
    },
    [stackApp]
  );

  const logout = useCallback(
    async (redirectTo?: string) => {
      const targetPath = resolveReturnTo(redirectTo);
      setUser(null);
      setIsLoggingOut(true);
      writeLogoutPending(true);
      writeStoredUser(null);

      try {
        await stackApp.signOut({ redirectUrl: targetPath });
      } catch (error) {
        setIsLoggingOut(false);
        writeLogoutPending(false);
        throw error;
      }
    },
    [stackApp]
  );

  return {
    user: isLoggingOut ? null : stackSessionUser || partialSessionUser || user,
    isLoggedIn: Boolean(isLoggingOut ? null : stackSessionUser || partialSessionUser || user),
    isLoggingOut,
    loginWithGoogle,
    loginWithCredential,
    registerWithCredential,
    logout,
  };
}
