import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, ObligationStatuses } from "../types";
import { Json } from "@/integrations/supabase/types";
import { validateObligationConsistency, validateAndMigrateObligationStatuses } from "./validationService";

/**
 * Prépare les données d'obligations pour la sauvegarde avec validation
 */
const prepareObligationsForSave = (obligations: Record<string, ObligationStatuses> | undefined): Json => {
  if (!obligations) return {};

  const prepared: any = {};

  Object.keys(obligations).forEach(year => {
    const yearObligations = obligations[year];
    
    if (yearObligations) {
      // Valider et migrer avant la sauvegarde
      const validatedObligations = validateAndMigrateObligationStatuses(yearObligations);
      
      // Vérifier la cohérence
      if (!validateObligationConsistency(validatedObligations)) {
        console.warn(`Problème de cohérence détecté pour l'année ${year}, sauvegarde tout de même`);
      }

      prepared[year] = {
        // Direct taxes - préparer chaque obligation
        igs: prepareTaxObligationForSave(validatedObligations.igs, 'igs'),
        patente: prepareTaxObligationForSave(validatedObligations.patente, 'tax'),
        licence: prepareTaxObligationForSave(validatedObligations.licence, 'tax'),
        bailCommercial: prepareTaxObligationForSave(validatedObligations.bailCommercial, 'tax'),
        precompteLoyer: prepareTaxObligationForSave(validatedObligations.precompteLoyer, 'tax'),
        tpf: prepareTaxObligationForSave(validatedObligations.tpf, 'tax'),
        // Declarations
        dsf: prepareDeclarationObligationForSave(validatedObligations.dsf),
        darp: prepareDeclarationObligationForSave(validatedObligations.darp),
        cntps: prepareDeclarationObligationForSave(validatedObligations.cntps),
        precomptes: prepareDeclarationObligationForSave(validatedObligations.precomptes)
      };
    }
  });

  return prepared as Json;
};

/**
 * Prépare une obligation fiscale pour la sauvegarde
 */
const prepareTaxObligationForSave = (obligation: any, type: 'tax' | 'igs'): any => {
  if (!obligation) return { assujetti: false, payee: false };

  const prepared: any = {
    assujetti: Boolean(obligation.assujetti),
    payee: Boolean(obligation.payee),
    attachements: obligation.attachements || {},
    observations: obligation.observations
  };

  // Ajouter les champs optionnels s'ils existent
  if (obligation.dateEcheance) prepared.dateEcheance = obligation.dateEcheance;
  if (obligation.datePaiement) prepared.datePaiement = obligation.datePaiement;
  if (obligation.montant !== undefined) prepared.montant = obligation.montant;
  if (obligation.montantAnnuel !== undefined) prepared.montantAnnuel = obligation.montantAnnuel;
  if (obligation.montantPenalite !== undefined) prepared.montantPenalite = obligation.montantPenalite;
  if (obligation.montantTotal !== undefined) prepared.montantTotal = obligation.montantTotal;
  if (obligation.methodePaiement) prepared.methodePaiement = obligation.methodePaiement;
  if (obligation.referencePaiement) prepared.referencePaiement = obligation.referencePaiement;

  // Propriétés spécifiques à IGS
  if (type === 'igs') {
    if (obligation.caValue) prepared.caValue = obligation.caValue;
    if (obligation.isCGA !== undefined) prepared.isCGA = obligation.isCGA;
    if (obligation.classe !== undefined) prepared.classe = obligation.classe;
    if (obligation.outOfRange !== undefined) prepared.outOfRange = obligation.outOfRange;
    if (obligation.q1Payee !== undefined) prepared.q1Payee = obligation.q1Payee;
    if (obligation.q2Payee !== undefined) prepared.q2Payee = obligation.q2Payee;
    if (obligation.q3Payee !== undefined) prepared.q3Payee = obligation.q3Payee;
    if (obligation.q4Payee !== undefined) prepared.q4Payee = obligation.q4Payee;
  }

  return prepared;
};

/**
 * Prépare une obligation déclarative pour la sauvegarde
 */
const prepareDeclarationObligationForSave = (obligation: any): any => {
  if (!obligation) return { assujetti: false, depose: false, periodicity: "annuelle" };

  const prepared: any = {
    assujetti: Boolean(obligation.assujetti),
    depose: Boolean(obligation.depose),
    periodicity: obligation.periodicity || "annuelle",
    attachements: obligation.attachements || {},
    observations: obligation.observations
  };

  // Ajouter les champs optionnels s'ils existent
  if (obligation.dateDepot) prepared.dateDepot = obligation.dateDepot;
  if (obligation.dateEcheance) prepared.dateEcheance = obligation.dateEcheance;
  if (obligation.regime) prepared.regime = obligation.regime;
  if (obligation.dateSoumission) prepared.dateSoumission = obligation.dateSoumission;

  return prepared;
};

/**
 * Sauvegarde des données fiscales avec validation et fonction de retry
 */
export const saveFiscalData = async (
  clientId: string, 
  data: ClientFiscalData, 
  retryCount = 0
): Promise<boolean> => {
  try {
    console.log(`Sauvegarde des données fiscales pour le client ${clientId} (tentative ${retryCount + 1})`);
    
    // Préparation des données pour la sauvegarde avec validation
    const preparedData = {
      clientId: data.clientId,
      year: data.year,
      attestation: data.attestation,
      obligations: prepareObligationsForSave(data.obligations),
      hiddenFromDashboard: data.hiddenFromDashboard,
      selectedYear: data.selectedYear,
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    
    // Clone et transformation pour respecter le type Json de Supabase
    const safeData = JSON.parse(JSON.stringify(preparedData)) as Json;
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: safeData })
      .eq('id', clientId);
    
    if (error) {
      console.error(`Erreur de sauvegarde des données fiscales (tentative ${retryCount + 1}):`, error);
      
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
    console.error(`Exception lors de la sauvegarde des données fiscales (tentative ${retryCount + 1}):`, error);
    return false;
  }
};
