"use client";

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Track in Real Time",
      description:
        "Add income and expenses instantly. See your balance update in real time across all devices.",
      bg: "from-blue-50 to-white border-blue-100",
      bgColor: "bg-blue-600",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Clear Visual Insights",
      description:
        "Beautiful charts and summaries show exactly where your money goes at a glance.",
      bg: "from-green-50 to-white border-green-100",
      bgColor: "bg-green-600",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      title: "Simple Categories & Tags",
      description:
        "Organize transactions with custom categories. Perfect for personal use or small business.",
      bg: "from-purple-50 to-white border-purple-100",
      bgColor: "bg-purple-600",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-6 md:px-12 bg-white border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal-item opacity-0">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3 block">
            Why Booksy
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Simple. Visual. Powerful.
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to track your money, nothing you don't.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`reveal-item opacity-0 p-8 rounded-2xl bg-gradient-to-br ${feature.bg} hover:shadow-xl transition-all duration-300 group`}
            >
              <div
                className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
