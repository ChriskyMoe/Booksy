# Is Booksy’s Ledger Like a Real Ledger System?

Short answer: **yes for the rows (double-entry), with one deliberate choice for the total.**

---

## What a “real” ledger system is

In real bookkeeping:

1. **Double-entry:** Every transaction has at least two sides. For every debit there is an equal credit. Total debits = total credits.
2. **Journal:** You record each transaction as a “journal entry” with one or more lines (each line is one account, debit or credit).
3. **Ledger view:** You display those journal entries in a table: Date, Description, Account, Debit, Credit. Each row is one line of a journal entry.
4. **Accounts:** Cash, Sales, Rent, etc. Each has a type (asset, liability, revenue, expense). Cash balance = sum of (Cash debits − Cash credits).

So a real ledger is: **journal entries → lines (account + debit/credit) → shown in a table, with debits = credits per transaction.**

---

## How Booksy does it

### 1. **Ledger rows = real double-entry**

- **Data source:** `journal_entries` (header: date, description) and `journal_lines` (account_id, type = debit/credit, amount).
- **Accounts:** `accounts` table (e.g. Cash, Sales, Rent) with types (asset, revenue, expense).
- **Display:** One row per **journal line**. Each **transaction** can have 2+ rows (e.g. Cash + Sales). Debits and credits are separate columns. So **yes, the ledger table is a real ledger view:** it shows actual journal entries with debits and credits.

### 2. **When you add a “Transaction”**

- You add a **Transaction** (Transactions page): category, amount, date, etc.
- The app:
  1. Inserts a row into **`transactions`** (for the Transactions list, Dashboard, reports).
  2. Calls **`createJournalEntryFromTransaction`**, which:
     - Creates one **`journal_entries`** row (same date, description).
     - Creates two **`journal_lines`** rows:
       - **Income:** Cash **debit**, category account (e.g. Sales) **credit**.
       - **Expense:** Category account (e.g. Rent) **debit**, Cash **credit**.
- So every Transaction row creates a proper double-entry journal entry. **The ledger rows are created like a real ledger:** one entry, two lines, debits = credits.

### 3. **Total cash balance (the one deliberate difference)**

- **Ledger table:** Shows journal entries only (from `journal_entries` + `journal_lines`). Voided entries are still shown but marked void.
- **“Total cash balance” on the Ledger page:** Is **not** computed from those journal lines. It is computed from the **`transactions`** table (sum of income − expenses), same as the Transactions page and Dashboard.
- **Why:** So the number at the top of the Ledger page **always matches** the Transactions list and the Dashboard. If we used only journal entries, any old or imported transaction that never got a journal entry would be in Transactions but not in that total; using the transactions table keeps one shared “total cash balance” everywhere.

So:

- **Ledger rows:** Real ledger (double-entry journal).
- **Total cash balance:** Comes from Transactions on purpose, for consistency across the app.

---

## Summary table

| Part | Real ledger? | How Booksy does it |
|------|----------------|---------------------|
| Rows (Date, Description, Account, Debit, Credit) | Yes | From `journal_entries` + `journal_lines` + `accounts`. One row per journal line. |
| Double-entry (debits = credits per transaction) | Yes | Each Transaction creates one journal entry with two lines (e.g. Cash + category). |
| Void / reverse | Yes | Void marks the journal entry as void (no reversing entry in current code). |
| Total cash balance | Usually from ledger (Cash account) | From **transactions** table (income − expenses) so it matches Transactions and Dashboard. |

---

## In one sentence

**The ledger table behaves like a real ledger (double-entry journal view); the total cash balance is taken from the transactions table so it stays aligned with your Transactions list and Dashboard.**
