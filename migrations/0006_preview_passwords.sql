-- Passwords for the private preview worker, and the log of their use.
-- Apply locally:  npx wrangler d1 execute tourproshop-outreach --local  --file=migrations/0006_preview_passwords.sql
-- Apply remote:   npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0006_preview_passwords.sql
--
-- Each agent's own email address is their password: they enter the address the
-- invitation was sent to. Nothing to distribute and nothing for them to lose,
-- and the log says exactly who looked.
--
-- That means `email` and the password are the same string, so `password_hash`
-- is not protecting a secret here — the scheme is the secret, not the address,
-- and these same addresses already sit in the outreach tables. The hash is kept
-- as the lookup key anyway so the two can come apart later: issue a random code
-- to someone and their row keeps naming them without the code being readable.

CREATE TABLE IF NOT EXISTS preview_passwords (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  password_index INTEGER NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL UNIQUE,
  email          TEXT,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  revoked_at     INTEGER,
  uses           INTEGER NOT NULL DEFAULT 0,
  last_used_at   INTEGER
);

-- `password_id` is NULL for a failed attempt: we record that someone tried and
-- from where, but never what they typed.
CREATE TABLE IF NOT EXISTS preview_access_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  password_id INTEGER REFERENCES preview_passwords(id),
  event       TEXT NOT NULL, -- 'signin' | 'view' | 'denied'
  ts          INTEGER NOT NULL DEFAULT (unixepoch()),
  path        TEXT,
  ip          TEXT,
  country     TEXT,
  region      TEXT,
  city        TEXT,
  user_agent  TEXT,
  referrer    TEXT
);

CREATE INDEX IF NOT EXISTS idx_preview_access_log_ts       ON preview_access_log(ts);
CREATE INDEX IF NOT EXISTS idx_preview_access_log_password ON preview_access_log(password_id);
CREATE INDEX IF NOT EXISTS idx_preview_access_log_event    ON preview_access_log(event);
