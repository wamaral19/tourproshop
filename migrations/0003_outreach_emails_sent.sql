-- Tracks how many outreach emails have been sent to each agent.
-- Apply: npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0003_outreach_emails_sent.sql

ALTER TABLE outreach_links ADD COLUMN emails_sent INTEGER NOT NULL DEFAULT 0;
