"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ChatWidget from "@/components/ChatWidget";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  businessName?: string;
  avatarUrl?: string | null;
}

export default function AuthenticatedLayout({
  children,
  businessName,
  avatarUrl,
}: AuthenticatedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
