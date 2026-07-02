"use client";

// Holds the current auth state for the whole app via React Context.
// React context can't live in Server Components, so this is a Client Component
// that wraps the app in layout.tsx. Any component can read the user with
// the useAuth() hook.
//
// (Later we may move global state to Redux, but auth via context is clean and
// enough for now — server data still goes through services/TanStack Query.)

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { subscribeToAuth } from "@/services/auth";
import { ensureUserProfile } from "@/services/users";

interface AuthContextValue {
  user: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fires once with the initial state, then on every sign-in/out.
    const unsubscribe = subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);
      // Keep a profile doc for every user so the admin can list them.
      if (nextUser) {
        void ensureUserProfile(
          nextUser.uid,
          nextUser.displayName,
          nextUser.email,
        );
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
