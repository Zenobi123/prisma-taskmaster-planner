import { supabase } from "@/integrations/supabase/client";
import { computeMontantPaye, computeStatutPaiement } from "@/lib/spec/facturePaiement";

// Recalcule montant_paye et status_paiement d'une facture à partir de la somme
// de ses paiements, comme l'application de référence où l'état de la facture
// (« émise » → « partiellement payée » → « payée ») est généré par les reçus.
// Idempotent : peut être rappelé après chaque création/modification/suppression
// de paiement sans effet de bord.
export const recalculerStatutPaiementFacture = async (
  factureId: string | null | undefined,
): Promise<void> => {
  if (!factureId) return;

  const { data: facture, error: factureError } = await supabase
    .from("factures")
    .select("id, montant, echeance, status_paiement")
    .eq("id", factureId)
    .maybeSingle();

  if (factureError || !facture) return;

  const { data: paiements, error: paiementsError } = await supabase
    .from("paiements")
    .select("montant")
    .eq("facture_id", factureId);

  if (paiementsError) return;

  const montantPaye = computeMontantPaye(paiements || []);
  const statut = computeStatutPaiement(facture.montant || 0, montantPaye, facture.echeance);

  await supabase
    .from("factures")
    .update({
      montant_paye: montantPaye,
      status_paiement: statut,
      updated_at: new Date().toISOString(),
    })
    .eq("id", factureId);
};
