-- Corriger les politiques RLS trop permissives sur capital_social et actionnaires
-- Remplacer USING (true) par une vérification d'authentification

-- Supprimer les anciennes politiques permissives
DROP POLICY IF EXISTS "Allow all operations on capital_social" ON public.capital_social;
DROP POLICY IF EXISTS "Allow all operations on actionnaires" ON public.actionnaires;

-- Nouvelle politique : seuls les utilisateurs authentifiés peuvent lire
CREATE POLICY "Authenticated users can read capital_social" ON public.capital_social
    FOR SELECT USING (auth.role() = 'authenticated');

-- Nouvelle politique : seuls les utilisateurs authentifiés peuvent insérer/modifier/supprimer
CREATE POLICY "Authenticated users can insert capital_social" ON public.capital_social
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update capital_social" ON public.capital_social
    FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete capital_social" ON public.capital_social
    FOR DELETE USING (auth.role() = 'authenticated');

-- Même chose pour actionnaires
CREATE POLICY "Authenticated users can read actionnaires" ON public.actionnaires
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert actionnaires" ON public.actionnaires
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update actionnaires" ON public.actionnaires
    FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete actionnaires" ON public.actionnaires
    FOR DELETE USING (auth.role() = 'authenticated');
