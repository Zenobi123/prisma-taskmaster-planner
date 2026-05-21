-- =============================================================================
-- Migration: Harmonisation des prestations sur facture_prestations
-- Date: 2026-05-21
-- Description:
--   Le code applicatif a été unifié pour ne plus lire/écrire les prestations
--   que dans public.facture_prestations (table canonique alimentée à la
--   création de facture, avec un vrai champ `type` impot/honoraire).
--   Cette migration aligne la base :
--     1. garantit la structure de facture_prestations,
--     2. ajoute la clé étrangère vers factures avec suppression en cascade
--        (le code supprime désormais les prestations via cette table),
--     3. rapatrie les éventuelles données de la table héritée `prestations`,
--     4. applique des politiques RLS identiques à celles de `prestations`.
--   La migration est idempotente : elle peut être rejouée sans danger.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Table canonique : structure
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.facture_prestations (
  id            text PRIMARY KEY,
  facture_id    text NOT NULL,
  description   text NOT NULL DEFAULT '',
  type          text NOT NULL DEFAULT 'honoraire',
  quantite      numeric NOT NULL DEFAULT 1,
  prix_unitaire numeric NOT NULL DEFAULT 0,
  montant       numeric NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Colonnes ajoutées au cas où la table préexisterait avec un schéma partiel.
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS facture_id    text;
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS description   text NOT NULL DEFAULT '';
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS type          text NOT NULL DEFAULT 'honoraire';
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS quantite      numeric NOT NULL DEFAULT 1;
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS prix_unitaire numeric NOT NULL DEFAULT 0;
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS montant       numeric NOT NULL DEFAULT 0;
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.facture_prestations ADD COLUMN IF NOT EXISTS updated_at    timestamptz NOT NULL DEFAULT now();

-- Contrainte de domaine sur le type (impot | honoraire).
DO $$
BEGIN
  -- Normaliser d'éventuelles valeurs au pluriel avant de poser la contrainte.
  UPDATE public.facture_prestations SET type = 'impot'     WHERE type IN ('impots', 'impôt', 'impôts');
  UPDATE public.facture_prestations SET type = 'honoraire' WHERE type IN ('honoraires');
  UPDATE public.facture_prestations SET type = 'honoraire' WHERE type IS NULL OR type NOT IN ('impot', 'honoraire');

  ALTER TABLE public.facture_prestations
    ADD CONSTRAINT facture_prestations_type_check CHECK (type IN ('impot', 'honoraire'));
EXCEPTION
  WHEN duplicate_object THEN NULL;  -- contrainte déjà présente
END $$;

-- -----------------------------------------------------------------------------
-- 2. Clé étrangère vers factures + suppression en cascade
-- -----------------------------------------------------------------------------
-- Nettoyer les lignes orphelines (facture inexistante) qui empêcheraient la
-- création de la contrainte et ne sont de toute façon plus exploitables.
DELETE FROM public.facture_prestations fp
WHERE fp.facture_id IS NULL
   OR NOT EXISTS (SELECT 1 FROM public.factures f WHERE f.id = fp.facture_id);

ALTER TABLE public.facture_prestations
  DROP CONSTRAINT IF EXISTS facture_prestations_facture_id_fkey;

ALTER TABLE public.facture_prestations
  ADD CONSTRAINT facture_prestations_facture_id_fkey
  FOREIGN KEY (facture_id) REFERENCES public.factures(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_facture_prestations_facture_id
  ON public.facture_prestations (facture_id);

-- -----------------------------------------------------------------------------
-- 3. Rapatriement des données héritées depuis public.prestations
--    (uniquement pour les factures qui n'ont encore AUCUNE ligne canonique,
--    afin d'éviter tout double comptage).
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  has_legacy boolean;
  has_type   boolean;
  has_qte    boolean;
  has_pu     boolean;
  type_expr  text;
  qte_expr   text;
  pu_expr    text;
  -- Inférence de type à partir de la désignation (mêmes mots-clés que le code).
  infer_expr constant text :=
    $infer$CASE WHEN lower(coalesce(p.description, '')) ~ '(patente|bail|taxe|imp[oô]t|pr[eé]compte|solde ir|solde irpp|timbre)'
                THEN 'impot' ELSE 'honoraire' END$infer$;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'prestations'
  ) INTO has_legacy;

  IF NOT has_legacy THEN
    RAISE NOTICE 'Table héritée public.prestations absente : aucun rapatriement.';
    RETURN;
  END IF;

  SELECT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='prestations' AND column_name='type') INTO has_type;
  SELECT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='prestations' AND column_name='quantite') INTO has_qte;
  SELECT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='prestations' AND column_name='prix_unitaire') INTO has_pu;

  IF has_type THEN
    type_expr := $t$CASE
        WHEN p.type IN ('impot', 'honoraire') THEN p.type
        WHEN p.type IN ('impots', 'impôt', 'impôts') THEN 'impot'
        WHEN p.type = 'honoraires' THEN 'honoraire'
        ELSE $t$ || infer_expr || $t$ END$t$;
  ELSE
    type_expr := infer_expr;
  END IF;

  qte_expr := CASE WHEN has_qte THEN 'coalesce(p.quantite, 1)' ELSE '1' END;
  pu_expr  := CASE WHEN has_pu  THEN 'coalesce(p.prix_unitaire, p.montant, 0)' ELSE 'coalesce(p.montant, 0)' END;

  EXECUTE format($mig$
    INSERT INTO public.facture_prestations
      (id, facture_id, description, type, quantite, prix_unitaire, montant, created_at, updated_at)
    SELECT p.id, p.facture_id, coalesce(p.description, ''), %s, %s, %s, coalesce(p.montant, 0), now(), now()
    FROM public.prestations p
    JOIN public.factures f ON f.id = p.facture_id
    WHERE NOT EXISTS (SELECT 1 FROM public.facture_prestations fp WHERE fp.id = p.id)
      AND NOT EXISTS (SELECT 1 FROM public.facture_prestations fp2 WHERE fp2.facture_id = p.facture_id)
  $mig$, type_expr, qte_expr, pu_expr);

  RAISE NOTICE 'Rapatriement des prestations héritées terminé.';
END $$;

-- -----------------------------------------------------------------------------
-- 4. Politiques RLS (calquées sur public.prestations)
--    Lecture : tous les rôles authentifiés
--    Écriture / mise à jour : admin, comptable, expert-comptable
--    Suppression : admin
-- -----------------------------------------------------------------------------
ALTER TABLE public.facture_prestations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "role_read_facture_prestations"   ON public.facture_prestations;
DROP POLICY IF EXISTS "role_write_facture_prestations"  ON public.facture_prestations;
DROP POLICY IF EXISTS "role_update_facture_prestations" ON public.facture_prestations;
DROP POLICY IF EXISTS "role_delete_facture_prestations" ON public.facture_prestations;

CREATE POLICY "role_read_facture_prestations" ON public.facture_prestations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_facture_prestations" ON public.facture_prestations
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_update_facture_prestations" ON public.facture_prestations
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_delete_facture_prestations" ON public.facture_prestations
  FOR DELETE USING (public.get_user_role() = 'admin');

-- -----------------------------------------------------------------------------
-- 5. Rafraîchir le cache de schéma PostgREST (API Supabase)
-- -----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

-- -----------------------------------------------------------------------------
-- 6. (OPTIONNEL) Mise hors service de la table héritée.
--    À n'exécuter qu'après avoir vérifié que le rapatriement est complet et que
--    plus aucun client/edge function n'écrit dans public.prestations.
--    Renommer plutôt que supprimer permet un retour arrière.
-- -----------------------------------------------------------------------------
-- ALTER TABLE IF EXISTS public.prestations RENAME TO prestations_deprecated_20260521;
