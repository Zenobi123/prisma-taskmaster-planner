
import { supabase } from "@/integrations/supabase/client";
import { FiscalDocument } from "@/components/gestion/tabs/fiscale/types";
import { toast } from "@/hooks/use-toast";
import { mapToFiscalDocument, handleServiceError } from "./fiscalDocumentUtils";

export interface FiscalDocumentInput {
  name: string;
  description?: string | null;
  client_id: string;
  valid_until?: Date | null;
}

/**
 * Ajoute un document fiscal
 * @param document Les données du document à ajouter
 * @returns Le document ajouté
 */
export const addFiscalDocument = async (document: FiscalDocumentInput): Promise<FiscalDocument> => {
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
    
    return mapToFiscalDocument(data);
  } catch (error) {
    handleServiceError(error, "Impossible d'ajouter le document fiscal");
    throw error;
  }
};

/**
 * Met à jour un document fiscal
 * @param id L'identifiant du document
 * @param document Les données du document à mettre à jour
 * @returns Le document mis à jour
 */
export const updateFiscalDocument = async (id: string, document: Partial<FiscalDocumentInput>): Promise<FiscalDocument> => {
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
    
    return mapToFiscalDocument(data);
  } catch (error) {
    handleServiceError(error, "Impossible de mettre à jour le document fiscal");
    throw error;
  }
};

/**
 * Supprime un document fiscal
 * @param id L'identifiant du document à supprimer
 * @returns true si le document a été supprimé
 */
export const deleteFiscalDocument = async (id: string): Promise<boolean> => {
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
    handleServiceError(error, "Impossible de supprimer le document fiscal");
    throw error;
  }
};
