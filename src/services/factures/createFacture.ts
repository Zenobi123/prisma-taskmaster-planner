
import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation, FactureDB, convertToFacture } from "@/types/facture";
import { Json } from "@/integrations/supabase/types";
import { generateFactureId, prepareFactureForDb } from "./utils";

export const createFacture = async (data: {
  clientId: string;
  clientNom?: string;
  clientAdresse?: string;
  clientTelephone?: string;
  clientEmail?: string;
  dateEmission: string;
  dateEcheance: string;
  prestations: Prestation[];
  notes?: string;
}) => {
  try {
    const factureId = generateFactureId();
    
    // Si les données client ne sont pas fournies directement, les récupérer
    let clientData = {
      nom: data.clientNom,
      adresse: data.clientAdresse,
      telephone: data.clientTelephone,
      email: data.clientEmail
    };
    
    if (!data.clientNom || !data.clientAdresse || !data.clientTelephone || !data.clientEmail) {
      // Récupérer les informations du client si elles ne sont pas fournies
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('nom, raisonsociale, adresse, contact')
        .eq('id', data.clientId)
        .single();
      
      if (clientError) {
        console.error("Erreur lors de la récupération des informations client:", clientError);
        throw clientError;
      }
      
      // Préparer les données client
      clientData = {
        nom: client.type === 'physique' ? client.nom : client.raisonsociale,
        adresse: client.adresse?.adresse || '',
        telephone: client.contact?.telephone || '',
        email: client.contact?.email || ''
      };
    }
    
    // Calculer le montant total
    const montantTotal = data.prestations.reduce((sum, item) => {
      return sum + (item.montant || 0);
    }, 0);

    const newFacture = {
      id: factureId,
      client_id: data.clientId,
      client_nom: clientData.nom || '',
      client_adresse: clientData.adresse || '',
      client_telephone: clientData.telephone || '',
      client_email: clientData.email || '',
      date: data.dateEmission,
      echeance: data.dateEcheance,
      prestations: data.prestations as unknown as Json,
      montant: montantTotal,
      status: 'en_attente',
      notes: data.notes || null
    };

    const { data: result, error } = await supabase
      .from('factures')
      .insert(prepareFactureForDb(newFacture))
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la facture:", error);
      throw error;
    }

    return convertToFacture(result as unknown as FactureDB);
  } catch (error) {
    console.error("Erreur dans createFacture:", error);
    throw error;
  }
};
