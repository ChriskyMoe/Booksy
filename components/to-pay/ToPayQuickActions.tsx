"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckSquare, CalendarDays, ExternalLink } from "lucide-react";

export function ToPayQuickActions() {
    const actions = [
        {
            title: "Add recurring payment",
            icon: RefreshCcw,
            description: "Set up regular expenses"
        },
        {
            title: "Mark multiple as paid",
            icon: CheckSquare,
            description: "Bulk update status"
        },
        {
            title: "View payment calendar",
            icon: CalendarDays,
            description: "See monthly timeline"
        }
    ];

    return (
        <Card className="border-none shadow-sm h-fit">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {actions.map((action) => (
                    <Button
                        key={action.title}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-primary/5 group"
                    >
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-colors">
                            <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium">{action.title}</div>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}
