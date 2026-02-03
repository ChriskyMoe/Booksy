"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUSINESS_TYPES = [
  "Retail",
  "Service",
  "Freelance",
  "E-commerce",
  "Restaurant",
  "Consulting",
  "Other",
];

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "BRL",
];

export default function SetupPage() {
  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    baseCurrency: "USD",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    // Create business
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name: formData.name,
        business_type: formData.businessType || null,
        base_currency: formData.baseCurrency,
      })
      .select()
      .single();

    if (businessError) {
      setError(businessError.message);
      setLoading(false);
      return;
    }

    // Create default categories
    const { error: categoryError } = await supabase.rpc(
      "create_default_categories",
      {
        business_uuid: business.id,
      }
    );

    if (categoryError) {
      console.error("Error creating default categories:", categoryError);
      // Continue anyway - categories can be created manually
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Set up your business
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's get started with some basic information about your business
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md bg-white p-6 shadow-sm">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Business Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="My Business"
              />
            </div>

            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-700"
              >
                Business Type
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={(e) =>
                  setFormData({ ...formData, businessType: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a type</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="baseCurrency"
                className="block text-sm font-medium text-gray-700"
              >
                Base Currency *
              </label>
              <select
                id="baseCurrency"
                name="baseCurrency"
                required
                value={formData.baseCurrency}
                onChange={(e) =>
                  setFormData({ ...formData, baseCurrency: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Complete Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
