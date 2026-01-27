'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react'; // Import the icon

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      const message =
        error.message.includes("rate limit") || error.message.includes("429")
          ? "Too many signup attempts. Please wait a few minutes before trying again, or try using a different email address."
          : error.message;
      setError(message);
      setLoading(false);
      return;
    }

    router.push("/setup");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 px-8 py-12 text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.1),_transparent_40%)] opacity-60"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-xl space-y-8 text-center lg:text-left">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Join Booksy
            </h1>
            <p className="text-lg text-blue-100">
              Create your account to manage invoices, track expenses, and grow
              your business with confidence.
            </p>
          </div>

          <div className="grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">AI-first</div>
              <p className="text-sm text-blue-100">Insights & automation</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">Secure</div>
              <p className="text-sm text-blue-100">Built for peace of mind</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">Fast setup</div>
              <p className="text-sm text-blue-100">Minutes to launch</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center bg-background px-6 py-12 sm:px-10"> {/* Added relative positioning */}
        <Link href="/" className="absolute left-6 top-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-elevated">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Create your account
            </h2>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm password</Label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
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