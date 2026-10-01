"use client";

// The sign in / sign up form. Client Component (form state + async calls).
// Plain useState for now; we'll refactor to React Hook Form + Zod in Phase 4.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FirebaseError } from "firebase/app";
import {
  signIn,
  signUp,
  signInWithGoogle,
  resetPassword,
  resendVerificationEmail,
  EMAIL_NOT_VERIFIED,
} from "@/services/auth";
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
      case EMAIL_NOT_VERIFIED:
        return "Please verify your email first. Check your inbox (and spam folder) for the link.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
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
    setNotice(null);
    setUnverified(false);
    setBusy(true);
    try {
      if (mode === "signup") {
        const sent = await signUp(name, email, password);
        void trackEvent("sign_up", { method: "password" });
        // Not signed in yet: they verify first, then sign in
        if (sent) {
          setNotice(
            `We sent a verification link to ${email}. Verify your email, then sign in.`,
          );
          toast.success("Account created. Check your email.");
        } else {
          setNotice(
            "Account created, but we couldn't send the verification email. Sign in to resend it.",
          );
          toast.error("Couldn't send the verification email.");
        }
        setMode("signin");
        setName("");
        setPassword("");
        setShowPassword(false);
      } else {
        const u = await signIn(email, password);
        void trackEvent("login", { method: "password" });
        toast.success("Signed in.");
        router.push(destFor(u.email));
      }
    } catch (err) {
      if (err instanceof FirebaseError && err.code === EMAIL_NOT_VERIFIED) {
        setUnverified(true);
      }
      const message = messageForError(err);
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  // Send a fresh verification link using the entered email + password.
  async function handleResend() {
    setError(null);
    setBusy(true);
    try {
      const alreadyVerified = await resendVerificationEmail(email, password);
      setUnverified(false);
      if (alreadyVerified) {
        setNotice("Your email is already verified. Please sign in.");
      } else {
        setNotice(`Verification link sent to ${email}.`);
        toast.success("Verification link sent.");
      }
    } catch (err) {
      const message = messageForError(err);
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  // Email the user a reset link (email/password accounts only).
  async function handleForgot() {
    if (!email) {
      const m = "Enter your email above, then tap “Forgot password?”.";
      setError(m);
      toast.error(m);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await resetPassword(email);
      toast.success(`Password reset link sent to ${email}.`);
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
              setNotice(null);
              setUnverified(false);
              setShowPassword(false);
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
            onChange={(e) => {
              setEmail(e.target.value);
              setUnverified(false);
            }}
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-slate-900 focus:border-brand-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {mode === "signin" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgot}
              disabled={busy}
              className="text-sm font-medium text-brand-700 hover:underline disabled:opacity-60"
            >
              Forgot password?
            </button>
          </div>
        )}

        {notice && (
          <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
            {notice}
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <p>{error}</p>
            {unverified && (
              <button
                type="button"
                onClick={handleResend}
                disabled={busy}
                className="mt-1 font-semibold underline disabled:opacity-60"
              >
                Resend verification link
              </button>
            )}
          </div>
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
