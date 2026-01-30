"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function HeroSection() {
  useEffect(() => {
    gsap.set(".hero-reveal-item", { opacity: 0, y: 40 });

    const revealItems = document.querySelectorAll(".hero-reveal-item");
    revealItems.forEach((el) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;
      if (isVisible) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 -z-10"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Content */}
        <div className="hero-reveal-item opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-sm font-medium text-green-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Free to start • No credit card needed
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Track Your Money.
            <span className="text-blue-600"> Stay in Control.</span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
            Booksy helps you track income and expenses in one clean dashboard —
            no accounting degree required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
            >
              Get Started Free
              <svg
                className="w-5 h-5"
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
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full text-lg font-semibold hover:border-blue-300 transition-all"
            >
              See How It Works
            </a>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/100?img=23"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/100?img=34"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/100?img=45"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">5,000+ users</span>{" "}
              managing their finances daily
            </p>
          </div>
        </div>

        {/* Right Content: Dashboard Mockup */}
        <div className="relative hero-reveal-item opacity-0 lg:pl-12">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-blue-100 bg-white transform hover:scale-[1.02] transition-transform duration-500">
            <div className="p-6 md:p-8">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  January 2026
                </h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Balance Display */}
              <div className="mb-8">
                <p className="text-sm text-slate-500 mb-1">Current Balance</p>
                <p className="text-4xl md:text-5xl font-bold text-slate-900">
                  $8,420
                </p>
                <p className="text-sm text-green-600 font-medium mt-1">
                  +12.5% from last month
                </p>
              </div>

              {/* Income/Expense Split */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-xs text-green-700 font-medium mb-1">
                    Income
                  </p>
                  <p className="text-2xl font-bold text-green-600">$12,340</p>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700 font-medium mb-1">
                    Expenses
                  </p>
                  <p className="text-2xl font-bold text-red-600">$3,920</p>
                </div>
              </div>

              {/* Mini Chart Visualization */}
              <div className="flex items-end justify-between h-24 gap-2">
                <div
                  className="flex-1 bg-blue-200 rounded-t-lg"
                  style={{ height: "60%" }}
                ></div>
                <div
                  className="flex-1 bg-blue-300 rounded-t-lg"
                  style={{ height: "80%" }}
                ></div>
                <div
                  className="flex-1 bg-blue-400 rounded-t-lg"
                  style={{ height: "45%" }}
                ></div>
                <div
                  className="flex-1 bg-blue-500 rounded-t-lg"
                  style={{ height: "90%" }}
                ></div>
                <div
                  className="flex-1 bg-blue-600 rounded-t-lg"
                  style={{ height: "100%" }}
                ></div>
                <div
                  className="flex-1 bg-blue-500 rounded-t-lg"
                  style={{ height: "70%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Floating Category Card */}
          <div className="absolute -top-6 -right-6 w-56 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <p className="text-xs text-slate-500 font-medium mb-3">
              Top Categories
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-700">Groceries</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  $842
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-slate-700">Utilities</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  $320
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-700">Transport</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  $180
                </span>
              </div>
            </div>
          </div>

          {/* Floating Transaction Card */}
          <div className="absolute -bottom-6 -left-6 w-64 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <p className="text-xs text-slate-500 font-medium mb-3">
              Recent Transactions
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Client Payment
                    </p>
                    <p className="text-xs text-slate-500">Today</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +$2,500
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Office Supplies
                    </p>
                    <p className="text-xs text-slate-500">Yesterday</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  -$142
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
