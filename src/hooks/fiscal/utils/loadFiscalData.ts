
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { IGSData } from "../types/igsTypes";

// Créer un établissement par défaut
const createDefaultEtablissement = () => {
  return {
    nom: "Établissement principal",
    activite: "",
    ville: "",
    departement: "",
    quartier: "",
    chiffreAffaires: 0
  };
};

// Load fiscal data for a client
export const loadFiscalData = async (clientId: string): Promise<ClientFiscalData | null> => {
  try {
    console.info(`Fetching fiscal data for client ${clientId}`);

    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();

    if (error) {
      console.error('Error loading fiscal data:', error);
      return null;
    }

    if (!data || !data.fiscal_data) {
      console.info("No fiscal data found for client");
      return null;
    }

    console.info(`Fiscal data found for client ${clientId}`, data.fiscal_data);
    
    const fiscalData = typeof data.fiscal_data === 'object' ? data.fiscal_data : null;
    
    // Vérifier et corriger les etablissements avant de retourner les données
    if (fiscalData && typeof fiscalData === 'object' && !Array.isArray(fiscalData)) {
      // Ensure we have the igs property as an object
      if (!fiscalData.igs || typeof fiscalData.igs !== 'object' || Array.isArray(fiscalData.igs)) {
        fiscalData.igs = {
          soumisIGS: false,
          adherentCGA: false,
          etablissements: [createDefaultEtablissement()]
        };
      } else {
        // We have a valid igs object, ensure etablissements exists and is an array with at least one element
        const igsData = fiscalData.igs;
        if (!Array.isArray(igsData.etablissements) || igsData.etablissements.length === 0) {
          igsData.etablissements = [createDefaultEtablissement()];
          console.info("Correction des établissements: initialisé avec un établissement par défaut");
        }
      }
    }
    
    // Cast to unknown first, then to ClientFiscalData to satisfy TypeScript
    return fiscalData as unknown as ClientFiscalData;
  } catch (error) {
    console.error('Error in loadFiscalData:', error);
    return null;
  }
};

// Extract IGS data from fiscal data
export const extractIGSData = (fiscalData: ClientFiscalData | null, client: Client): IGSData & { chiffreAffairesAnnuel?: number, etablissements?: any[] } => {
  // Default IGS data
  const defaultIGSData: IGSData & { chiffreAffairesAnnuel?: number, etablissements?: any[] } = {
    soumisIGS: false,
    adherentCGA: false,
    classeIGS: undefined,
    patente: { montant: '', quittance: '' },
    acompteJanvier: { montant: '', quittance: '' },
    acompteFevrier: { montant: '', quittance: '' },
    chiffreAffairesAnnuel: 0,
    etablissements: [createDefaultEtablissement()] // Toujours initialiser avec un établissement par défaut
  };

  // If no fiscal data, return defaults
  if (!fiscalData || !fiscalData.igs) {
    console.info("No IGS data found, returning defaults with a default etablissement");
    return defaultIGSData;
  }

  console.info("Raw IGS data from fiscal_data:", fiscalData.igs);

  // Type safety check for the igs object - ensure it's an object and not an array
  const igsData = (fiscalData.igs && typeof fiscalData.igs === 'object' && !Array.isArray(fiscalData.igs)) 
    ? fiscalData.igs 
    : {};
  
  // Safely extract etablissements, ensuring it's always an array with at least one element
  let safeEtablissements = [];
  
  if (igsData && 
      typeof igsData === 'object' && 
      !Array.isArray(igsData) &&
      Array.isArray(igsData.etablissements) &&
      igsData.etablissements.length > 0) {
    safeEtablissements = [...igsData.etablissements];
  } else {
    safeEtablissements = [createDefaultEtablissement()];
  }

  console.info("Extracted etablissements:", safeEtablissements);

  // Ensure we have all required properties with defaults
  const resultIgsData = {
    ...defaultIGSData,
    ...igsData,
    // Always use the safely extracted etablissements array
    etablissements: safeEtablissements
  };

  // Ensure these fields are initialized properly
  resultIgsData.chiffreAffairesAnnuel = resultIgsData.chiffreAffairesAnnuel || 0;

  console.info("Final IGS data after extraction and validation:", resultIgsData);
  return resultIgsData;
};
