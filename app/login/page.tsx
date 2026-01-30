"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message =
        error.message.includes("rate limit") || error.message.includes("429")
          ? "Too many login attempts. Please wait a few minutes before trying again."
          : error.message;
      setError(message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden px-8 py-12">
        {/* Background Image with Translucent Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/sign-in-page.jpg)" }}
        />
        <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm" />
        <div className="relative z-10 mx-auto max-w-xl space-y-8 text-center lg:text-left">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Welcome Back to Booksy
            </h1>
            <p className="text-lg text-blue-100">
              Access your account to manage finances, track expenses, and get
              AI-powered insights for your business.
            </p>
          </div>

          <div className="grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">Secure Login</div>
              <p className="text-sm text-blue-100">Your data, protected</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">Fast Access</div>
              <p className="text-sm text-blue-100">
                Instant financial overview
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">Smart Insights</div>
              <p className="text-sm text-blue-100">AI at your fingertips</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        {" "}
        {/* Added relative positioning */}
        <Link
          href="/"
          className="absolute left-6 top-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-elevated">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Sign in to your account
            </h2>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
