"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AUTH_BUTTON, AUTH_INPUT, AuthCard } from "@/components/auth/AuthCard";
import api from "@/lib/axios";

/** Opened from the password-reset email: ?token=…&email=… */
function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token || !email) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
        <p className="text-[13px] text-destructive">This reset link is incomplete. Please open the link from your email again or <Link href="/forgot-password" className="font-semibold underline">request a new one</Link>.</p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) return setError("The password must be at least 8 characters.");
    if (password !== confirmation) return setError("The two passwords do not match.");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, email, password, password_confirmation: confirmation });
      setDone(true);
    } catch (err: unknown) {
      const response = (err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } })?.response;
      const fieldError = response?.data?.errors ? Object.values(response.data.errors)[0]?.[0] : undefined;
      setError(response?.status === 429 ? "Too many attempts. Please wait a minute and try again." : fieldError || response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3" role="status">
          <p className="text-[13px] font-medium text-foreground">Password updated</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">You can now sign in with your new password.</p>
        </div>
        <Link href="/login" className={`${AUTH_BUTTON} no-underline`}>Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"><p className="text-[13px] text-destructive">{error}</p></div>}
      <p className="text-[12px] text-muted-foreground">Account: <span className="font-medium text-foreground">{email}</span></p>
      <div>
        <label htmlFor="reset-password" className="mb-1.5 block text-[12px] font-medium text-foreground">New password</label>
        <input id="reset-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" className={AUTH_INPUT} />
      </div>
      <div>
        <label htmlFor="reset-password-confirmation" className="mb-1.5 block text-[12px] font-medium text-foreground">Confirm new password</label>
        <input id="reset-password-confirmation" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={8} autoComplete="new-password" className={AUTH_INPUT} />
      </div>
      <button type="submit" disabled={loading} aria-busy={loading || undefined} className={AUTH_BUTTON}>
        {loading && <Loader2 size={14} className="animate-spin" />}
        Save new password
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard eyebrow="Account" title="Choose a new password" intro="Use at least 8 characters.">
      <Suspense fallback={<p className="text-[13px] text-muted-foreground">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
      <p className="mt-6 text-center text-[12px] text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">Back to sign in</Link>
      </p>
    </AuthCard>
  );
}
