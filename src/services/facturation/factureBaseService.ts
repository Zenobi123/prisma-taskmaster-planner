
import { supabase } from "@/integrations/supabase/client";
import { Facture, Client } from "@/types/facture";

// Fonction utilitaire pour assurer que le statut est d'un type valide
export function mapStatusToValidEnum(status: string): Facture["status"] {
  switch (status) {
    case "en_attente":
      return "en_attente";
    case "envoyée":
      return "envoyée";
    case "payée":
      return "payée";
    case "partiellement_payée":
      return "partiellement_payée";
    case "annulée":
      return "annulée";
    default:
      return "en_attente"; // Valeur par défaut si le statut est inconnu
  }
}

// Fonction utilitaire pour formater les données du client
export function formatClientData(clientData: any): Client {
  const adresse = clientData.adresse as Record<string, string>;
  const contact = clientData.contact as Record<string, string>;
  
  return {
    id: clientData.id,
    nom: clientData.type === "physique" ? clientData.nom : clientData.raisonsociale,
    adresse: `${adresse.quartier || ''}, ${adresse.ville || ''}`,
    telephone: contact.telephone || '',
    email: contact.email || ''
  };
}

// Fonction utilitaire pour mettre à jour le montant payé et le statut de la facture
export async function updateMontantPayeEtStatut(factureId: string): Promise<void> {
  // 1. Récupérer la facture et ses paiements
  const { data: facture, error: factureError } = await supabase
    .from("factures")
    .select("montant")
    .eq("id", factureId)
    .single();

  if (factureError) {
    console.error("Erreur lors de la récupération de la facture:", factureError);
    throw factureError;
  }

  const { data: paiements, error: paiementsError } = await supabase
    .from("paiements")
    .select("montant")
    .eq("facture_id", factureId);

  if (paiementsError) {
    console.error("Erreur lors de la récupération des paiements:", paiementsError);
    throw paiementsError;
  }

  // 2. Calculer le montant payé total
  const montantPaye = paiements.reduce((total, paiement) => total + paiement.montant, 0);

  // 3. Déterminer le nouveau statut de la facture
  let nouveauStatut: Facture["status"] = "en_attente";
  
  if (montantPaye === 0) {
    nouveauStatut = "en_attente";
  } else if (montantPaye < facture.montant) {
    nouveauStatut = "partiellement_payée";
  } else if (montantPaye >= facture.montant) {
    nouveauStatut = "payée";
  }

  // 4. Mettre à jour la facture
  const { error: updateError } = await supabase
    .from("factures")
    .update({ 
      montant_paye: montantPaye,
      status: nouveauStatut
    })
    .eq("id", factureId);

  if (updateError) {
    console.error("Erreur lors de la mise à jour de la facture:", updateError);
    throw updateError;
  }
}
