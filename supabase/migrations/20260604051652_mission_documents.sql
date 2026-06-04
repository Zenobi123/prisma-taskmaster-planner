-- Migration: Mission documents (ordres de mission + rapports de mission)

-- 1. Ajouter les colonnes de liaison mission dans la table courriers
ALTER TABLE courriers
  ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS mission_doc_type TEXT;

-- 2. Créer la table rapports_mission
CREATE TABLE IF NOT EXISTS rapports_mission (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  file_format TEXT NOT NULL DEFAULT 'txt',
  contenu_parse TEXT,
  file_path TEXT,
  statut TEXT NOT NULL DEFAULT 'soumis',
  rapport_superviseur_id UUID,
  rapport_client_id UUID,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. RLS pour rapports_mission
ALTER TABLE rapports_mission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rapports_mission_all" ON rapports_mission
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Bucket de stockage pour les rapports de mission (best-effort)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('rapports-mission', 'rapports-mission', false, 5242880)
ON CONFLICT DO NOTHING;

CREATE POLICY IF NOT EXISTS "rapports_mission_storage_all" ON storage.objects
  FOR ALL USING (bucket_id = 'rapports-mission')
  WITH CHECK (bucket_id = 'rapports-mission');
