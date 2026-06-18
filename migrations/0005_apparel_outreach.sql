-- Apparel-brand outreach tracking: parallel to agent + sponsor outreach.
-- Short links live at /a/<slug> and default to /apparel.
-- Apply locally:  npx wrangler d1 execute tourproshop-outreach --local  --file=migrations/0005_apparel_outreach.sql
-- Apply remote:   npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0005_apparel_outreach.sql

CREATE TABLE IF NOT EXISTS apparel_outreach_links (
  slug         TEXT PRIMARY KEY,
  contact_name TEXT,
  brand        TEXT,
  email        TEXT,
  target_url   TEXT NOT NULL DEFAULT '/apparel',
  notes        TEXT,
  emails_sent  INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS apparel_outreach_clicks (
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

CREATE INDEX IF NOT EXISTS idx_apparel_outreach_clicks_slug ON apparel_outreach_clicks(slug);
CREATE INDEX IF NOT EXISTS idx_apparel_outreach_clicks_ts   ON apparel_outreach_clicks(ts);
