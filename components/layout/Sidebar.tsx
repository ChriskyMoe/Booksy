"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  BookOpen,
  DollarSign,
  Sparkles,
  LogOut,
  X,
  FileText,
  Activity,
  Upload,
  CreditCard,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "To Pay", href: "/to-pay", icon: CreditCard },
  { name: "Business Health", href: "/business-health", icon: Activity },
  { name: "Upload Documents", href: "/upload-documents", icon: Upload },
  { name: "Ledger", href: "/ledger", icon: BookOpen },
  { name: "Currency Converter", href: "/currency-converter", icon: DollarSign },
  { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
];

interface SidebarProps {
  businessName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  businessName,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onClose?.()}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-full w-64 flex-col border-r text-white bg-gradient-to-br from-blue-500/20 via-indigo-700/20 to-purple-900/20 overflow-x-hidden transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen
            ? "fixed inset-y-0 left-0 z-50 translate-x-0"
            : "fixed inset-y-0 left-0 z-50 -translate-x-full lg:relative lg:z-auto"
        )}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => onClose?.()}
            className="text-sidebar-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose?.()}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
