
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
    
    // Vérifier que fiscal_data est un objet et pas une chaîne de caractères
    const fiscalData = typeof data.fiscal_data === 'object' ? data.fiscal_data : null;
    
    // Vérifier et corriger les etablissements avant de retourner les données
    if (fiscalData && typeof fiscalData === 'object' && !Array.isArray(fiscalData) && fiscalData.igs) {
      if (!Array.isArray(fiscalData.igs.etablissements)) {
        fiscalData.igs.etablissements = [];
        console.info("Correction des établissements: initialisé à un tableau vide");
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
    etablissements: []
  };

  // If no fiscal data, return defaults
  if (!fiscalData || !fiscalData.igs) {
    console.info("No IGS data found, returning defaults with empty etablissements array");
    return defaultIGSData;
  }

  console.info("Raw IGS data from fiscal_data:", fiscalData.igs);

  // S'assurer que établissements est un tableau valide dans les données fiscales
  if (!Array.isArray(fiscalData.igs.etablissements)) {
    console.info("Établissements dans fiscal_data n'est pas un tableau, initialisation...");
    fiscalData.igs.etablissements = [];
  }

  // Ensure we have all required properties with defaults
  const igsData = {
    ...defaultIGSData,
    ...fiscalData.igs,
    // Toujours remplacer établissements par une copie du tableau pour éviter les références
    etablissements: Array.isArray(fiscalData.igs.etablissements) 
      ? [...fiscalData.igs.etablissements] 
      : []
  };

  // Ensure these fields are initialized properly
  igsData.chiffreAffairesAnnuel = igsData.chiffreAffairesAnnuel || 0;

  console.info("Final IGS data after extraction and validation:", igsData);
  return igsData;
};
