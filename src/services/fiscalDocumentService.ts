
import { supabase } from "@/integrations/supabase/client";
import { FiscalDocument } from "@/components/gestion/tabs/fiscale/types";
import { toast } from "@/hooks/use-toast";

export interface FiscalDocumentInput {
  name: string;
  description?: string;
  client_id: string;
  valid_until?: Date | null;
}

/**
 * Récupère les documents fiscaux d'un client
 * @param clientId L'identifiant du client
 * @returns Une liste de documents fiscaux
 */
export const getFiscalDocuments = async (clientId: string) => {
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
    
    return data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || "",
      createdAt: new Date(doc.created_at),
      validUntil: doc.valid_until ? new Date(doc.valid_until) : null,
      client_id: doc.client_id
    })) as FiscalDocument[];
  } catch (error) {
    console.error("Exception lors de la récupération des documents fiscaux:", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les documents fiscaux",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Récupère les documents fiscaux qui expirent bientôt
 * @param daysThreshold Nombre de jours avant expiration (défaut: 30)
 * @returns Une liste de documents fiscaux avec informations client
 */
export const getExpiringFiscalDocuments = async (daysThreshold = 30) => {
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
    return data;
  } catch (error) {
    console.error("Exception lors de la récupération des documents fiscaux expirants:", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les documents fiscaux expirants",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Ajoute un document fiscal
 * @param document Les données du document à ajouter
 * @returns Le document ajouté
 */
export const addFiscalDocument = async (document: FiscalDocumentInput) => {
  try {
    console.log("Ajout d'un document fiscal:", document);
    
    // Validation des données
    if (!document.name || !document.client_id) {
      throw new Error("Le nom du document et l'ID du client sont obligatoires");
    }
    
    const docToInsert = {
      name: document.name,
      description: document.description || null,
      client_id: document.client_id,
      valid_until: document.valid_until ? document.valid_until.toISOString() : null
    };
    
    const { data, error } = await supabase
      .from("fiscal_documents")
      .insert([docToInsert])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du document fiscal:", error);
      throw error;
    }

    console.log("Document fiscal ajouté avec succès:", data);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      createdAt: new Date(data.created_at),
      validUntil: data.valid_until ? new Date(data.valid_until) : null,
      client_id: data.client_id
    } as FiscalDocument;
  } catch (error) {
    console.error("Exception lors de l'ajout du document fiscal:", error);
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Impossible d'ajouter le document fiscal",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Met à jour un document fiscal
 * @param id L'identifiant du document
 * @param document Les données du document à mettre à jour
 * @returns Le document mis à jour
 */
export const updateFiscalDocument = async (id: string, document: Partial<FiscalDocumentInput>) => {
  try {
    console.log("Mise à jour du document fiscal:", { id, document });
    
    const docToUpdate: Record<string, any> = {};
    
    if (document.name !== undefined) docToUpdate.name = document.name;
    if (document.description !== undefined) docToUpdate.description = document.description;
    if (document.valid_until !== undefined) {
      docToUpdate.valid_until = document.valid_until ? document.valid_until.toISOString() : null;
    }
    
    const { data, error } = await supabase
      .from("fiscal_documents")
      .update(docToUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du document fiscal:", error);
      throw error;
    }

    console.log("Document fiscal mis à jour avec succès:", data);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      createdAt: new Date(data.created_at),
      validUntil: data.valid_until ? new Date(data.valid_until) : null,
      client_id: data.client_id
    } as FiscalDocument;
  } catch (error) {
    console.error("Exception lors de la mise à jour du document fiscal:", error);
    toast({
      title: "Erreur",
      description: "Impossible de mettre à jour le document fiscal",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Supprime un document fiscal
 * @param id L'identifiant du document à supprimer
 * @returns true si le document a été supprimé
 */
export const deleteFiscalDocument = async (id: string) => {
  try {
    console.log("Suppression du document fiscal:", id);
    
    const { error } = await supabase
      .from("fiscal_documents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression du document fiscal:", error);
      throw error;
    }

    console.log("Document fiscal supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Exception lors de la suppression du document fiscal:", error);
    toast({
      title: "Erreur",
      description: "Impossible de supprimer le document fiscal",
      variant: "destructive",
    });
    throw error;
  }
};
