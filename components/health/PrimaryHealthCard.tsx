"use client";

import { Circle, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

type HealthStatus = "safe" | "warning" | "at-risk";

interface PrimaryHealthCardProps {
  currentCash: number;
  remainingBalance: number;
  safeCash: number;
  status: HealthStatus;
  explanation: string;
  currency: string;
}

export function PrimaryHealthCard({
  currentCash,
  remainingBalance,
  safeCash,
  status,
  explanation,
  currency,
}: PrimaryHealthCardProps) {
  const statusConfig = {
    safe: {
      color: "bg-success",
      textColor: "text-success",
      label: "Safe",
      bgClass: "bg-success/10 border-success/20",
      icon: CheckCircle,
    },
    warning: {
      color: "bg-warning",
      textColor: "text-warning",
      label: "Warning",
      bgClass: "bg-warning/10 border-warning/20",
      icon: AlertTriangle,
    },
    "at-risk": {
      color: "bg-destructive",
      textColor: "text-destructive",
      label: "At Risk",
      bgClass: "bg-destructive/10 border-destructive/20",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-card rounded-xl shadow-premium border border-border p-8 hover:shadow-elevated transition-premium">
      <div className="flex items-start justify-between mb-6 gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-muted-foreground mb-1">
            Current Cash Balance
          </h2>
          <p className="text-4xl font-bold text-foreground">
            {currency}
            {currentCash.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            Net Balance
          </h3>
          <div className="flex items-center justify-end gap-2">
            <Circle className={`w-3 h-3 fill-current ${config.textColor}`} />
            <span className={`text-sm font-semibold ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground mt-1">
            {currency}
            {remainingBalance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Safe Cash Balance
          </span>
          <span className="text-2xl font-bold text-foreground">
            {currency}
            {safeCash.toLocaleString()}
          </span>
        </div>

        <div
          className={`${config.bgClass} border rounded-lg p-4 mb-4 flex gap-3`}
        >
          <StatusIcon
            className={`w-5 h-5 flex-shrink-0 ${config.textColor} mt-0.5`}
          />
          <p className={`text-sm leading-relaxed ${config.textColor}`}>
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
