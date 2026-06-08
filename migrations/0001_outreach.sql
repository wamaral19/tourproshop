-- Outreach tracking: short links + click events.
-- Apply locally:  npx wrangler d1 execute tourproshop-outreach --local  --file=migrations/0001_outreach.sql
-- Apply remote:   npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0001_outreach.sql

CREATE TABLE IF NOT EXISTS outreach_links (
  slug        TEXT PRIMARY KEY,
  agent_name  TEXT,
  agency      TEXT,
  email       TEXT,
  target_url  TEXT NOT NULL DEFAULT '/agents',
  notes       TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS outreach_clicks (
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

CREATE INDEX IF NOT EXISTS idx_outreach_clicks_slug ON outreach_clicks(slug);
CREATE INDEX IF NOT EXISTS idx_outreach_clicks_ts   ON outreach_clicks(ts);
