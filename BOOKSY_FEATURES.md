# Booksy — Main Functions & Why It’s Different

Booksy is an AI-powered bookkeeping and financial tracking app for small businesses and freelancers. It combines **double-entry ledger**, **simple transaction tracking**, **invoicing**, **document OCR**, and **AI analysis** in one place.

---

## Main Functions

### 1. **Dashboard**
- **At a glance:** Total income, expenses, profit, and cash balance for your chosen period.
- **Income vs expense charts:** Visual comparison (e.g. bar or line) so you see trends quickly.
- **Expense breakdown:** By category (pie chart and list) so you know where money goes.
- **Recent transactions:** Latest activity without leaving the dashboard.

### 2. **Transactions**
- **Add / Edit / Void:** Create transactions (category, amount, date, payment method, notes); edit existing ones; void with a clear audit trail.
- **Categories:** Each transaction is tied to an income or expense category (e.g. Sales, Rent, Marketing).
- **Filters:** By category, date range, and payment method.
- **Clean list:** Date, category, description, payment method, amount with income/expense coloring (e.g. green/red).

### 3. **Ledger (Double-Entry)**
- **Proper bookkeeping:** Journal entries with **Debit** and **Credit** columns; one row per line, grouped by transaction.
- **Total cash balance:** Sum of Cash account movements (debits − credits), shown at the top.
- **Income vs expense in the ledger:**  
  - **Green:** Cash debits (money in), revenue credits (income).  
  - **Red:** Cash credits (money out), expense debits (expenses).  
  Other accounts stay neutral so the ledger stays readable.
- **Void:** Mark entries as void so the books stay consistent.

### 4. **Invoices**
- **Create & manage:** Build invoices with line items, amounts, and due dates.
- **Invoice items:** Reusable items (products/services) so you don’t retype everything.
- **Edit & view:** Update drafts and view sent/paid status.
- **Payments:** Record payments against invoices to track receivables.

### 5. **Business Health**
- **Health snapshot:** Safe cash, runway, and high-level risk indicators.
- **Action summary:** Short list of “what to do next” (e.g. follow up on receivables, cut spending).
- **Planned spending:** Add upcoming purchases (e.g. equipment) and see if current cash can cover them.
- **Alerts:** Warnings for low balance, overdue invoices, or other issues (e.g. via smart notifications).

### 6. **Upload Documents (OCR)**
- **Receipts & invoices:** Upload images or PDFs; the app uses **AI vision (OCR)** to extract:
  - Amount, date, vendor, line items, tax.
- **Auto-save:** Option to turn extracted data into transactions or invoice drafts so you don’t re-enter by hand.
- **Types:** Tag uploads as receipt vs invoice and (for receipts) expense vs income.

### 7. **Currency Converter**
- **Multi-currency:** Support for multiple currencies and conversion using exchange rates.
- **Converter UI:** Convert between currencies for planning or reporting.
- **Charts / summary:** Optional views of currency exposure or conversion history (if implemented in your build).

### 8. **AI Financial Assistant**
- **Structured analysis:** AI analyzes your transactions and returns:
  1. **Executive summary**
  2. **Revenue analysis** (trends, patterns, anomalies)
  3. **Expense breakdown** (fixed vs variable, top categories, spikes)
  4. **Profitability** (margins, comparisons)
  5. **Cash flow** (inflow/outflow, burn rate, liquidity)
  6. **Risks & warnings**
  7. **Recommendations** (concrete next steps with impact)
- **Date range:** Choose “this month”, “last 3/6 months”, “this year”, or a custom range.
- **PDF export:** Download the AI report as a PDF for sharing or filing.
- **History:** Past analyses are saved so you can compare over time.

### 9. **Categories**
- **Income & expense categories:** Create and edit categories (e.g. Sales, COGS, Rent, Utilities).
- **Default set:** New businesses can get a sensible default list (e.g. Sales, COGS, Rent, Marketing).
- **Used everywhere:** Categories drive dashboard breakdowns, transaction list, and AI analysis.

### 10. **Profile & Setup**
- **Business profile:** Name, type, base currency, fiscal year.
- **Avatar:** Optional business logo/avatar.
- **Auth:** Sign up, login, forgot/reset password; session handling.

### 11. **Smart Notifications (Email Alerts)**
- **Email alerts:** Smart notifications send **email** to the business owner for:
  - **Low balance** – cash below a safe threshold.
  - **Invoice due soon** – invoices due within a few days (e.g. 3 days).
  - **Invoice overdue** – unpaid invoices past due date.
- **Cron-driven:** A scheduled job runs checks and sends emails (e.g. via Resend) so you’re alerted without opening the app.
- **Webhook option:** Alerts can also be sent to external systems (e.g. n8n) for Slack, Telegram, or other channels.
- **Deduplication:** At most one alert per type per day so you’re not spammed.

### 12. **Invoice Paid → Auto-Create Transaction**
- When you **mark an invoice as paid** (with payment method), Booksy **automatically creates an income transaction** in your books.
- No double entry: the invoice is updated to “paid” and the transaction appears in Transactions, Dashboard, and Ledger so your P&amp;L and cash balance stay correct.

### 13. **Business Health (After Slips or Manual Entry)**
- **Business Health** uses your **actual data**: transactions from uploaded slips (OCR auto-save), manually entered transactions, and invoice payments.
- After you **send slips** (upload receipts/invoices) or **manually write transactions**, the health view updates: safe cash, runway, planned spending, and alerts reflect the latest numbers.
- One place to see “can I afford this?” without switching tools.

### 14. **Telegram Integration (Slips & Transactions)**
- **After sending slips:** Once you upload receipts or invoices (OCR), you can get a summary or confirmation in **Telegram** (e.g. “Receipt saved, $X added to Expenses”).
- **After manually writing transactions:** When you add or edit transactions in Booksy, updates can be pushed to **Telegram** so you have a quick log or backup in chat.
- Keeps your bookkeeping visible where you already are (Telegram) without opening the app for every check.

---

## Pain Points (What Users Struggle With)

| Pain point | Who it affects |
|------------|----------------|
| **Too many tools** – transactions here, invoices there, reports somewhere else | Small business owners, freelancers |
| **Manual data entry** – retyping receipts and invoices into spreadsheets or software | Anyone with lots of paperwork |
| **No early warning** – finding out about low cash or overdue invoices too late | Cash-strapped or busy owners |
| **Invoice paid but books not updated** – marking paid in one place, forgetting to log income | Anyone who invoices |
| **Health of the business unclear** – hard to know “can I spend this?” or “what’s my runway?” | Solo and small teams |
| **Need an accountant to understand the books** – double-entry and reports feel opaque | Non-accountants |
| **Updates only when I open the app** – no email or Telegram when something important happens | On-the-go users |
| **Slips and transactions live in different places** – uploads in one app, manual entries in another | People who mix OCR and manual entry |

---

## Solutions (Booksy)

| Pain point | Booksy solution |
|------------|------------------|
| Too many tools | **One app:** Dashboard, Transactions, Ledger, Invoices, OCR upload, Business Health, AI Assistant, Currency, Categories. One login, one data set. |
| Manual data entry | **OCR upload + auto-save:** Upload receipt or invoice; AI extracts data; save as transaction or draft. No retyping. |
| No early warning | **Smart notifications (email):** Low balance, invoice due soon, invoice overdue. Cron sends emails so you’re alerted even when you don’t open the app. |
| Invoice paid but books not updated | **Invoice paid → auto-create transaction:** Mark invoice as paid; Booksy creates the income transaction so your P&amp;L and cash stay correct. |
| Health of the business unclear | **Business Health:** Safe cash, runway, planned spending vs cash, and alerts. Uses data from slips and manual transactions so it’s always current. |
| Need an accountant to understand | **Simple UI + real ledger:** Income/expense colors, clear categories, and optional double-entry Ledger. “No accounting degree required.” |
| Updates only when I open the app | **Email alerts + Telegram:** Smart notifications send email; Telegram (optional) can receive slip/transaction updates so you see what’s happening without opening Booksy. |
| Slips and manual entries in different places | **Slips and manual in one place:** Upload slips (OCR) and/or add transactions manually; both feed the same Dashboard, Ledger, and Business Health. Optional Telegram summary for both. |

---

## User Stories

**As a small business owner, I want to…**

- …**get an email when my balance is low** so I can act before I run out of cash.  
  → *Booksy: Smart notification (low balance) sends email.*

- …**mark an invoice as paid and have it show up in my books** so I don’t forget to record income.  
  → *Booksy: Invoice paid auto-creates an income transaction.*

- …**see if I can afford a big purchase** without digging through spreadsheets.  
  → *Booksy: Business Health shows safe cash, runway, and planned spending after my latest slips and transactions.*

- …**upload a receipt and have it become a transaction** so I stop retyping.  
  → *Booksy: OCR upload + auto-save creates a transaction from the slip.*

- …**get a reminder by email when an invoice is due soon** so I can follow up with the client.  
  → *Booksy: Smart notification (invoice due soon) sends email.*

- …**see my slips and manual entries in one place** and get a quick summary in Telegram.  
  → *Booksy: All data in one app; optional Telegram updates after slips or manual transactions.*

- …**understand my finances without hiring an accountant** so I can make decisions myself.  
  → *Booksy: Dashboard, Business Health, and AI Assistant give clear summaries and recommendations.*

- …**know when a client hasn’t paid** so I can chase overdue invoices.  
  → *Booksy: Smart notification (invoice overdue) sends email; Business Health can surface overdue receivables.*

---

## Why Booksy Is Different and Better

| Aspect | Many bookkeeping apps | Booksy |
|--------|------------------------|--------|
| **AI built in** | Separate tools or manual reports | **AI Financial Assistant** in the same app: pick a date range, get structured analysis + risks + recommendations, and export PDF. No switching tools. |
| **Ledger + simplicity** | Either simple “income/expense” only, or full double-entry for accountants | **Both:** simple **Transactions** for quick logging and a real **Ledger** (debits/credits, cash balance, void). One app for daily use and proper books. |
| **Document handling** | Manual data entry from receipts/invoices | **OCR upload:** drop receipt or invoice, AI extracts amounts and details; **auto-save** can create transactions or drafts. Less typing, fewer errors. |
| **Business health** | Often just a P&amp;L or balance | **Dedicated Business Health:** safe cash, runway, planned spending vs cash, and **alerts** so you see problems early. |
| **All-in-one** | Transactions in one app, invoices in another, AI elsewhere | **Single place:** Dashboard, Transactions, Ledger, Invoices, OCR upload, Currency, AI Assistant, Health. One login, one data set. |
| **Usability** | Built for accountants or cluttered UIs | **Clear UI:** “No accounting degree required.” Income/expense colors, grouped ledger, simple filters. Designed for small business owners and freelancers. |
| **Multi-currency** | Sometimes extra cost or limited | **Built-in** base currency and conversion; transactions and reporting in your chosen currency. |
| **Audit trail** | Hard to see “what changed” | **Void** and double-entry ledger keep a clear trail: you see what was posted and what was voided. |
| **Export & share** | Export often limited to CSV | **AI report as PDF** so you can send a concise, professional summary to partners or advisors. |

---

## Summary

- **Main functions:** Dashboard, Transactions (add/edit/void), double-entry Ledger with cash balance and income/expense coloring, Invoices and items, **Invoice paid → auto-create transaction**, Business Health (after slips or manual transactions) with alerts and planned spending, OCR document upload with auto-save, Currency converter, AI Financial Assistant with PDF export and history, Categories, Profile/Setup, **Smart notifications (email alerts)**, and **Telegram integration** (slips & transactions).
- **Differentiators:** AI analysis in-app, ledger + simple transactions in one product, OCR for receipts/invoices, **email alerts** for low balance and invoices, **invoice paid auto-transaction**, business health driven by slips and manual entry, **Telegram** for slip/transaction updates, single app for daily bookkeeping and reporting, user-friendly design, multi-currency, and PDF export of AI reports.

Booksy is built so you can **track your money and stay in control** without needing an accountant for day-to-day use, while still keeping **proper double-entry books** and **AI-powered insights** in the same tool. **Pain points** (too many tools, manual entry, no early warning, invoice paid not in books, unclear health) are addressed by **Booksy’s solutions** (all-in-one, OCR + auto-save, email alerts, invoice-paid auto transaction, Business Health, Telegram). The **user stories** above show how owners get alerts, keep books in sync, and see health after sending slips or writing transactions.
