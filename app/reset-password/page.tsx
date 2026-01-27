"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if user came from a valid password reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        setError("Invalid or expired reset link");
      }
    });
  }, [supabase.auth]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Password updated successfully
    router.push("/dashboard");
    router.refresh();
  };

  if (!isValidSession && error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-elevated text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Invalid Link
            </h2>
            <p className="text-sm text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
            >
              <Button className="w-full">Request new reset link</Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 px-8 py-12 text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.1),_transparent_40%)] opacity-60"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-xl space-y-8 text-center lg:text-left">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            🔑
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Create New Password
            </h1>
            <p className="text-lg text-blue-100">
              Choose a strong password to secure your account. Make sure it's at
              least 6 characters long.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur space-y-2 text-left">
            <p className="font-medium text-sm">Password tips:</p>
            <ul className="space-y-1 text-sm text-blue-100">
              <li>• Use at least 6 characters</li>
              <li>• Mix uppercase and lowercase letters</li>
              <li>• Include numbers and symbols</li>
              <li>• Avoid common words or patterns</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-elevated">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Set new password
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !isValidSession}
              className="w-full"
            >
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
