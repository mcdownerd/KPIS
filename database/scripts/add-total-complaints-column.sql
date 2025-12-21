ALTER TABLE complaints_metrics ADD COLUMN IF NOT EXISTS total_complaints INTEGER DEFAULT 0;
