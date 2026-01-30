"use client";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Add Income or Expense",
      description:
        "Tap the + button, enter the amount, and add a quick description. Takes 5 seconds.",
      color: "bg-blue-600",
      shadow: "shadow-blue-600/30",
      bgCircle: "bg-blue-200",
      example: (
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-slate-900">
              Client Payment
            </p>
            <p className="text-xs text-slate-500">Income</p>
          </div>
          <p className="text-lg font-bold text-green-600">$2,500</p>
        </div>
      ),
    },
    {
      number: "2",
      title: "Categorize Transactions",
      description:
        "Choose from smart categories or create your own. Booksy learns your patterns over time.",
      color: "bg-green-600",
      shadow: "shadow-green-600/30",
      bgCircle: "bg-green-200",
      example: (
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            🍔 Food
          </span>
          <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
            🚗 Transport
          </span>
          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            💼 Work
          </span>
          <span className="px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
            🎉 Fun
          </span>
        </div>
      ),
    },
    {
      number: "3",
      title: "See Summaries & Trends",
      description:
        "View monthly summaries, spending trends, and export reports whenever you need them.",
      color: "bg-purple-600",
      shadow: "shadow-purple-600/30",
      bgCircle: "bg-purple-200",
      example: (
        <div className="w-full max-w-xs mx-auto p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 mb-2 text-left">This Month</p>
          <div className="flex items-end justify-between h-16 gap-1 mb-2">
            <div
              className="flex-1 bg-blue-300 rounded-t"
              style={{ height: "40%" }}
            ></div>
            <div
              className="flex-1 bg-blue-400 rounded-t"
              style={{ height: "70%" }}
            ></div>
            <div
              className="flex-1 bg-blue-500 rounded-t"
              style={{ height: "55%" }}
            ></div>
            <div
              className="flex-1 bg-blue-600 rounded-t"
              style={{ height: "100%" }}
            ></div>
          </div>
          <p className="text-xs text-slate-600 text-left">
            Income trending up 12% 📈
          </p>
        </div>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-6 md:px-12 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 reveal-item opacity-0">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3 block">
            Getting Started
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Up and Running in{" "}
            <span className="text-blue-600">3 Simple Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="reveal-item opacity-0 text-center">
              <div className="relative mb-8">
                <div
                  className={`w-20 h-20 rounded-2xl ${step.color} text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-lg ${step.shadow}`}
                >
                  {step.number}
                </div>
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${step.bgCircle} rounded-full -z-10 opacity-20`}
                ></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {step.description}
              </p>
              <div className="w-full max-w-xs mx-auto p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                {step.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
