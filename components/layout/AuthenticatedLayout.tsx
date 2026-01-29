"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ChatWidget from "@/components/ChatWidget";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessName, setBusinessName] = useState<string | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setBusinessName(data.name);
          setAvatarUrl(data.avatar_url);
        }
      }
    };
    fetchBusiness();
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar
        businessName={businessName}
        avatarUrl={avatarUrl}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          businessName={businessName}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      {/* Global AI chat assistant, shown on all authenticated pages */}
      <ChatWidget />
    </div>
  );
}
