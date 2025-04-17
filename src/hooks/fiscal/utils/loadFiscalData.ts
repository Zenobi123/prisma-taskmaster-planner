
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { FiscalData, IGSData } from "../types/igsTypes";

/**
 * Load fiscal data for a client
 */
export const loadFiscalData = async (clientId: string): Promise<FiscalData | null> => {
  try {
    console.log(`Loading fiscal data for client ${clientId}`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')  // Selecting everything to get both fiscal_data and igs
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Error loading client data:", error);
      return null;
    }
    
    // Convertir le client brut en Client typé
    const client = data as unknown as Client;
    
    // Extraire les données fiscales
    const fiscalData = client.fiscal_data || {};
    console.log("Loaded fiscal data:", fiscalData);
    
    // S'assurer que les sections requises existent
    const result: FiscalData = {
      attestation: fiscalData.attestation || {
        creationDate: "",
        validityEndDate: "",
        showInAlert: true
      },
      obligations: fiscalData.obligations || {
        patente: { assujetti: false, paye: false },
        bail: { assujetti: false, paye: false },
        taxeFonciere: { assujetti: false, paye: false },
        dsf: { assujetti: false, depose: false },
        darp: { assujetti: false, depose: false },
        tva: { assujetti: false, paye: false },
        cnps: { assujetti: false, paye: false }
      },
      hiddenFromDashboard: fiscalData.hiddenFromDashboard || false,
      igs: extractIGSData(fiscalData, client)
    };
    
    return result;
  } catch (error) {
    console.error("Exception loading fiscal data:", error);
    return null;
  }
};

/**
 * Extract IGS data from fiscal data or client igs property
 */
export const extractIGSData = (fiscalData: any, client: Client): IGSData => {
  console.log("Extracting IGS data for client:", client.id);
  console.log("Client IGS data:", client.igs);
  console.log("Fiscal data IGS:", fiscalData.igs);

  // Commencer par une structure IGS vide par défaut
  const defaultIGSData: IGSData = {
    soumisIGS: false,
    adherentCGA: false,
    classeIGS: undefined,
    patente: { montant: '', quittance: '' },
    acompteJanvier: { montant: '', quittance: '' },
    acompteFevrier: { montant: '', quittance: '' },
    chiffreAffairesAnnuel: 0,
    etablissements: [{
      nom: "Établissement principal",
      activite: "",
      ville: "",
      departement: "",
      quartier: "",
      chiffreAffaires: 0
    }],
    completedPayments: []
  };

  // Vérifier si les données IGS sont dans fiscal_data.igs
  if (fiscalData.igs) {
    console.log("Using IGS data from fiscal_data.igs");
    
    // Fusionner les données IGS de fiscal_data.igs avec la structure par défaut
    return {
      ...defaultIGSData,
      ...fiscalData.igs,
      // Assurer que les établissements soient toujours un tableau
      etablissements: Array.isArray(fiscalData.igs.etablissements) 
        ? fiscalData.igs.etablissements 
        : defaultIGSData.etablissements,
      // Assurer que les paiements complétés soient toujours un tableau
      completedPayments: Array.isArray(fiscalData.igs.completedPayments)
        ? fiscalData.igs.completedPayments
        : defaultIGSData.completedPayments
    };
  }
  
  // Si non présent dans fiscal_data.igs, vérifier dans client.igs
  if (client.igs) {
    console.log("Using IGS data from client.igs property");
    
    // Fusionner les données IGS du client.igs avec la structure par défaut
    return {
      ...defaultIGSData,
      ...client.igs,
      // Assurer que les établissements soient toujours un tableau
      etablissements: Array.isArray(client.igs.etablissements)
        ? client.igs.etablissements
        : defaultIGSData.etablissements,
      // Assurer que les paiements complétés soient toujours un tableau
      completedPayments: Array.isArray(client.igs.completedPayments)
        ? client.igs.completedPayments
        : defaultIGSData.completedPayments
    };
  }
  
  // Si aucune donnée IGS n'est trouvée, retourner les valeurs par défaut
  console.log("No IGS data found, using default values");
  return defaultIGSData;
};
