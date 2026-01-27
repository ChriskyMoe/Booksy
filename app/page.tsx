import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LandingLoginCard from "@/components/LandingLoginCard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

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
              Booksy
            </h1>
            <p className="text-lg text-blue-100">
              Professional bookkeeping made simple. Manage invoices, track
              expenses, and grow your business with confidence.
            </p>
          </div>

          <div className="grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">50k+</div>
              <p className="text-sm text-blue-100">Businesses</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">$2B+</div>
              <p className="text-sm text-blue-100">Processed</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-semibold">99.9%</div>
              <p className="text-sm text-blue-100">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <LandingLoginCard />
      </div>
    </div>
  );
}
