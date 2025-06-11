
-- Table pour les informations de capital des personnes morales
CREATE TABLE public.capital_social (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  montant_capital NUMERIC NOT NULL DEFAULT 0,
  valeur_action_part NUMERIC DEFAULT 0,
  nombre_actions_parts INTEGER DEFAULT 0,
  type_capital TEXT DEFAULT 'actions' CHECK (type_capital IN ('actions', 'parts')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les actionnaires/associés
CREATE TABLE public.actionnaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT,
  date_naissance DATE,
  lieu_habitation TEXT,
  nombre_actions_parts INTEGER NOT NULL DEFAULT 0,
  valeur_capital NUMERIC NOT NULL DEFAULT 0,
  pourcentage NUMERIC NOT NULL DEFAULT 0 CHECK (pourcentage >= 0 AND pourcentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_capital_social_client_id ON public.capital_social(client_id);
CREATE INDEX idx_actionnaires_client_id ON public.actionnaires(client_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_capital_social_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER capital_social_updated_at
    BEFORE UPDATE ON public.capital_social
    FOR EACH ROW
    EXECUTE FUNCTION update_capital_social_updated_at();

CREATE OR REPLACE FUNCTION update_actionnaires_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER actionnaires_updated_at
    BEFORE UPDATE ON public.actionnaires
    FOR EACH ROW
    EXECUTE FUNCTION update_actionnaires_updated_at();

-- RLS (Row Level Security)
ALTER TABLE public.capital_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actionnaires ENABLE ROW LEVEL SECURITY;

-- Politiques RLS permissives
CREATE POLICY "Allow all operations on capital_social" ON public.capital_social
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on actionnaires" ON public.actionnaires
    FOR ALL USING (true) WITH CHECK (true);
