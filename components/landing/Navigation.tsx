"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 backdrop-blur-md bg-white/80 border-b border-blue-100/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Booksy
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-blue-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="hover:text-blue-600 transition-colors"
          >
            Reviews
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
