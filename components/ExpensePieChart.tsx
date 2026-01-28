"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface ExpenseBreakdownDataPoint {
  name: string;
  value: number;
}

interface ExpensePieChartProps {
  data: ExpenseBreakdownDataPoint[];
  currency: string;
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A2D9F7", "#F7DC6F", "#F1948A", "#BB8FCE", "#73C6B6", "#D98880", "#C39BD3", "#7DCEA0"
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ExpensePieChart({ data, currency }: ExpensePieChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Don't render chart on server-side
  }

  const tooltipContentStyle = {
    backgroundColor: theme === "dark" ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)", // card background
    borderColor: theme === "dark" ? "hsl(217.2 32.6% 17.5%)" : "hsl(214.3 31.8% 91.4%)", // border
    borderRadius: "0.375rem", // rounded-md
  };

  const tooltipItemStyle = {
    color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)", // foreground
  };

  return (
    <div className="h-80 w-full rounded-lg bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Expense Breakdown by Category
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipContentStyle}
            itemStyle={tooltipItemStyle}
            formatter={(value: number) => formatCurrency(value, currency)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
