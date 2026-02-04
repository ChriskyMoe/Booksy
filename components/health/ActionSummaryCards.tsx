"use client";

import { ArrowUpRight, Calendar, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { text } from "stream/consumers";

interface ExpenseItem {
  name: string;
  dueDate: string;
  amount: number;
}

interface ReceivableItem {
  name: string;
  dueDate: string;
  amount: number;
  isOverdue: boolean;
}

interface ActionSummaryCardsProps {
  expenses: ExpenseItem[];
  receivables: ReceivableItem[];
  currency: string;
}

export function ActionSummaryCards({
  expenses,
  receivables,
  currency,
}: ActionSummaryCardsProps) {
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [showAllReceivables, setShowAllReceivables] = useState(false);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalReceivables = receivables.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* To Pay Card */}
        <div className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-elevated transition-premium">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">To Pay</h3>
            <button
              onClick={() => setShowAllExpenses(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-premium"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-foreground">
              {currency}
              {totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="space-y-3">
            {expenses.slice(0, 3).map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-accent transition-premium cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{expense.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {expense.dueDate}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-foreground">
                  {currency}
                  {expense.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* To Receive Card */}
        <div className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-elevated transition-premium">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              To Receive
            </h3>
            <button
              onClick={() => setShowAllReceivables(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-premium"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-foreground">
              {currency}
              {totalReceivables.toLocaleString()}
            </p>
          </div>

          <div className="space-y-3">
            {receivables.slice(0, 3).map((receivable, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border transition-premium cursor-pointer ${
                  receivable.isOverdue
                    ? "bg-destructive/10 border-destructive/30 hover:bg-destructive/15"
                    : "bg-muted border-border hover:bg-accent"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">
                      {receivable.name}
                    </p>
                    {receivable.isOverdue && (
                      <span className="px-2 py-1 bg-destructive text-white text-xs font-bold rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar
                      className={`w-3 h-3 ${receivable.isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                    />
                    <p
                      className={`text-xs font-semibold ${receivable.isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {receivable.dueDate}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${receivable.isOverdue ? "text-destructive" : "text-foreground"}`}
                >
                  {currency}
                  {receivable.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for all receivables */}
      {showAllExpenses && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                All Payables
              </h2>
              <button
                onClick={() => setShowAllExpenses(false)}
                className="text-muted-foreground hover:text-foreground transition-premium"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-foreground">
                  {currency}
                  {totalExpenses.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                {expenses.map((expense, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border transition-premium bg-muted border-border hover:bg-accent"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {expense.name}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {expense.dueDate}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-foreground text-right">
                      {currency}
                      {expense.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for all receivables */}
      {showAllReceivables && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                All Receivables
              </h2>
              <button
                onClick={() => setShowAllReceivables(false)}
                className="text-muted-foreground hover:text-foreground transition-premium"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-foreground">
                  {currency}
                  {totalReceivables.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                {receivables.map((receivable, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-premium ${
                      receivable.isOverdue
                        ? "bg-destructive/5 border-destructive/20"
                        : "bg-muted border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {receivable.name}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p
                          className={`text-sm ${receivable.isOverdue ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                        >
                          {receivable.dueDate}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-foreground text-right">
                      {currency}
                      {receivable.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
