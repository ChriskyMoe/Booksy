"use client";

type HealthStatus = "safe" | "warning" | "at-risk";

interface PrimaryHealthCardProps {
    currentCash: number;
    safeCash: number;
    status: HealthStatus;
    explanation: string;
    currency: string;
}

export function PrimaryHealthCard({
    currentCash,
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
            icon: "✓",
        },
        warning: {
            color: "bg-warning",
            textColor: "text-warning",
            label: "Warning",
            icon: "⚠",
        },
        "at-risk": {
            color: "bg-destructive",
            textColor: "text-destructive",
            label: "At Risk",
            icon: "!",
        },
    };

    const config = statusConfig[status];

    return (
        <div className="bg-card rounded-xl shadow-premium border border-border p-8 hover:shadow-elevated transition-premium">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-muted-foreground mb-1">
                        Current Cash Balance
                    </h2>
                    <p className="text-4xl font-bold text-foreground">
                        {currency}
                        {currentCash.toLocaleString()}
                    </p>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.color} bg-opacity-10`}>
                    <span className={`text-lg ${config.textColor}`}>{config.icon}</span>
                    <span className={`font-semibold ${config.textColor}`}>
                        {config.label}
                    </span>
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

                <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                        {explanation}
                    </p>
                </div>
            </div>
        </div>
    );
}
