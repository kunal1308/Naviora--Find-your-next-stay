"use client";

// The sign in / sign up form. Client Component (form state + async calls).
// Plain useState for now; we'll refactor to React Hook Form + Zod in Phase 4.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { signIn, signUp, signInWithGoogle } from "@/services/auth";
import { useAuth } from "@/features/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { ROUTES, isAdmin } from "@/constants";
import { trackEvent } from "@/lib/analytics";

type Mode = "signin" | "signup";

// Turn Firebase's error codes into human-friendly messages.
function messageForError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      case "auth/operation-not-allowed":
        return "This sign-in method isn't enabled in Firebase yet.";
      default:
        return err.message;
    }
  }
  return "Something went wrong. Please try again.";
}

export default function AuthForm() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Admins go to their dashboard; everyone else to hotels.
  const destFor = (mail: string | null) =>
    isAdmin(mail) ? ROUTES.admin : ROUTES.hotels;

  // Already signed in? Don't show the form — send them on.
  useEffect(() => {
    if (user) router.replace(destFor(user.email));
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const u = await signUp(name, email, password);
        void trackEvent("sign_up", { method: "password" });
        toast.success("Account created. Welcome to Naviora!");
        router.push(destFor(u.email));
      } else {
        const u = await signIn(email, password);
        void trackEvent("login", { method: "password" });
        toast.success("Signed in.");
        router.push(destFor(u.email));
      }
    } catch (err) {
      const message = messageForError(err);
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const u = await signInWithGoogle();
      void trackEvent("login", { method: "google" });
      toast.success("Signed in.");
      router.push(destFor(u.email));
    } catch (err) {
      const message = messageForError(err);
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Mode tabs */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 text-sm font-medium">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-md py-2 transition-colors ${
              mode === m
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {m === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none"
            />
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        OR
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
      >
        <GoogleIcon /> Continue with Google
      </button>
    </div>
  );
}
