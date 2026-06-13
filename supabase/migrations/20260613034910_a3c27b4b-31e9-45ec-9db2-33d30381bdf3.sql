
-- 1. paiements.facture_id devient nullable (avances / crédits)
ALTER TABLE public.paiements ALTER COLUMN facture_id DROP NOT NULL;

-- 2. facture_prestations
CREATE TABLE IF NOT EXISTS public.facture_prestations (
  id TEXT PRIMARY KEY,
  facture_id TEXT NOT NULL REFERENCES public.factures(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  type TEXT,
  quantite NUMERIC NOT NULL DEFAULT 1,
  prix_unitaire NUMERIC NOT NULL DEFAULT 0,
  montant NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.facture_prestations TO authenticated;
GRANT ALL ON public.facture_prestations TO service_role;
ALTER TABLE public.facture_prestations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth manage facture_prestations" ON public.facture_prestations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_facture_prestations_facture ON public.facture_prestations(facture_id);

-- 3. devis
CREATE TABLE IF NOT EXISTS public.devis (
  id TEXT PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  date_validite DATE,
  objet TEXT,
  status TEXT NOT NULL DEFAULT 'brouillon',
  montant_total NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  facture_id TEXT REFERENCES public.factures(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.devis TO authenticated;
GRANT ALL ON public.devis TO service_role;
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth manage devis" ON public.devis
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_devis_updated_at BEFORE UPDATE ON public.devis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 4. devis_prestations
CREATE TABLE IF NOT EXISTS public.devis_prestations (
  id TEXT PRIMARY KEY,
  devis_id TEXT NOT NULL REFERENCES public.devis(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  type TEXT,
  quantite NUMERIC NOT NULL DEFAULT 1,
  prix_unitaire NUMERIC NOT NULL DEFAULT 0,
  montant NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.devis_prestations TO authenticated;
GRANT ALL ON public.devis_prestations TO service_role;
ALTER TABLE public.devis_prestations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth manage devis_prestations" ON public.devis_prestations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_devis_prestations_devis ON public.devis_prestations(devis_id);

-- 5. propositions
CREATE TABLE IF NOT EXISTS public.propositions (
  id TEXT PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  date_manuelle BOOLEAN NOT NULL DEFAULT false,
  source_type TEXT,
  source_id TEXT,
  source_numero TEXT,
  lignes JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL DEFAULT 0,
  total_impots NUMERIC NOT NULL DEFAULT 0,
  total_honoraires NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'brouillon',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.propositions TO authenticated;
GRANT ALL ON public.propositions TO service_role;
ALTER TABLE public.propositions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth manage propositions" ON public.propositions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_propositions_updated_at BEFORE UPDATE ON public.propositions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. courriers
CREATE TABLE IF NOT EXISTS public.courriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  client_nom TEXT,
  template_id TEXT,
  template_titre TEXT,
  sujet TEXT,
  contenu TEXT,
  message_personnalise TEXT,
  statut TEXT NOT NULL DEFAULT 'brouillon',
  mode_envoi TEXT,
  date_creation TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_envoi TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courriers TO authenticated;
GRANT ALL ON public.courriers TO service_role;
ALTER TABLE public.courriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth manage courriers" ON public.courriers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_courriers_updated_at BEFORE UPDATE ON public.courriers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
