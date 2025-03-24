
export interface PrestationResult {
  totalImpots: number;
  totalHonoraires: number;
  impotsPendant: number;
  honorairesPendant: number;
}

export const calculatePrestationTotals = (
  prestations: any[],
  facturesMap: Map<string, any>
): PrestationResult => {
  let totalImpots = 0;
  let totalHonoraires = 0;
  let impotsPendant = 0;
  let honorairesPendant = 0;

  prestations.forEach(prestation => {
    const descLower = prestation.description.toLowerCase();
    const isImpot = 
      descLower.includes("patente") || 
      descLower.includes("bail") || 
      descLower.includes("taxe") || 
      descLower.includes("impôt") || 
      descLower.includes("précompte") || 
      descLower.includes("solde ir") || 
      descLower.includes("solde irpp") || 
      descLower.includes("timbre");
    
    // Find the corresponding facture
    const facture = facturesMap.get(prestation.facture_id);
    if (facture) {
      const montant = parseFloat(prestation.montant.toString());
      
      if (isImpot) {
        totalImpots += montant;
        
        // If facture is not fully paid, add to pending
        if (facture.status_paiement !== 'payée') {
          const paymentRatio = facture.montant_paye ? facture.montant_paye / facture.montant : 0;
          impotsPendant += montant * (1 - paymentRatio);
        }
      } else {
        totalHonoraires += montant;
        
        // If facture is not fully paid, add to pending
        if (facture.status_paiement !== 'payée') {
          const paymentRatio = facture.montant_paye ? facture.montant_paye / facture.montant : 0;
          honorairesPendant += montant * (1 - paymentRatio);
        }
      }
    }
  });

  return {
    totalImpots,
    totalHonoraires,
    impotsPendant,
    honorairesPendant
  };
};
