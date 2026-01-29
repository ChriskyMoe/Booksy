"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ChartDataPoint {
  date: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: ChartDataPoint[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Don't render chart on server-side
  }

  const gridColor = theme === "dark" ? "hsl(217.2 32.6% 17.5%)" : "hsl(214.3 31.8% 91.4%)"; // border-border
  const axisColor = theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)"; // foreground
  const incomeColor = "hsl(var(--success))";
  const expenseColor = "hsl(var(--destructive))";

  return (
    <div className="h-80 w-full rounded-lg bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Monthly Income vs. Expenses
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={axisColor} tickFormatter={(value) => value.substring(5)} />
          <YAxis stroke={axisColor} tickFormatter={(value) => `$${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor:
                theme === "dark"
                  ? "hsl(222.2 84% 4.9%)"
                  : "hsl(0 0% 100%)", // card background
              borderColor:
                theme === "dark"
                  ? "hsl(217.2 32.6% 17.5%)"
                  : "hsl(214.3 31.8% 91.4%)", // border
              borderRadius: "0.375rem", // rounded-md
            }}
            itemStyle={{ color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)" }} // foreground
          />
          <Legend />
          <Bar dataKey="income" fill={incomeColor} name="Income" />
          <Bar dataKey="expenses" fill={expenseColor} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
