-- Colonnes fiscales étendues sur la table clients.
-- Ajoutées via migrations pour garantir leur présence en base (elles étaient
-- référencées dans le code TypeScript mais absentes des fichiers de migration).
-- Le IF NOT EXISTS rend ce fichier idempotent sur les environnements où elles
-- ont été créées manuellement.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS civilite           text,
  ADD COLUMN IF NOT EXISTS chiffreaffaires    numeric,
  ADD COLUMN IF NOT EXISTS iscga              boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS isvendeurboissons  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS modepaiementigs    text,
  ADD COLUMN IF NOT EXISTS modepaiementpsl    text;
