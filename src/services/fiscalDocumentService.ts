
import { supabase } from "@/integrations/supabase/client";
import { FiscalDocument } from "@/components/gestion/tabs/fiscale/types";
import { Client } from "@/types/client";

// Fonction pour enregistrer un document fiscal dans Supabase
export const saveFiscalDocument = async (newDoc: Omit<FiscalDocument, "id">, clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('fiscal_documents')
      .insert({
        name: newDoc.name,
        description: newDoc.description,
        created_at: new Date().toISOString(),
        valid_until: newDoc.validUntil ? newDoc.validUntil.toISOString() : null,
        client_id: clientId
      })
      .select()
      .single();

    if (error) throw error;
    
    // Convertir le document de la base de données au format utilisé par l'UI
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: new Date(data.created_at),
      validUntil: data.valid_until ? new Date(data.valid_until) : null
    };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du document fiscal:", error);
    throw error;
  }
};

// Fonction pour récupérer les documents fiscaux d'un client
export const getClientFiscalDocuments = async (clientId: string): Promise<FiscalDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('fiscal_documents')
      .select('*')
      .eq('client_id', clientId);

    if (error) throw error;
    
    // Convertir les documents de la base de données au format utilisé par l'UI
    return data.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      description: doc.description,
      createdAt: new Date(doc.created_at),
      validUntil: doc.valid_until ? new Date(doc.valid_until) : null
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des documents fiscaux:", error);
    return [];
  }
};

// Fonction pour récupérer tous les documents fiscaux qui expirent bientôt
export const getExpiringDocuments = async (): Promise<Array<{clientName: string, document: FiscalDocument, clientId: string}>> => {
  try {
    // Récupérer les documents qui expirent dans les 30 prochains jours ou qui sont déjà expirés mais depuis moins de 30 jours
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const thirtyDaysBefore = new Date(today);
    thirtyDaysBefore.setDate(today.getDate() - 30);
    
    // Requête pour récupérer les documents avec leurs informations client
    const { data, error } = await supabase
      .from('fiscal_documents')
      .select(`
        *,
        clients:client_id (
          id,
          nom,
          raisonsociale,
          type
        )
      `)
      .gte('valid_until', thirtyDaysBefore.toISOString())
      .lte('valid_until', thirtyDaysLater.toISOString());

    if (error) throw error;
    
    // Formater les données pour l'affichage
    return data.map((item: any) => ({
      clientId: item.clients.id,
      clientName: item.clients.type === 'physique' ? item.clients.nom : item.clients.raisonsociale,
      document: {
        id: item.id,
        name: item.name,
        description: item.description,
        createdAt: new Date(item.created_at),
        validUntil: item.valid_until ? new Date(item.valid_until) : null
      }
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des documents expirants:", error);
    return [];
  }
};
