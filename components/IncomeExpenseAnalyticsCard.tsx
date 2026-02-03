"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Loader2,
} from "lucide-react";

interface DataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface ChartPoint {
  key: string;
  label: string;
  income: number;
  expenses: number;
}

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

interface IncomeExpenseAnalyticsCardProps {
  data: DataPoint[];
  summary: Summary;
  currency: string;
}

export function IncomeExpenseAnalyticsCard({
  data,
  summary,
  currency,
}: IncomeExpenseAnalyticsCardProps) {
  const [timeFilter, setTimeFilter] = useState<
    "Monthly" | "Quarterly" | "Yearly"
  >("Monthly");
  const sortedMonthKeys = useMemo(() => {
    return [...data.map((item) => item.month)].sort();
  }, [data]);

  const latestMonthKey = sortedMonthKeys[sortedMonthKeys.length - 1];
  const initialYear = latestMonthKey
    ? latestMonthKey.substring(0, 4)
    : new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("");

  // Extract unique years from data for year selector
  const availableYears = useMemo(() => {
    const years = new Set<string>();

    data.forEach((item) => {
      if (item.month.includes("-")) {
        years.add(item.month.substring(0, 4));
      }
    });

    if (years.size === 0) {
      years.add(new Date().getFullYear().toString());
    }

    return Array.from(years).sort().reverse();
  }, [data]);

  const formatMonthLabel = (monthKey: string) => {
    if (!monthKey.includes("-")) return monthKey;
    const date = new Date(`${monthKey}-01T00:00:00`);
    return date.toLocaleString("en-US", { month: "short" });
  };

  const formatQuarterLabel = (quarterKey: string) => {
    switch (quarterKey) {
      case "Q1":
        return "Q1(Jan to March)";
      case "Q2":
        return "Q2(Apr to Jun)";
      case "Q3":
        return "Q3(Jul to Sep)";
      case "Q4":
        return "Q4(Oct to Dec)";
      default:
        return quarterKey;
    }
  };

  const getYearFromKey = (monthKey: string) => {
    if (!monthKey.includes("-")) return "";
    return monthKey.substring(0, 4);
  };

  const dataByMonth = useMemo(() => {
    const map = new Map<string, { income: number; expenses: number }>();
    data.forEach((item) => {
      map.set(item.month, {
        income: item.income,
        expenses: item.expenses,
      });
    });
    return map;
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate period-specific totals
  const calculatePeriodTotals = (
    filteredData: Array<{ income: number; expenses: number }>
  ): { income: number; expenses: number; profit: number } => {
    if (filteredData.length === 0) {
      return { income: 0, expenses: 0, profit: 0 };
    }

    const totals = filteredData.reduce(
      (acc, item) => ({
        income: acc.income + item.income,
        expenses: acc.expenses + item.expenses,
      }),
      { income: 0, expenses: 0 }
    );

    return {
      income: totals.income,
      expenses: totals.expenses,
      profit: totals.income - totals.expenses,
    };
  };

  const chartData: ChartPoint[] = useMemo(() => {
    if (timeFilter === "Monthly") {
      const year = selectedYear || new Date().getFullYear().toString();
      const points: ChartPoint[] = [];
      for (let i = 1; i <= 12; i++) {
        const monthNumber = String(i).padStart(2, "0");
        const key = `${year}-${monthNumber}`;
        const existing = dataByMonth.get(key);
        points.push({
          key,
          label: formatMonthLabel(key),
          income: existing?.income || 0,
          expenses: existing?.expenses || 0,
        });
      }
      return points;
    }

    if (timeFilter === "Quarterly") {
      const year = selectedYear || new Date().getFullYear().toString();
      const quarters: ChartPoint[] = [
        { key: "Q1", label: formatQuarterLabel("Q1"), income: 0, expenses: 0 },
        { key: "Q2", label: formatQuarterLabel("Q2"), income: 0, expenses: 0 },
        { key: "Q3", label: formatQuarterLabel("Q3"), income: 0, expenses: 0 },
        { key: "Q4", label: formatQuarterLabel("Q4"), income: 0, expenses: 0 },
      ];

      for (let i = 1; i <= 12; i++) {
        const monthNumber = String(i).padStart(2, "0");
        const key = `${year}-${monthNumber}`;
        const existing = dataByMonth.get(key);
        const quarterIndex = Math.floor((i - 1) / 3);
        if (existing) {
          quarters[quarterIndex].income += existing.income;
          quarters[quarterIndex].expenses += existing.expenses;
        }
      }

      return quarters;
    }

    const yearlyMap = new Map<string, { income: number; expenses: number }>();
    data.forEach((item) => {
      const year = getYearFromKey(item.month);
      if (!year) return;
      if (!yearlyMap.has(year)) {
        yearlyMap.set(year, { income: 0, expenses: 0 });
      }
      const current = yearlyMap.get(year)!;
      current.income += item.income;
      current.expenses += item.expenses;
    });

    return Array.from(yearlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, values]) => ({
        key: year,
        label: year,
        income: values.income,
        expenses: values.expenses,
      }));
  }, [data, dataByMonth, selectedYear, timeFilter]);

  // Calculate date range (last 12 months)
  const getHeaderRange = () => {
    if (timeFilter === "Monthly") {
      return "";
    }
    if (timeFilter === "Quarterly") {
      return "";
    }
    if (timeFilter === "Yearly") {
      return selectedKey || "All years";
    }
    return "";
  };

  // Memoized dynamic stats based on selected period
  const dynamicStats = useMemo(() => {
    let statsData = chartData;

    if (selectedKey) {
      statsData = chartData.filter((item) => item.key === selectedKey);
    }

    const totals = calculatePeriodTotals(statsData);
    return [
      {
        label: "Total Income",
        value: totals.income,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        icon: ArrowUpRight,
      },
      {
        label: "Total Expenses",
        value: totals.expenses,
        color: "text-rose-600",
        bg: "bg-rose-50",
        icon: ArrowDownRight,
      },
      {
        label: "Net Profit",
        value: totals.profit,
        color: totals.profit >= 0 ? "text-emerald-600" : "text-rose-600",
        bg: totals.profit >= 0 ? "bg-emerald-50" : "bg-rose-50",
        icon: totals.profit >= 0 ? TrendingUp : TrendingDown,
      },
    ];
  }, [chartData, selectedKey]);

  // Handle time filter change with transition effect
  const handleFilterChange = (filter: "Monthly" | "Quarterly" | "Yearly") => {
    setIsTransitioning(true);
    setTimeFilter(filter);
    // Transition effect timeout
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Get period label for clarity
  const getPeriodLabel = (): string => {
    switch (timeFilter) {
      case "Quarterly":
        if (!selectedKey) return "(Quarterly Aggregation)";
        return formatQuarterLabel(selectedKey);
      case "Yearly":
        return "";
      default: {
        if (!selectedKey) return "";
        const selected = chartData.find((item) => item.key === selectedKey);
        return selected ? selected.label : "";
      }
    }
  };

  useEffect(() => {
    if (chartData.length === 0) {
      setSelectedKey("");
      return;
    }
    const keys = new Set(chartData.map((item) => item.key));
    if (!selectedKey || !keys.has(selectedKey)) {
      if (timeFilter === "Monthly") {
        setSelectedKey(chartData[0].key);
        return;
      }
      if (timeFilter === "Quarterly") {
        setSelectedKey(chartData[0].key);
        return;
      }
      setSelectedKey(chartData[chartData.length - 1].key);
    }
  }, [chartData, selectedKey, timeFilter]);

  return (
    <Card className="border-none shadow-premium bg-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Income vs Expenses
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getHeaderRange()} {getPeriodLabel()}
            </p>
          </div>
          <div className="flex bg-muted/50 p-1 rounded-lg gap-1 self-start flex-wrap">
            {["Monthly", "Quarterly", "Yearly"].map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  handleFilterChange(
                    filter as "Monthly" | "Quarterly" | "Yearly"
                  )
                }
                disabled={isTransitioning}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  timeFilter === filter
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                } disabled:opacity-50`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Year selector (hidden for Yearly view) */}
          {timeFilter !== "Yearly" && (
            <div className="flex gap-2">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setIsTransitioning(true);
                  setSelectedYear(e.target.value);
                  setTimeout(() => setIsTransitioning(false), 300);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-background text-foreground border border-border hover:border-foreground/50 transition-all cursor-pointer"
              >
                <option value="">Select Year...</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        {/* Summary Stats with smooth transition */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-opacity duration-300 ${
            isTransitioning ? "opacity-60" : "opacity-100"
          }`}
        >
          {dynamicStats.map((stat) => (
            <div
              key={stat.label}
              className={`p-5 rounded-2xl ${stat.bg} border border-transparent hover:border-black/5 transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2 rounded-lg bg-white/80 shadow-sm ${stat.color}`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  {stat.label}
                </span>
              </div>
              <div
                className={`text-2xl font-black ${stat.color} transition-all duration-300`}
              >
                {isTransitioning ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Updating...</span>
                  </div>
                ) : (
                  formatCurrency(stat.value)
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Visualization with smooth transition */}
        <div
          className={`h-87.5 w-full pt-4 transition-opacity duration-300 ${
            isTransitioning ? "opacity-60" : "opacity-100"
          }`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barGap={8}
              onClick={(state: any) => {
                const payload = state?.activePayload?.[0]?.payload;
                if (payload?.key) {
                  setSelectedKey(payload.key);
                }
              }}
            >
              <circle cx="0" cy="0" r="0" /> {/* Recharts fix for SSR */}
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.05)"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                  fontWeight: 500,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                  fontWeight: 500,
                }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border shadow-premium rounded-xl p-4 space-y-2 min-w-37.5">
                        <p className="text-sm font-bold border-b pb-2 mb-2">
                          {payload[0].payload.label}
                        </p>
                        {payload.map((entry: any) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs text-muted-foreground font-medium">
                                {entry.name}
                              </span>
                            </div>
                            <span className="text-xs font-bold">
                              {formatCurrency(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="hsl(var(--chart-1))"
                radius={[6, 6, 0, 0]}
                barSize={20}
                onClick={(data: any) => {
                  if (data?.payload?.key) {
                    setSelectedKey(data.payload.key);
                  }
                }}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="hsl(var(--destructive))"
                radius={[6, 6, 0, 0]}
                barSize={20}
                onClick={(data: any) => {
                  if (data?.payload?.key) {
                    setSelectedKey(data.payload.key);
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
