
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, ObligationStatuses } from "../types";
import { Json } from "@/integrations/supabase/types";

/**
 * Normalise les données d'obligations pour assurer la compatibilité avec la nouvelle structure
 */
const normalizeObligations = (obligations: any): Record<string, ObligationStatuses> => {
  if (!obligations) return {};

  const normalized: Record<string, ObligationStatuses> = {};

  // Pour chaque année dans les obligations
  Object.keys(obligations).forEach(year => {
    const yearObligations = obligations[year];
    
    if (typeof yearObligations === 'object' && yearObligations !== null) {
      // Normalise chaque obligation pour s'assurer qu'elle a la bonne structure
      normalized[year] = {
        // Direct taxes - convertir les anciennes structures si nécessaire
        igs: normalizeIgsObligation(yearObligations.igs),
        patente: normalizeTaxObligation(yearObligations.patente),
        licence: normalizeTaxObligation(yearObligations.licence),
        bailCommercial: normalizeTaxObligation(yearObligations.bailCommercial || yearObligations.baillCommercial),
        precompteLoyer: normalizeTaxObligation(yearObligations.precompteLoyer || yearObligations.precompte),
        tpf: normalizeTaxObligation(yearObligations.tpf || yearObligations.taxeFonciere),
        // Declarations - convertir les anciennes structures si nécessaire  
        dsf: normalizeDeclarationObligation(yearObligations.dsf, "annuelle"),
        darp: normalizeDeclarationObligation(yearObligations.darp, "annuelle"),
        cntps: normalizeDeclarationObligation(yearObligations.cntps, "mensuelle"),
        precomptes: normalizeDeclarationObligation(yearObligations.precomptes, "mensuelle")
      };
    }
  });

  return normalized;
};

/**
 * Normalise une obligation IGS en gérant les anciennes structures
 */
const normalizeIgsObligation = (obligation: any) => {
  if (!obligation) {
    return { assujetti: false, payee: false };
  }

  return {
    assujetti: Boolean(obligation.assujetti),
    payee: Boolean(obligation.payee || obligation.paye),
    attachements: obligation.attachements || {},
    observations: obligation.observations,
    // Propriétés spécifiques à IGS
    montantAnnuel: obligation.montantAnnuel,
    caValue: obligation.caValue || obligation.chiffreAffaires?.toString(),
    isCGA: obligation.isCGA,
    classe: obligation.classe,
    outOfRange: obligation.outOfRange,
    // Paiements trimestriels
    q1Payee: Boolean(obligation.q1Payee),
    q2Payee: Boolean(obligation.q2Payee),
    q3Payee: Boolean(obligation.q3Payee),
    q4Payee: Boolean(obligation.q4Payee),
    // Autres propriétés héritées
    dateEcheance: obligation.dateEcheance,
    datePaiement: obligation.datePaiement,
    montant: obligation.montant,
    montantPenalite: obligation.montantPenalite,
    montantTotal: obligation.montantTotal,
    methodePaiement: obligation.methodePaiement,
    referencePaiement: obligation.referencePaiement
  };
};

/**
 * Normalise une obligation fiscale en gérant les anciennes structures
 */
const normalizeTaxObligation = (obligation: any) => {
  if (!obligation) {
    return { assujetti: false, payee: false };
  }

  return {
    assujetti: Boolean(obligation.assujetti),
    payee: Boolean(obligation.payee || obligation.paye),
    attachements: obligation.attachements || {},
    observations: obligation.observations,
    dateEcheance: obligation.dateEcheance,
    datePaiement: obligation.datePaiement,
    montant: obligation.montant,
    montantAnnuel: obligation.montantAnnuel,
    montantPenalite: obligation.montantPenalite,
    montantTotal: obligation.montantTotal,
    methodePaiement: obligation.methodePaiement,
    referencePaiement: obligation.referencePaiement
  };
};

/**
 * Normalise une obligation déclarative en gérant les anciennes structures
 */
const normalizeDeclarationObligation = (obligation: any, defaultPeriodicity: "mensuelle" | "trimestrielle" | "annuelle") => {
  if (!obligation) {
    return { assujetti: false, depose: false, periodicity: defaultPeriodicity };
  }

  return {
    assujetti: Boolean(obligation.assujetti),
    depose: Boolean(obligation.depose),
    periodicity: obligation.periodicity || defaultPeriodicity,
    attachements: obligation.attachements || {},
    observations: obligation.observations,
    dateDepot: obligation.dateDepot,
    dateEcheance: obligation.dateEcheance,
    regime: obligation.regime,
    dateSoumission: obligation.dateSoumission
  };
};

/**
 * Fetch fiscal data with retry capability and data normalization
 */
export const fetchFiscalData = async (clientId: string, retryCount = 0): Promise<ClientFiscalData | null> => {
  try {
    console.log(`Fetching fiscal data for client ${clientId} (attempt ${retryCount + 1})`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error(`Error fetching fiscal data (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchFiscalData(clientId, retryCount + 1);
      }
      
      return null;
    }
    
    if (data?.fiscal_data) {
      // Conversion sécurisée en utilisant unknown comme intermédiaire
      const rawFiscalData = data.fiscal_data as unknown as any;
      
      // Normaliser les données d'obligations
      const normalizedObligations = normalizeObligations(rawFiscalData.obligations);
      
      const fiscalData: ClientFiscalData = {
        clientId,
        year: rawFiscalData.year,
        attestation: rawFiscalData.attestation,
        obligations: normalizedObligations,
        hiddenFromDashboard: rawFiscalData.hiddenFromDashboard,
        selectedYear: rawFiscalData.selectedYear,
        updatedAt: rawFiscalData.updatedAt
      };
      
      return fiscalData;
    }
    
    return null;
  } catch (error) {
    console.error(`Exception during fiscal data fetch (attempt ${retryCount + 1}):`, error);
    return null;
  }
};
