
import { supabase } from "@/integrations/supabase/client";
import { Facture, FactureDB, convertToFacture } from "@/types/facture";
import { Json } from "@/integrations/supabase/types";
import { v4 as uuidv4 } from 'uuid';

export const enregistrerPaiement = async (
  factureId: string,
  montant: number,
  modePaiement: string,
  datePaiement: string,
  notes?: string
) => {
  // Récupérer la facture actuelle
  const { data: factureData } = await supabase
    .from('factures')
    .select('*')
    .eq('id', factureId)
    .single();
    
  if (!factureData) {
    throw new Error("Facture non trouvée");
  }

  const facture = factureData as unknown as FactureDB;
  
  // Calculer le nouveau montant payé
  const nouveauMontantPaye = (facture.montant_paye || 0) + montant;
  
  // Déterminer le nouveau statut
  let nouveauStatut = facture.status;
  if (nouveauMontantPaye >= facture.montant) {
    nouveauStatut = 'payée';
  } else if (nouveauMontantPaye > 0) {
    nouveauStatut = 'partiellement_payée';
  }
  
  // Créer l'enregistrement de paiement
  const paiement = {
    id: uuidv4(),
    date: datePaiement,
    montant,
    mode: modePaiement,
    notes: notes || null
  };
  
  // Ajouter le paiement à la liste des paiements
  const paiementActuels = (facture.paiements || []) as any[];
  const paiements = [...paiementActuels, paiement];
  
  // Mettre à jour la facture
  const { data, error } = await supabase
    .from('factures')
    .update({
      montant_paye: nouveauMontantPaye,
      status: nouveauStatut,
      paiements: paiements as unknown as Json
    })
    .eq('id', factureId)
    .select()
    .single();
  
  if (error) {
    console.error(`Erreur lors de l'enregistrement du paiement:`, error);
    throw error;
  }
  
  return convertToFacture(data as unknown as FactureDB);
};
