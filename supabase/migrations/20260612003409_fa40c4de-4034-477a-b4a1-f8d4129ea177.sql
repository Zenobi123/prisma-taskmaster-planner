ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS civilite           text,
  ADD COLUMN IF NOT EXISTS chiffreaffaires    numeric,
  ADD COLUMN IF NOT EXISTS iscga              boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS isvendeurboissons  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS modepaiementigs    text,
  ADD COLUMN IF NOT EXISTS modepaiementpsl    text;

NOTIFY pgrst, 'reload schema';