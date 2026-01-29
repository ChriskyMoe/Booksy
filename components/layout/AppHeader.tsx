import React from "react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function AppHeader({ title, subtitle, children }: AppHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children && (
            <div className="flex items-center gap-2">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
