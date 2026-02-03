"use client";

import { AlertCircle, Clock, TrendingDown } from "lucide-react";

interface Alert {
    id: string;
    type: "warning" | "info" | "urgent";
    message: string;
    icon?: "clock" | "alert" | "trend";
}

interface HealthAlertsProps {
    alerts: Alert[];
}

export function HealthAlerts({ alerts }: HealthAlertsProps) {
    const getIcon = (iconType?: string) => {
        switch (iconType) {
            case "clock":
                return <Clock className="w-5 h-5" />;
            case "trend":
                return <TrendingDown className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getAlertStyle = (type: Alert["type"]) => {
        switch (type) {
            case "urgent":
                return "bg-destructive bg-opacity-5 border-destructive text-destructive";
            case "warning":
                return "bg-warning bg-opacity-5 border-warning text-warning";
            default:
                return "bg-primary bg-opacity-5 border-primary text-primary";
        }
    };

    if (alerts.length === 0) {
        return null;
    }

    return (
        <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Alerts & Reminders
            </h3>

            <div className="space-y-3">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border transition-premium hover:shadow-card cursor-pointer ${getAlertStyle(
                            alert.type
                        )}`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(alert.icon)}
                        </div>
                        <p className="text-sm font-medium flex-1">{alert.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
