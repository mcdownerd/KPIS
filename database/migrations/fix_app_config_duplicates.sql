-- 1. Delete duplicates, keeping the most recent one (based on ctid, or created_at if available)
-- Since we don't know if created_at exists, we use ctid which is always present in Postgres
DELETE FROM public.app_config a USING (
      SELECT MIN(ctid) as ctid, user_id
        FROM public.app_config 
        GROUP BY user_id HAVING COUNT(*) > 1
      ) b
      WHERE a.user_id = b.user_id 
      AND a.ctid <> b.ctid;

-- 2. Add unique constraint if not exists
-- This ensures that future inserts with the same user_id will fail or can be handled by ON CONFLICT
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'app_config_user_id_key') THEN
        ALTER TABLE public.app_config ADD CONSTRAINT app_config_user_id_key UNIQUE (user_id);
    END IF;
END
$$;
