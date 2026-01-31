"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseBreakdownDataPoint {
  name: string;
  value: number;
}

interface ExpensePieChartProps {
  data: ExpenseBreakdownDataPoint[];
  currency: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--destructive))",
];

export default function ExpensePieChart({ data, currency }: ExpensePieChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-premium h-80 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No expense data available</p>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-premium bg-card overflow-hidden h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold tracking-tight">Expense Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Expenses by category</p>
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border shadow-premium rounded-xl p-3 min-w-[120px]">
                      <p className="text-xs font-bold mb-1">{payload[0].name}</p>
                      <p className="text-sm font-black text-primary">
                        {formatCurrency(payload[0].value as number, currency)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value) => <span className="text-xs font-medium text-muted-foreground ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
