-- Cloudflare D1 Newsletter Invoicing Schema
CREATE TABLE IF NOT EXISTS newsletter_retainer_invoices (
  id TEXT PRIMARY KEY,
  client_email TEXT NOT NULL,
  tier_name TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid',
  payment_method TEXT NOT NULL,
  issued_at TEXT NOT NULL,
  paid_at TEXT
);
