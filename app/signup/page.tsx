"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

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
      {/* Left Side - Branding */}
      <div className="relative hidden lg:flex flex-col items-center justify-center w-full bg-gradient-to-br from-accent/10 via-primary/5 to-background overflow-hidden px-8 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(217,100,255,0.15),_transparent_50%)]" aria-hidden />
        
        <Link
          href="/"
          className="absolute left-8 top-8 z-20 flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Booksy
        </Link>

        <div className="relative z-10 mx-auto max-w-xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Join Booksy Today
            </h1>
            <p className="text-lg text-muted-foreground">
              Start managing your business finances with AI-powered insights and beautiful dashboards.
            </p>
          </div>

          <div className="grid gap-3 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">AI-Powered Insights</p>
                <p className="text-sm text-muted-foreground">Intelligent financial analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Enterprise Security</p>
                <p className="text-sm text-muted-foreground">Your data, always protected</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Quick Setup</p>
                <p className="text-sm text-muted-foreground">Start in just minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="relative flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="lg:hidden absolute left-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden space-y-2">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Booksy
            </Link>
            <h2 className="text-2xl font-bold text-foreground">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Join thousands of business owners using Booksy
            </p>
          </div>

          <div className="hidden lg:block space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Get started with Booksy in minutes
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="rounded-lg border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="rounded-lg border-border"
              />
              <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="rounded-lg border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg h-10 bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
