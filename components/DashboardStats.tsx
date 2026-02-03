import { formatCurrency } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DashboardStatsProps {
  data: {
    income: number;
    expenses: number;
    cashBalance: number;
    currency: string;
  };
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Income",
      value: formatCurrency(data.income, data.currency),
      icon: ArrowUpRight,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      iconBg: "bg-white",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(data.expenses, data.currency),
      icon: ArrowDownRight,
      color: "text-rose-600",
      bg: "bg-rose-50",
      iconBg: "bg-white",
    },
    {
      label: "Cash Balance",
      value: formatCurrency(data.cashBalance, data.currency),
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/5",
      iconBg: "bg-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-2xl p-6 shadow-premium border border-transparent hover:border-black/5 transition-premium ${stat.bg}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  {stat.label}
                </p>
                <p className={`text-2xl font-black mt-2 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-xl shadow-sm ${stat.iconBg} flex items-center justify-center ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
