-- Cloudflare D1 Database Schema
-- Production Paid Subscription Niche Newsletter Engine

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  tier TEXT NOT NULL CHECK(tier IN ('free_reader', 'pro_subscriber', 'founding_member', 'enterprise_tier')),
  status TEXT NOT NULL DEFAULT 'active',
  last_event_id TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS newsletter_editions (
  id TEXT PRIMARY KEY,
  edition_number INTEGER NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  published_at TEXT NOT NULL,
  reading_time_minutes INTEGER NOT NULL,
  canonical_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscription_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  recorded_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sponsorship_bookings (
  id TEXT PRIMARY KEY,
  sponsor_name TEXT NOT NULL,
  sponsor_email TEXT NOT NULL,
  edition_number INTEGER NOT NULL,
  slot_type TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  booked_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_editions_slug ON newsletter_editions(slug);
