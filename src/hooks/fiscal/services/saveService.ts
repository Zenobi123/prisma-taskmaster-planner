
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, ObligationStatuses } from "../types";
import { Json } from "@/integrations/supabase/types";

/**
 * Prépare les données d'obligations pour la sauvegarde
 */
const prepareObligationsForSave = (obligations: Record<string, ObligationStatuses> | undefined): Json => {
  if (!obligations) return {};

  const prepared: any = {};

  Object.keys(obligations).forEach(year => {
    const yearObligations = obligations[year];
    
    if (yearObligations) {
      prepared[year] = {};
      
      // Process each obligation
      Object.keys(yearObligations).forEach(obligationKey => {
        const obligation = yearObligations[obligationKey as keyof ObligationStatuses];
        if (obligation) {
          prepared[year][obligationKey] = {
            assujetti: Boolean(obligation.assujetti),
            attachements: obligation.attachements || {},
            observations: obligation.observations || "",
            // Tax-specific fields
            ...(('payee' in obligation) && { payee: Boolean(obligation.payee) }),
            ...(('dateEcheance' in obligation) && obligation.dateEcheance && { dateEcheance: obligation.dateEcheance }),
            ...(('datePaiement' in obligation) && obligation.datePaiement && { datePaiement: obligation.datePaiement }),
            ...(('montant' in obligation) && obligation.montant !== undefined && { montant: obligation.montant }),
            ...(('methodePaiement' in obligation) && obligation.methodePaiement && { methodePaiement: obligation.methodePaiement }),
            ...(('referencePaiement' in obligation) && obligation.referencePaiement && { referencePaiement: obligation.referencePaiement }),
            // Declaration-specific fields
            ...(('depose' in obligation) && { depose: Boolean(obligation.depose) }),
            ...(('periodicity' in obligation) && { periodicity: obligation.periodicity || "annuelle" }),
            ...(('dateDepot' in obligation) && obligation.dateDepot && { dateDepot: obligation.dateDepot }),
            ...(('regime' in obligation) && obligation.regime && { regime: obligation.regime }),
            // IGS-specific fields
            ...(('caValue' in obligation) && obligation.caValue !== undefined && { caValue: obligation.caValue }),
            ...(('isCGA' in obligation) && obligation.isCGA !== undefined && { isCGA: obligation.isCGA }),
            ...(('classe' in obligation) && obligation.classe !== undefined && { classe: obligation.classe }),
            ...(('q1Payee' in obligation) && obligation.q1Payee !== undefined && { q1Payee: obligation.q1Payee }),
            ...(('q2Payee' in obligation) && obligation.q2Payee !== undefined && { q2Payee: obligation.q2Payee }),
            ...(('q3Payee' in obligation) && obligation.q3Payee !== undefined && { q3Payee: obligation.q3Payee }),
            ...(('q4Payee' in obligation) && obligation.q4Payee !== undefined && { q4Payee: obligation.q4Payee })
          };
        }
      });
    }
  });

  return prepared as Json;
};

/**
 * Sauvegarde des données fiscales avec gestion d'erreur améliorée
 */
export const saveFiscalData = async (
  clientId: string, 
  data: ClientFiscalData, 
  retryCount = 0
): Promise<boolean> => {
  try {
    console.log(`Sauvegarde des données fiscales pour le client ${clientId}...`);
    
    // Préparation des données pour la sauvegarde
    const preparedData = {
      clientId: data.clientId,
      year: data.year,
      attestation: data.attestation || {
        creationDate: "",
        validityEndDate: "",
        showInAlert: true
      },
      obligations: prepareObligationsForSave(data.obligations),
      hiddenFromDashboard: Boolean(data.hiddenFromDashboard),
      selectedYear: data.selectedYear || "2025",
      updatedAt: new Date().toISOString()
    };
    
    // Conversion en JSON sûr pour Supabase
    const safeData = JSON.parse(JSON.stringify(preparedData)) as Json;
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: safeData })
      .eq('id', clientId);
    
    if (error) {
      console.error(`Erreur de sauvegarde des données fiscales:`, error);
      
      // Retry logic
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1000;
        console.log(`Nouvel essai dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveFiscalData(clientId, data, retryCount + 1);
      }
      
      return false;
    }
    
    console.log(`Données fiscales sauvegardées avec succès pour le client ${clientId}`);
    return true;
  } catch (error) {
    console.error(`Exception lors de la sauvegarde des données fiscales:`, error);
    
    if (retryCount < 2) {
      const delay = (retryCount + 1) * 1000;
      console.log(`Nouvel essai après exception dans ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return saveFiscalData(clientId, data, retryCount + 1);
    }
    
    return false;
  }
};
