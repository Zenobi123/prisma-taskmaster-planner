
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { IGSData } from "../types/igsTypes";

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
          etablissements: []
        };
      } else {
        // We have a valid igs object, ensure etablissements exists and is an array
        const igsData = fiscalData.igs;
        if (!Array.isArray(igsData.etablissements)) {
          igsData.etablissements = [];
          console.info("Correction des établissements: initialisé à un tableau vide");
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
    etablissements: [] // Always initialize as an empty array
  };

  // If no fiscal data, return defaults
  if (!fiscalData || !fiscalData.igs) {
    console.info("No IGS data found, returning defaults with empty etablissements array");
    return defaultIGSData;
  }

  console.info("Raw IGS data from fiscal_data:", fiscalData.igs);

  // Type safety check for the igs object - ensure it's an object and not an array
  const igsData = (fiscalData.igs && typeof fiscalData.igs === 'object' && !Array.isArray(fiscalData.igs)) 
    ? fiscalData.igs 
    : {};
  
  // Safely extract etablissements, ensuring it's always an array
  const safeEtablissements = (igsData && 
                             typeof igsData === 'object' && 
                             !Array.isArray(igsData) &&
                             Array.isArray(igsData.etablissements)) 
    ? [...igsData.etablissements] 
    : [];

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
