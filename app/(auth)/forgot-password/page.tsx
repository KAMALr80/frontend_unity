"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AUTH_BUTTON, AUTH_INPUT, AuthCard } from "@/components/auth/AuthCard";
import api from "@/lib/axios";
import { FormAlert } from "@/components/shared/FormAlert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // The API answers the same whether or not the address has an account (no account lookup from outside).
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(status === 429 ? "Too many requests. Please wait a minute and try again." : status === 422 ? "Please enter a valid email address." : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard eyebrow="Account" title="Forgot your password?" intro="Enter your account email and we will send you a link to choose a new password.">
      {sent ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3" role="status">
          <p className="text-[13px] font-medium text-foreground">Check your email</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">If {email} has an account, a password reset link is on its way. The link expires after 60 minutes.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <FormAlert>{error}</FormAlert>}
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-[12px] font-medium text-foreground">Email address</label>
            <input id="forgot-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required autoComplete="email" className={AUTH_INPUT} />
          </div>
          <button type="submit" disabled={loading} aria-busy={loading || undefined} className={AUTH_BUTTON}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            Send reset link
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-[12px] text-muted-foreground">
        Remembered it? <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">Back to sign in</Link>
      </p>
    </AuthCard>
  );
}
