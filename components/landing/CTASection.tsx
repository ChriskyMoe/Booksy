"use client";

export default function CTASection() {
  return (
    <section className="py-32 px-6 md:px-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 reveal-item opacity-0">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
          Take Control of Your Finances Today
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join 5,000+ users who track their money with confidence. Get started
          in under 2 minutes.
        </p>

        <a
          href="/signup"
          className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-full text-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20 mb-6"
        >
          Start Using Booksy
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>

        <p className="text-blue-200 text-sm">
          Free to start • No credit card needed • Cancel anytime
        </p>
      </div>
    </section>
  );
}
