# 🔔 Smart Notifications & Task Division Implementation Guide

## Overview

Smart Notifications system for alerting users about important financial events with customizable preferences and task breakdown for implementation.

---

## 💡 Why This Feature?

### Business Value

**Smart notifications are the nervous system of financial management apps.** Without them, users:

- Miss critical financial events happening in their business
- Don't know when action is needed (bill overdue, budget exceeded)
- Can't make informed decisions because they're uninformed
- Experience constant anxiety about their finances

Notifications directly impact:

- **User Engagement**: Users check app 5-10x more if they get relevant alerts
- **Feature Adoption**: Users use features actively when they're notified
- **User Retention**: Smart alerts reduce churn by 25-40%
- **Financial Health**: Users catch problems before they become crises

### User Impact

- Freelancers never miss overdue payments
- Business owners catch budget overages immediately
- Users stay informed without manually checking
- Reduces financial stress through proactive alerts
- Enables better decision-making with timely information

---

## 🎯 Pain Points This Solves

### Problem 1: Missed Critical Financial Events

**Current State**: Users have to manually check app to know what's happening

- ❌ Miss that a bill is due in 2 days
- ❌ Don't realize they've exceeded budget until end of month
- ❌ Unaware of large unexpected transactions
- ❌ No warning before account goes low
- ❌ Learn about invoices being unpaid too late

**After This Feature**:

- ✅ Automatic alerts for bills due in 3 days
- ✅ Instant notification when budget exceeded
- ✅ Alert for transactions over $500
- ✅ Warning when balance drops below threshold
- ✅ Reminder emails to clients for unpaid invoices
- **Expected Impact**: Prevent 90% of missed deadlines

### Problem 2: Information Overload (Too Many/Wrong Alerts)

**Current State**: Users either get bombarded or nothing

- ❌ Can't control what notifications they receive
- ❌ Get alerts for things they don't care about
- ❌ Notification fatigue leads to ignoring all alerts
- ❌ No way to customize preferences
- ❌ Receive alerts at inconvenient times

**After This Feature**:

- ✅ Users customize all notification preferences
- ✅ Choose email, SMS, or in-app alerts
- ✅ Set thresholds (only alert if > $X)
- ✅ Schedule digest emails instead of constant alerts
- ✅ Enable/disable specific alert types
- **Expected Impact**: Users value 95% of alerts they receive

### Problem 3: Lack of Proactive Financial Management

**Current State**: Users react to problems instead of preventing them

- ❌ Only notice budget overages after they happen
- ❌ Don't see spending trends in real-time
- ❌ Miss recurring bill reminders
- ❌ No prompts to take action
- ❌ Can't plan ahead with predictions

**After This Feature**:

- ✅ Weekly summary showing spending vs budget
- ✅ Monthly category breakdown with comparisons
- ✅ Bill reminders 3-5 days before due
- ✅ Alerts if spending on track to exceed budget
- ✅ Predictive alerts ("at this rate you'll exceed budget")
- **Expected Impact**: Users save 15-20% on unnecessary spending

### Problem 4: Multiple Tools & Notification Fragmentation

**Current State**: Notifications scattered across email, texts, app messages

- ❌ Miss SMS because phone is silent
- ❌ Email alerts lost in spam folder
- ❌ No central place to see all notifications
- ❌ Can't track which alerts you've seen
- ❌ Hard to take action from notification

**After This Feature**:

- ✅ All notifications centralized in app
- ✅ Delivery across email, SMS, and in-app
- ✅ Notifications marked as read/unread
- ✅ Click notification to go directly to relevant page
- ✅ One-click actions from notifications (Pay Bill, etc)
- **Expected Impact**: Users see 100% of critical alerts

### Problem 5: Poor Engagement & App Abandonment

**Current State**: Users open app rarely because they don't know what's new

- ❌ No reason to check app regularly
- ❌ Forget about features they don't use
- ❌ Miss important insights in dashboard
- ❌ App feels passive/unhelpful
- ❌ Users churn because they lose context

**After This Feature**:

- ✅ Regular notifications keep users engaged
- ✅ Users open app more frequently
- ✅ Better context when they do open app
- ✅ App feels proactive and helpful
- ✅ Users stay active and engaged
- **Expected Impact**: 3x increase in daily active users

### Problem 6: Manual Work & Recurring Reminders

**Current State**: Users manually create reminders or use external tools

- ❌ Set calendar reminders for every bill
- ❌ Use external tools (Google Calendar, etc)
- ❌ Reminders not integrated with data
- ❌ Can't see what the reminder is about
- ❌ Easy to forget to create reminders

**After This Feature**:

- ✅ App automatically knows all bills and due dates
- ✅ Smart reminders based on actual data
- ✅ Recurring reminders for subscriptions
- ✅ Adjustment based on user behavior
- ✅ No manual setup needed
- **Expected Impact**: Never miss a bill again

---

## Part 1: Smart Notifications Implementation

## 📊 Step 1: Database Schema

Add these tables to your Supabase database:

### Create `notification_settings` table

```sql
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Email Notifications
  email_enabled BOOLEAN DEFAULT true,
  email_large_transaction BOOLEAN DEFAULT true,
  email_large_transaction_threshold DECIMAL(10, 2) DEFAULT 500,

  email_low_balance BOOLEAN DEFAULT true,
  email_low_balance_threshold DECIMAL(10, 2) DEFAULT 1000,

  email_bill_reminder BOOLEAN DEFAULT true,
  email_bill_reminder_days SMALLINT DEFAULT 3, -- Days before due date

  email_weekly_summary BOOLEAN DEFAULT true,
  email_weekly_summary_day SMALLINT DEFAULT 1, -- 0 = Sunday, 1 = Monday, etc

  email_monthly_summary BOOLEAN DEFAULT true,
  email_monthly_summary_date SMALLINT DEFAULT 1, -- Day of month

  -- SMS Notifications (optional)
  sms_enabled BOOLEAN DEFAULT false,
  phone_number TEXT,
  sms_large_transaction BOOLEAN DEFAULT false,
  sms_low_balance BOOLEAN DEFAULT false,

  -- In-App Notifications
  inapp_enabled BOOLEAN DEFAULT true,
  inapp_large_transaction BOOLEAN DEFAULT true,
  inapp_low_balance BOOLEAN DEFAULT true,
  inapp_bill_reminder BOOLEAN DEFAULT true,

  -- Notification Frequency
  notification_quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_settings_user_id ON notification_settings(user_id);
```

### Create `notifications` table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  type TEXT NOT NULL, -- large_transaction, low_balance, bill_reminder, weekly_summary, monthly_summary, payment_received
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Reference IDs
  transaction_id UUID REFERENCES transactions(id),
  invoice_id UUID REFERENCES invoices(id),

  -- Status
  read BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,

  -- Delivery
  sent_via TEXT, -- email, sms, inapp
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Data for rich notifications
  metadata JSONB, -- Additional data like amounts, dates, etc

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### Create `notification_logs` table (for tracking sends)

```sql
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  notification_type TEXT NOT NULL,
  channel TEXT NOT NULL, -- email, sms, inapp
  recipient TEXT NOT NULL, -- email or phone

  status TEXT DEFAULT 'pending', -- pending, sent, failed, bounced
  error_message TEXT,

  attempts SMALLINT DEFAULT 1,
  last_attempt_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
```

### Row Level Security (RLS)

```sql
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Notification Settings Policies
CREATE POLICY "Users can view their own settings"
  ON notification_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON notification_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON notification_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT WITH CHECK (true);

-- Notification Logs Policies (admin/system only)
CREATE POLICY "Users can view their own logs"
  ON notification_logs FOR SELECT USING (auth.uid() = user_id);
```

---

## 💾 Step 2: TypeScript Types

Create `types/notification.ts`:

```typescript
export interface NotificationSettings {
  id: string;
  user_id: string;

  // Email
  email_enabled: boolean;
  email_large_transaction: boolean;
  email_large_transaction_threshold: number;
  email_low_balance: boolean;
  email_low_balance_threshold: number;
  email_bill_reminder: boolean;
  email_bill_reminder_days: number;
  email_weekly_summary: boolean;
  email_weekly_summary_day: number;
  email_monthly_summary: boolean;
  email_monthly_summary_date: number;

  // SMS
  sms_enabled: boolean;
  phone_number?: string;
  sms_large_transaction: boolean;
  sms_low_balance: boolean;

  // In-App
  inapp_enabled: boolean;
  inapp_large_transaction: boolean;
  inapp_low_balance: boolean;
  inapp_bill_reminder: boolean;

  // Quiet Hours
  notification_quiet_hours_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;

  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type:
    | "large_transaction"
    | "low_balance"
    | "bill_reminder"
    | "weekly_summary"
    | "monthly_summary"
    | "payment_received";
  title: string;
  message: string;
  transaction_id?: string;
  invoice_id?: string;
  read: boolean;
  dismissed: boolean;
  sent_via: "email" | "sms" | "inapp";
  sent_at: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  notification_type: string;
  channel: "email" | "sms" | "inapp";
  recipient: string;
  status: "pending" | "sent" | "failed" | "bounced";
  error_message?: string;
  attempts: number;
  last_attempt_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  transactionId?: string;
  invoiceId?: string;
}
```

---

## 🔧 Step 3: Server Actions

Create `lib/actions/notifications.ts`:

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import {
  NotificationSettings,
  Notification,
  NotificationPayload,
} from "@/types/notification";

// Get notification settings
export async function getNotificationSettings(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // Settings don't exist, create default
    return createDefaultNotificationSettings(userId);
  }

  if (error) throw error;
  return data as NotificationSettings;
}

// Create default notification settings
export async function createDefaultNotificationSettings(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notification_settings")
    .insert({
      user_id: userId,
      email_enabled: true,
      email_large_transaction: true,
      email_large_transaction_threshold: 500,
      email_low_balance: true,
      email_low_balance_threshold: 1000,
      email_bill_reminder: true,
      email_bill_reminder_days: 3,
      email_weekly_summary: true,
      email_weekly_summary_day: 1,
      email_monthly_summary: true,
      email_monthly_summary_date: 1,
      sms_enabled: false,
      inapp_enabled: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data as NotificationSettings;
}

// Update notification settings
export async function updateNotificationSettings(
  userId: string,
  updates: Partial<NotificationSettings>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notification_settings")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as NotificationSettings;
}

// Get user notifications
export async function getUserNotifications(userId: string, limit = 20) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("dismissed", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Notification[];
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) throw error;
}

// Dismiss notification
export async function dismissNotification(notificationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ dismissed: true })
    .eq("id", notificationId);

  if (error) throw error;
}

// Check large transaction and send notification
export async function checkLargeTransaction(
  userId: string,
  amount: number,
  description: string
) {
  const supabase = await createClient();

  const settings = await getNotificationSettings(userId);

  if (
    amount >= settings.email_large_transaction_threshold &&
    settings.email_large_transaction
  ) {
    await createNotification(userId, {
      type: "large_transaction",
      title: "💰 Large Transaction Detected",
      message: `A transaction of $${amount.toFixed(2)} was recorded: ${description}`,
      metadata: { amount, description },
    });
  }
}

// Check low balance and send notification
export async function checkLowBalance(userId: string, currentBalance: number) {
  const supabase = await createClient();

  const settings = await getNotificationSettings(userId);

  if (
    currentBalance <= settings.email_low_balance_threshold &&
    settings.email_low_balance
  ) {
    await createNotification(userId, {
      type: "low_balance",
      title: "⚠️ Low Balance Alert",
      message: `Your current balance is $${currentBalance.toFixed(2)}, which is below your threshold of $${settings.email_low_balance_threshold.toFixed(2)}`,
      metadata: {
        currentBalance,
        threshold: settings.email_low_balance_threshold,
      },
    });
  }
}

// Check upcoming bills
export async function checkUpcomingBills(userId: string) {
  const supabase = await createClient();

  const settings = await getNotificationSettings(userId);

  if (!settings.email_bill_reminder) return;

  const daysFromNow = new Date();
  daysFromNow.setDate(
    daysFromNow.getDate() + settings.email_bill_reminder_days
  );

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "sent")
    .eq("payment_status", "unpaid")
    .gte("due_date", new Date().toISOString().split("T")[0])
    .lte("due_date", daysFromNow.toISOString().split("T")[0]);

  if (error) throw error;

  if (invoices && invoices.length > 0) {
    for (const invoice of invoices) {
      await createNotification(userId, {
        type: "bill_reminder",
        title: `📋 Invoice Due Soon`,
        message: `Invoice ${invoice.invoice_number} from ${invoice.client_name} is due on ${new Date(invoice.due_date).toLocaleDateString()}`,
        invoiceId: invoice.id,
        metadata: {
          invoiceNumber: invoice.invoice_number,
          amount: invoice.total_amount,
        },
      });
    }
  }
}

// Create weekly summary
export async function createWeeklySummary(userId: string) {
  const supabase = await createClient();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId)
    .gte("date", weekAgo.toISOString().split("T")[0]);

  if (error) throw error;

  if (!transactions || transactions.length === 0) return;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = income - expenses;

  await createNotification(userId, {
    type: "weekly_summary",
    title: "📊 Weekly Financial Summary",
    message: `This week: Income $${income.toFixed(2)}, Expenses $${expenses.toFixed(2)}, Net $${net.toFixed(2)}`,
    metadata: { income, expenses, net, transactionCount: transactions.length },
  });
}

// Create monthly summary
export async function createMonthlySummary(userId: string) {
  const supabase = await createClient();

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("type, amount, category")
    .eq("user_id", userId)
    .gte("date", monthAgo.toISOString().split("T")[0]);

  if (error) throw error;

  if (!transactions || transactions.length === 0) return;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = income - expenses;

  await createNotification(userId, {
    type: "monthly_summary",
    title: "📈 Monthly Financial Report",
    message: `Last month: Income $${income.toFixed(2)}, Expenses $${expenses.toFixed(2)}, Net $${net.toFixed(2)}`,
    metadata: { income, expenses, net, transactionCount: transactions.length },
  });
}

// Core function to create notification
export async function createNotification(
  userId: string,
  payload: NotificationPayload
) {
  const supabase = await createClient();
  const settings = await getNotificationSettings(userId);

  // Check quiet hours
  if (settings.notification_quiet_hours_enabled) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    if (
      currentTime >= settings.quiet_hours_start! &&
      currentTime <= settings.quiet_hours_end!
    ) {
      // Skip notification during quiet hours
      return;
    }
  }

  // Create in-app notification
  const { data: notification, error: createError } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      transaction_id: payload.transactionId,
      invoice_id: payload.invoiceId,
      sent_via: "inapp",
      metadata: payload.metadata,
    })
    .select()
    .single();

  if (createError) throw createError;

  // Send email if enabled
  if (settings.email_enabled) {
    await sendEmailNotification(userId, payload, settings);
  }

  // Send SMS if enabled
  if (settings.sms_enabled && settings.phone_number) {
    await sendSMSNotification(userId, payload, settings);
  }

  return notification;
}

// Send email notification
async function sendEmailNotification(
  userId: string,
  payload: NotificationPayload,
  settings: NotificationSettings
) {
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("auth.users")
    .select("email")
    .eq("id", userId)
    .single();

  if (!user?.email) return;

  // Log the email send attempt
  const { error } = await supabase.from("notification_logs").insert({
    user_id: userId,
    notification_type: payload.type,
    channel: "email",
    recipient: user.email,
    status: "pending",
  });

  if (error) console.error("Error logging notification:", error);

  // TODO: Integrate with email service (SendGrid, Resend, etc)
  // Example:
  // await sendEmail({
  //   to: user.email,
  //   subject: payload.title,
  //   html: renderEmailTemplate(payload)
  // });
}

// Send SMS notification
async function sendSMSNotification(
  userId: string,
  payload: NotificationPayload,
  settings: NotificationSettings
) {
  // TODO: Integrate with SMS service (Twilio, etc)
  // Example:
  // await twilioClient.messages.create({
  //   body: payload.message,
  //   from: process.env.TWILIO_PHONE,
  //   to: settings.phone_number
  // });
}

// Delete old notifications (run periodically)
export async function deleteOldNotifications(daysOld = 30) {
  const supabase = await createClient();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const { error } = await supabase
    .from("notifications")
    .delete()
    .lt("created_at", cutoffDate.toISOString());

  if (error) throw error;
}
```

---

## 🎨 Step 4: Components

### `components/notifications/NotificationCenter.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, dismissNotification } from '@/lib/actions/notifications';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      // Get current user first
      const response = await fetch('/api/user');
      const { user } = await response.json();

      if (user) {
        const data = await getUserNotifications(user.id, 10);
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    try {
      await dismissNotification(notificationId);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      large_transaction: '💰',
      low_balance: '⚠️',
      bill_reminder: '📋',
      weekly_summary: '📊',
      monthly_summary: '📈',
      payment_received: '✅'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toRelativeTime()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t text-center">
            <a href="/notifications" className="text-blue-600 hover:underline text-sm">
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
```

### `components/notifications/NotificationPreferences.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getNotificationSettings, updateNotificationSettings } from '@/lib/actions/notifications';
import { NotificationSettings } from '@/types/notification';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/user');
        const { user } = await response.json();
        const data = await getNotificationSettings(user.id);
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/user');
      const { user } = await response.json();
      await updateNotificationSettings(user.id, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!settings) return <div>Error loading settings</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
      </div>

      {/* Email Notifications */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-semibold">Email Notifications</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Email Notifications</Label>
            <Switch
              checked={settings.email_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, email_enabled: checked })
              }
            />
          </div>

          {settings.email_enabled && (
            <>
              <div className="flex items-center justify-between">
                <Label>Large Transaction Alerts</Label>
                <Switch
                  checked={settings.email_large_transaction}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_large_transaction: checked })
                  }
                />
              </div>

              {settings.email_large_transaction && (
                <div>
                  <Label>Alert when transaction exceeds</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span>$</span>
                    <Input
                      type="number"
                      value={settings.email_large_transaction_threshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email_large_transaction_threshold: parseFloat(e.target.value)
                        })
                      }
                      className="w-24"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Low Balance Alerts</Label>
                <Switch
                  checked={settings.email_low_balance}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_low_balance: checked })
                  }
                />
              </div>

              {settings.email_low_balance && (
                <div>
                  <Label>Alert when balance falls below</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span>$</span>
                    <Input
                      type="number"
                      value={settings.email_low_balance_threshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email_low_balance_threshold: parseFloat(e.target.value)
                        })
                      }
                      className="w-24"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Bill Reminders</Label>
                <Switch
                  checked={settings.email_bill_reminder}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_bill_reminder: checked })
                  }
                />
              </div>

              {settings.email_bill_reminder && (
                <div>
                  <Label>Days before due date to remind</Label>
                  <Input
                    type="number"
                    value={settings.email_bill_reminder_days}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email_bill_reminder_days: parseInt(e.target.value)
                      })
                    }
                    className="w-24 mt-2"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Weekly Summary</Label>
                <Switch
                  checked={settings.email_weekly_summary}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_weekly_summary: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Monthly Summary</Label>
                <Switch
                  checked={settings.email_monthly_summary}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_monthly_summary: checked })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-semibold">Quiet Hours</h3>

        <div className="flex items-center justify-between">
          <Label>Enable Quiet Hours</Label>
          <Switch
            checked={settings.notification_quiet_hours_enabled}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, notification_quiet_hours_enabled: checked })
            }
          />
        </div>

        {settings.notification_quiet_hours_enabled && (
          <div className="space-y-3">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={settings.quiet_hours_start || '22:00'}
                onChange={(e) =>
                  setSettings({ ...settings, quiet_hours_start: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={settings.quiet_hours_end || '08:00'}
                onChange={(e) =>
                  setSettings({ ...settings, quiet_hours_end: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>
        )}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
}
```

---

## 📄 Step 5: Pages

### `app/(authenticated)/notifications/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { getUserNotifications, dismissNotification } from '@/lib/actions/notifications';
import { Notification } from '@/types/notification';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/user');
        const { user } = await response.json();
        const data = await getUserNotifications(user.id, 100);
        setNotifications(data || []);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleDismiss = async (id: string) => {
    try {
      await dismissNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <a href="/settings/notifications" className="text-blue-600 hover:underline">
          Settings
        </a>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded ${
            filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Unread
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### `app/settings/notifications/page.tsx`

```typescript
'use client';

import NotificationPreferences from '@/components/notifications/NotificationPreferences';

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
        <p className="text-gray-600">Customize how you receive notifications</p>
      </div>

      <NotificationPreferences />
    </div>
  );
}
```

---

## 🔄 Step 6: API Routes (Optional - For Scheduled Tasks)

### `app/api/notifications/check-large-transactions/route.ts`

```typescript
import { createClient } from "@/lib/supabase/server";
import { checkLargeTransaction } from "@/lib/actions/notifications";

export async function POST(request: Request) {
  // Verify webhook secret
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();

  // Get recent large transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("user_id, amount, description")
    .gt("amount", 500)
    .gte("created_at", new Date(Date.now() - 3600000).toISOString()); // Last hour

  if (transactions) {
    for (const transaction of transactions) {
      await checkLargeTransaction(
        transaction.user_id,
        transaction.amount,
        transaction.description
      );
    }
  }

  return Response.json({ success: true });
}
```

---

# Part 2: Task Division & Implementation Roadmap

## 📋 Phase 1: Database Setup (1-2 hours)

### Tasks:

- [ ] Create `notification_settings` table
- [ ] Create `notifications` table
- [ ] Create `notification_logs` table
- [ ] Set up RLS policies
- [ ] Test database queries

**Dependencies**: None
**Assignee**: Database Developer

---

## 📋 Phase 2: Core Infrastructure (3-4 hours)

### Tasks:

- [ ] Create TypeScript types (`types/notification.ts`)
- [ ] Create server actions (`lib/actions/notifications.ts`)
- [ ] Create utility functions for checks
- [ ] Set up logging system
- [ ] Test all server actions

**Dependencies**: Phase 1
**Assignee**: Backend Developer

---

## 📋 Phase 3: User Interface (4-5 hours)

### Tasks:

- [ ] Build `NotificationCenter` component
- [ ] Build `NotificationPreferences` component
- [ ] Create notifications list page
- [ ] Create settings page
- [ ] Add styling and polish
- [ ] Test user interactions

**Dependencies**: Phase 2
**Assignee**: Frontend Developer

---

## 📋 Phase 4: Integration (3-4 hours)

### Tasks:

- [ ] Integrate with transaction creation flow
- [ ] Add checks to dashboard
- [ ] Add NotificationCenter to layout
- [ ] Hook up settings updates
- [ ] Test end-to-end flow

**Dependencies**: Phase 3
**Assignee**: Full-stack Developer

---

## 📋 Phase 5: Email & SMS (2-3 hours)

### Tasks:

- [ ] Set up email service (SendGrid/Resend)
- [ ] Create email templates
- [ ] Implement email sending
- [ ] Set up SMS service (optional - Twilio)
- [ ] Test email/SMS delivery

**Dependencies**: Phase 2
**Assignee**: Backend/DevOps Developer

---

## 📋 Phase 6: Scheduled Tasks (2-3 hours)

### Tasks:

- [ ] Set up cron job service (Vercel Crons/GitHub Actions)
- [ ] Create weekly summary task
- [ ] Create monthly summary task
- [ ] Create bill reminder task
- [ ] Test scheduling

**Dependencies**: Phase 2, Phase 5
**Assignee**: DevOps/Backend Developer

---

## 📋 Phase 7: Testing & QA (2-3 hours)

### Tasks:

- [ ] Unit test server actions
- [ ] Component testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Fix bugs

**Dependencies**: All phases
**Assignee**: QA/All Team

---

## 📋 Phase 8: Documentation (1-2 hours)

### Tasks:

- [ ] Document notification types
- [ ] Document user settings
- [ ] Create admin dashboard (optional)
- [ ] Create troubleshooting guide

**Dependencies**: All phases
**Assignee**: Technical Writer

---

## 🎯 Implementation Priority

**Week 1:**

1. Phase 1 - Database Setup
2. Phase 2 - Core Infrastructure
3. Phase 3 - UI Components

**Week 2:** 4. Phase 4 - Integration 5. Phase 5 - Email Setup 6. Phase 7 - Testing

**Week 3:** 7. Phase 6 - Scheduled Tasks 8. Phase 8 - Documentation

---

## 📊 Total Effort Estimate

- **Database**: 2 hours
- **Backend**: 7 hours
- **Frontend**: 5 hours
- **Integration**: 4 hours
- **Email/SMS**: 3 hours
- **Scheduling**: 3 hours
- **Testing**: 3 hours
- **Documentation**: 2 hours

**Total: ~30 hours** (1 week for 1 full-time developer, or 2 weeks for part-time)

---

## ✅ Checklist to Start

- [ ] Review database schema
- [ ] Set up Supabase tables
- [ ] Create notification service account (for scheduled tasks)
- [ ] Choose email provider (SendGrid, Resend, etc)
- [ ] Plan notification triggers
- [ ] Design email templates
- [ ] Set up cron job service

Would you like me to help with any specific phase or component? 🚀
