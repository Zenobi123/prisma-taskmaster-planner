
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

    console.info(`Fiscal data found for client ${clientId}`);
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
    return defaultIGSData;
  }

  // Extract IGS data from fiscal_data
  return {
    ...defaultIGSData,
    ...fiscalData.igs,
    // Ensure these fields are initialized if they don't exist
    chiffreAffairesAnnuel: fiscalData.igs.chiffreAffairesAnnuel || 0,
    etablissements: fiscalData.igs.etablissements || []
  };
};
