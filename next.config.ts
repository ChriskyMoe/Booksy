import type { NextConfig } from "next";

function getSupabaseHostname(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return undefined
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase project storage hosts look like: <project-ref>.supabase.co
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      ...(getSupabaseHostname()
        ? [
            {
              protocol: 'https',
              hostname: getSupabaseHostname()!,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
