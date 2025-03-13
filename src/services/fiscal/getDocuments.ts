
import { supabase } from "@/integrations/supabase/client";
import { FiscalDocument, FiscalDocumentDisplay } from "@/components/gestion/tabs/fiscale/types";
import { toast } from "@/hooks/use-toast";
import { mapToFiscalDocument, handleServiceError } from "./fiscalDocumentUtils";

/**
 * Récupère les documents fiscaux d'un client
 * @param clientId L'identifiant du client
 * @returns Une liste de documents fiscaux
 */
export const getFiscalDocuments = async (clientId: string): Promise<FiscalDocument[]> => {
  try {
    console.log("Récupération des documents fiscaux pour le client:", clientId);
    
    const { data, error } = await supabase
      .from("fiscal_documents")
      .select("*")
      .eq("client_id", clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des documents fiscaux:", error);
      throw error;
    }

    console.log("Documents fiscaux récupérés:", data);
    
    return data.map(mapToFiscalDocument);
  } catch (error) {
    handleServiceError(error, "Impossible de récupérer les documents fiscaux");
    return [];
  }
};

/**
 * Récupère les documents fiscaux qui expirent bientôt
 * @param daysThreshold Nombre de jours avant expiration (défaut: 30)
 * @returns Une liste de documents fiscaux avec informations client
 */
export const getExpiringFiscalDocuments = async (daysThreshold = 30): Promise<FiscalDocumentDisplay[]> => {
  try {
    console.log(`Récupération des documents fiscaux expirant dans ${daysThreshold} jours`);
    
    // Calculer la date d'aujourd'hui
    const today = new Date();
    
    // Calculer la date limite (aujourd'hui + jours de seuil)
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    // Récupérer les documents qui expirent entre aujourd'hui et la date seuil
    const { data, error } = await supabase
      .from("fiscal_documents")
      .select(`
        *,
        clients!fiscal_documents_client_id_fkey (
          id, 
          niu, 
          nom, 
          raisonsociale, 
          type
        )
      `)
      .eq('name', 'Attestation de Conformité Fiscale (ACF)')
      .not('valid_until', 'is', null)
      .lt('valid_until', thresholdDate.toISOString())
      .gte('valid_until', today.toISOString())
      .order('valid_until', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des documents fiscaux expirants:", error);
      throw error;
    }

    console.log("Documents fiscaux expirants récupérés:", data);
    return data as FiscalDocumentDisplay[];
  } catch (error) {
    handleServiceError(error, "Impossible de récupérer les documents fiscaux expirants");
    return [];
  }
};
