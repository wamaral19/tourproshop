-- Sponsor outreach tracking: parallel to agent outreach.
-- Short links live at /s/<slug> and default to /sponsors.
-- Apply locally:  npx wrangler d1 execute tourproshop-outreach --local  --file=migrations/0004_sponsor_outreach.sql
-- Apply remote:   npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0004_sponsor_outreach.sql

CREATE TABLE IF NOT EXISTS sponsor_outreach_links (
  slug         TEXT PRIMARY KEY,
  sponsor_name TEXT,
  company      TEXT,
  email        TEXT,
  target_url   TEXT NOT NULL DEFAULT '/sponsors',
  notes        TEXT,
  emails_sent  INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS sponsor_outreach_clicks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL,
  ts          INTEGER NOT NULL DEFAULT (unixepoch()),
  user_agent  TEXT,
  referrer    TEXT,
  ip          TEXT,
  country     TEXT,
  region      TEXT,
  city        TEXT,
  is_known    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sponsor_outreach_clicks_slug ON sponsor_outreach_clicks(slug);
CREATE INDEX IF NOT EXISTS idx_sponsor_outreach_clicks_ts   ON sponsor_outreach_clicks(ts);
