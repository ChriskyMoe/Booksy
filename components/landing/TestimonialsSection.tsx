"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  useEffect(() => {
    // Animate stats counters
    const counters = document.querySelectorAll(".stat-counter");
    counters.forEach((counter) => {
      const target = parseInt(
        (counter as HTMLElement).getAttribute("data-target") || "0"
      );

      gsap.to(
        { val: 0 },
        {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: function () {
            const currentVal = Math.floor(this.targets()[0].val);
            if (target >= 1000) {
              (counter as HTMLElement).innerText =
                currentVal.toLocaleString() + "+";
            } else {
              (counter as HTMLElement).innerText = currentVal + "%";
            }
          },
        }
      );
    });
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      image: "https://i.pravatar.cc/100?img=28",
      text: '"Finally, a bookkeeping app that doesn\'t feel like homework. I can see exactly where my freelance income goes in seconds."',
      bg: "from-blue-50 to-white border-blue-100",
      avatar: "border-blue-200",
    },
    {
      name: "Marcus Johnson",
      role: "Small Business Owner",
      image: "https://i.pravatar.cc/100?img=33",
      text: '"Booksy replaced my messy spreadsheets. The visual charts make it so easy to spot spending patterns and plan ahead."',
      bg: "from-green-50 to-white border-green-100",
      avatar: "border-green-200",
    },
    {
      name: "Emily Rodriguez",
      role: "Side Hustler",
      image: "https://i.pravatar.cc/100?img=44",
      text: '"I track my side hustle income and expenses in under a minute a day. Booksy keeps me organized without the complexity."',
      bg: "from-purple-50 to-white border-purple-100",
      avatar: "border-purple-200",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-24 px-6 md:px-12 bg-white border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 reveal-item opacity-0">
          <div className="text-center">
            <div
              className="stat-counter text-5xl md:text-6xl font-bold text-blue-600 mb-2"
              data-target="5000"
            >
              0
            </div>
            <p className="text-slate-600 font-medium">Active Users</p>
          </div>
          <div className="text-center">
            <div
              className="stat-counter text-5xl md:text-6xl font-bold text-green-600 mb-2"
              data-target="98"
            >
              0
            </div>
            <p className="text-slate-600 font-medium">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <div
              className="stat-counter text-5xl md:text-6xl font-bold text-purple-600 mb-2"
              data-target="150000"
            >
              0
            </div>
            <p className="text-slate-600 font-medium">Transactions Tracked</p>
          </div>
          <div className="text-center">
            <div
              className="stat-counter text-5xl md:text-6xl font-bold text-orange-600 mb-2"
              data-target="24"
            >
              0
            </div>
            <p className="text-slate-600 font-medium">Countries</p>
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="text-center mb-12 reveal-item opacity-0">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Loved by Freelancers & Small Businesses
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`reveal-item opacity-0 p-8 rounded-2xl bg-gradient-to-br ${testimonial.bg} shadow-sm hover:shadow-xl transition-all`}
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={`w-14 h-14 rounded-full border-2 ${testimonial.avatar}`}
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                {testimonial.text}
              </p>
              <div className="flex gap-1 text-yellow-400">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="reveal-item opacity-0">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Trusted & Secure
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex items-center gap-3 text-slate-600">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-medium">Bank-Level Encryption</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <span className="font-medium">Cloud-Based Backup</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="font-medium">Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
