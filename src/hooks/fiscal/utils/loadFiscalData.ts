
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
    // Cast to unknown first, then to ClientFiscalData to satisfy TypeScript
    return data.fiscal_data as unknown as ClientFiscalData;
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
    etablissements: []
  };

  // If no fiscal data, return defaults
  if (!fiscalData || !fiscalData.igs) {
    console.info("No IGS data found, returning defaults");
    return defaultIGSData;
  }

  console.info("Extracted IGS data from fiscal_data:", fiscalData.igs);

  // Ensure we have all required properties with defaults
  const igsData = {
    ...defaultIGSData,
    ...fiscalData.igs,
  };

  // Ensure these fields are initialized properly
  igsData.chiffreAffairesAnnuel = igsData.chiffreAffairesAnnuel || 0;
  
  // Important: Ensure etablissements is ALWAYS an array
  if (!Array.isArray(igsData.etablissements)) {
    console.info("Etablissements is not an array, initializing to empty array");
    igsData.etablissements = [];
  }

  console.info("Final IGS data after extraction and validation:", igsData);
  return igsData;
};
