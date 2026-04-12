-- =============================================================================
-- Migration: Politiques RLS basées sur les rôles
-- Date: 2026-04-12
-- Description: Remplace les politiques "authenticated = autorisé" par des
--              politiques qui vérifient le rôle de l'utilisateur via public.users.
-- =============================================================================

-- 1. Fonction helper pour récupérer le rôle de l'utilisateur connecté
-- SECURITY DEFINER permet à la fonction de lire public.users même si l'appelant
-- n'a pas directement accès à cette table via RLS.
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Empêcher l'exécution par des utilisateurs non authentifiés
REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM public;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;

-- =============================================================================
-- 2. Table: clients
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, gestionnaire, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clients;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.clients;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can read clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_clients" ON public.clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_clients" ON public.clients
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_update_clients" ON public.clients
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_delete_clients" ON public.clients
  FOR DELETE USING (public.get_user_role() IN ('admin'));

-- =============================================================================
-- 3. Table: collaborateurs
-- Lecture: tous les rôles authentifiés
-- Écriture: admin uniquement
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.collaborateurs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.collaborateurs;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.collaborateurs;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.collaborateurs;
DROP POLICY IF EXISTS "Authenticated users can read collaborateurs" ON public.collaborateurs;
DROP POLICY IF EXISTS "Authenticated users can insert collaborateurs" ON public.collaborateurs;
DROP POLICY IF EXISTS "Authenticated users can update collaborateurs" ON public.collaborateurs;
DROP POLICY IF EXISTS "Authenticated users can delete collaborateurs" ON public.collaborateurs;

ALTER TABLE public.collaborateurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_collaborateurs" ON public.collaborateurs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_collaborateurs" ON public.collaborateurs
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "role_update_collaborateurs" ON public.collaborateurs
  FOR UPDATE USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "role_delete_collaborateurs" ON public.collaborateurs
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 4. Table: factures
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.factures;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.factures;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.factures;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.factures;
DROP POLICY IF EXISTS "Authenticated users can read factures" ON public.factures;
DROP POLICY IF EXISTS "Authenticated users can insert factures" ON public.factures;
DROP POLICY IF EXISTS "Authenticated users can update factures" ON public.factures;
DROP POLICY IF EXISTS "Authenticated users can delete factures" ON public.factures;

ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_factures" ON public.factures
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_factures" ON public.factures
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_update_factures" ON public.factures
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_delete_factures" ON public.factures
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 5. Table: paiements
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.paiements;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.paiements;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.paiements;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.paiements;
DROP POLICY IF EXISTS "Authenticated users can read paiements" ON public.paiements;
DROP POLICY IF EXISTS "Authenticated users can insert paiements" ON public.paiements;
DROP POLICY IF EXISTS "Authenticated users can update paiements" ON public.paiements;
DROP POLICY IF EXISTS "Authenticated users can delete paiements" ON public.paiements;

ALTER TABLE public.paiements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_paiements" ON public.paiements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_paiements" ON public.paiements
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_update_paiements" ON public.paiements
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_delete_paiements" ON public.paiements
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 6. Table: tasks (missions)
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, gestionnaire, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tasks;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.tasks;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.tasks;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can read tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can delete tasks" ON public.tasks;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_tasks" ON public.tasks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_tasks" ON public.tasks
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_update_tasks" ON public.tasks
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_delete_tasks" ON public.tasks
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 7. Table: fiscal_obligations
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, fiscaliste, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.fiscal_obligations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.fiscal_obligations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.fiscal_obligations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.fiscal_obligations;
DROP POLICY IF EXISTS "Authenticated users can read fiscal_obligations" ON public.fiscal_obligations;
DROP POLICY IF EXISTS "Authenticated users can insert fiscal_obligations" ON public.fiscal_obligations;
DROP POLICY IF EXISTS "Authenticated users can update fiscal_obligations" ON public.fiscal_obligations;
DROP POLICY IF EXISTS "Authenticated users can delete fiscal_obligations" ON public.fiscal_obligations;

ALTER TABLE public.fiscal_obligations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_fiscal_obligations" ON public.fiscal_obligations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_fiscal_obligations" ON public.fiscal_obligations
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'fiscaliste', 'expert-comptable'));

CREATE POLICY "role_update_fiscal_obligations" ON public.fiscal_obligations
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'fiscaliste', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'fiscaliste', 'expert-comptable'));

CREATE POLICY "role_delete_fiscal_obligations" ON public.fiscal_obligations
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 8. Table: documents_administratifs
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, gestionnaire, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.documents_administratifs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.documents_administratifs;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.documents_administratifs;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.documents_administratifs;
DROP POLICY IF EXISTS "Authenticated users can read documents_administratifs" ON public.documents_administratifs;
DROP POLICY IF EXISTS "Authenticated users can insert documents_administratifs" ON public.documents_administratifs;
DROP POLICY IF EXISTS "Authenticated users can update documents_administratifs" ON public.documents_administratifs;
DROP POLICY IF EXISTS "Authenticated users can delete documents_administratifs" ON public.documents_administratifs;

ALTER TABLE public.documents_administratifs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_documents_administratifs" ON public.documents_administratifs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_documents_administratifs" ON public.documents_administratifs
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_update_documents_administratifs" ON public.documents_administratifs
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_delete_documents_administratifs" ON public.documents_administratifs
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 9. Table: employes
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, gestionnaire, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.employes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.employes;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.employes;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.employes;
DROP POLICY IF EXISTS "Authenticated users can read employes" ON public.employes;
DROP POLICY IF EXISTS "Authenticated users can insert employes" ON public.employes;
DROP POLICY IF EXISTS "Authenticated users can update employes" ON public.employes;
DROP POLICY IF EXISTS "Authenticated users can delete employes" ON public.employes;

ALTER TABLE public.employes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_employes" ON public.employes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_employes" ON public.employes
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_update_employes" ON public.employes
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_delete_employes" ON public.employes
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 10. Table: paie
-- Lecture: admin, comptable, expert-comptable
-- Écriture: admin, comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.paie;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.paie;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.paie;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.paie;
DROP POLICY IF EXISTS "Authenticated users can read paie" ON public.paie;
DROP POLICY IF EXISTS "Authenticated users can insert paie" ON public.paie;
DROP POLICY IF EXISTS "Authenticated users can update paie" ON public.paie;
DROP POLICY IF EXISTS "Authenticated users can delete paie" ON public.paie;

ALTER TABLE public.paie ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_paie" ON public.paie
  FOR SELECT USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_write_paie" ON public.paie
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable'));

CREATE POLICY "role_update_paie" ON public.paie
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable'));

CREATE POLICY "role_delete_paie" ON public.paie
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 11. Table: conges
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, gestionnaire
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.conges;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.conges;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.conges;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.conges;
DROP POLICY IF EXISTS "Authenticated users can read conges" ON public.conges;
DROP POLICY IF EXISTS "Authenticated users can insert conges" ON public.conges;
DROP POLICY IF EXISTS "Authenticated users can update conges" ON public.conges;
DROP POLICY IF EXISTS "Authenticated users can delete conges" ON public.conges;

ALTER TABLE public.conges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_conges" ON public.conges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_conges" ON public.conges
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire'));

CREATE POLICY "role_update_conges" ON public.conges
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire'));

CREATE POLICY "role_delete_conges" ON public.conges
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 12. Table: contrats_employes
-- Lecture: admin, comptable, gestionnaire, expert-comptable
-- Écriture: admin, comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contrats_employes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.contrats_employes;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.contrats_employes;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.contrats_employes;
DROP POLICY IF EXISTS "Authenticated users can read contrats_employes" ON public.contrats_employes;
DROP POLICY IF EXISTS "Authenticated users can insert contrats_employes" ON public.contrats_employes;
DROP POLICY IF EXISTS "Authenticated users can update contrats_employes" ON public.contrats_employes;
DROP POLICY IF EXISTS "Authenticated users can delete contrats_employes" ON public.contrats_employes;

ALTER TABLE public.contrats_employes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_contrats_employes" ON public.contrats_employes
  FOR SELECT USING (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_write_contrats_employes" ON public.contrats_employes
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable'));

CREATE POLICY "role_update_contrats_employes" ON public.contrats_employes
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable'));

CREATE POLICY "role_delete_contrats_employes" ON public.contrats_employes
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 13. Table: prestations
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prestations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.prestations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.prestations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.prestations;
DROP POLICY IF EXISTS "Authenticated users can read prestations" ON public.prestations;
DROP POLICY IF EXISTS "Authenticated users can insert prestations" ON public.prestations;
DROP POLICY IF EXISTS "Authenticated users can update prestations" ON public.prestations;
DROP POLICY IF EXISTS "Authenticated users can delete prestations" ON public.prestations;

ALTER TABLE public.prestations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_prestations" ON public.prestations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_prestations" ON public.prestations
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_update_prestations" ON public.prestations
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_delete_prestations" ON public.prestations
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 14. Table: procedures_administratives
-- Lecture: tous les rôles authentifiés
-- Écriture: admin, comptable, gestionnaire, expert-comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.procedures_administratives;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.procedures_administratives;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.procedures_administratives;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.procedures_administratives;
DROP POLICY IF EXISTS "Authenticated users can read procedures_administratives" ON public.procedures_administratives;
DROP POLICY IF EXISTS "Authenticated users can insert procedures_administratives" ON public.procedures_administratives;
DROP POLICY IF EXISTS "Authenticated users can update procedures_administratives" ON public.procedures_administratives;
DROP POLICY IF EXISTS "Authenticated users can delete procedures_administratives" ON public.procedures_administratives;

ALTER TABLE public.procedures_administratives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_procedures_administratives" ON public.procedures_administratives
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_procedures_administratives" ON public.procedures_administratives
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_update_procedures_administratives" ON public.procedures_administratives
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'gestionnaire', 'expert-comptable'));

CREATE POLICY "role_delete_procedures_administratives" ON public.procedures_administratives
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 15. Table: payment_reminders
-- Lecture: admin, comptable, expert-comptable
-- Écriture: admin, comptable
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.payment_reminders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.payment_reminders;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.payment_reminders;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.payment_reminders;
DROP POLICY IF EXISTS "Authenticated users can read payment_reminders" ON public.payment_reminders;
DROP POLICY IF EXISTS "Authenticated users can insert payment_reminders" ON public.payment_reminders;
DROP POLICY IF EXISTS "Authenticated users can update payment_reminders" ON public.payment_reminders;
DROP POLICY IF EXISTS "Authenticated users can delete payment_reminders" ON public.payment_reminders;

ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_payment_reminders" ON public.payment_reminders
  FOR SELECT USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_write_payment_reminders" ON public.payment_reminders
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable'));

CREATE POLICY "role_update_payment_reminders" ON public.payment_reminders
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable'));

CREATE POLICY "role_delete_payment_reminders" ON public.payment_reminders
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 16. Table: capital_social (mise à jour de la migration précédente)
-- =============================================================================
DROP POLICY IF EXISTS "Authenticated users can read capital_social" ON public.capital_social;
DROP POLICY IF EXISTS "Authenticated users can insert capital_social" ON public.capital_social;
DROP POLICY IF EXISTS "Authenticated users can update capital_social" ON public.capital_social;
DROP POLICY IF EXISTS "Authenticated users can delete capital_social" ON public.capital_social;

CREATE POLICY "role_read_capital_social" ON public.capital_social
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_capital_social" ON public.capital_social
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_update_capital_social" ON public.capital_social
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_delete_capital_social" ON public.capital_social
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 17. Table: actionnaires (mise à jour de la migration précédente)
-- =============================================================================
DROP POLICY IF EXISTS "Authenticated users can read actionnaires" ON public.actionnaires;
DROP POLICY IF EXISTS "Authenticated users can insert actionnaires" ON public.actionnaires;
DROP POLICY IF EXISTS "Authenticated users can update actionnaires" ON public.actionnaires;
DROP POLICY IF EXISTS "Authenticated users can delete actionnaires" ON public.actionnaires;

CREATE POLICY "role_read_actionnaires" ON public.actionnaires
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_write_actionnaires" ON public.actionnaires
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_update_actionnaires" ON public.actionnaires
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'))
  WITH CHECK (public.get_user_role() IN ('admin', 'comptable', 'expert-comptable'));

CREATE POLICY "role_delete_actionnaires" ON public.actionnaires
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 18. Table: users
-- Lecture: l'utilisateur ne peut lire que son propre enregistrement
-- Écriture: admin uniquement
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can read users" ON public.users;
DROP POLICY IF EXISTS "Users can read own record" ON public.users;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_own_user" ON public.users
  FOR SELECT USING (id = auth.uid() OR public.get_user_role() = 'admin');

CREATE POLICY "role_write_users" ON public.users
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "role_update_users" ON public.users
  FOR UPDATE USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "role_delete_users" ON public.users
  FOR DELETE USING (public.get_user_role() = 'admin');

-- =============================================================================
-- 19. Table: profiles
-- Lecture: l'utilisateur peut lire son propre profil
-- Écriture: l'utilisateur peut modifier son propre profil, admin peut tout modifier
-- =============================================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_read_profiles" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "role_update_own_profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid() OR public.get_user_role() = 'admin')
  WITH CHECK (id = auth.uid() OR public.get_user_role() = 'admin');
