
import { supabase } from "@/integrations/supabase/client";
import { Document, Procedure, ProcedureStatut, DocumentStatut } from "@/types/administration";

/**
 * Service pour la gestion des données administratives
 */
export const administrationService = {
  /**
   * Récupère la liste des documents administratifs d'un client
   */
  async getDocumentsByClientId(clientId: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .select("*")
        .eq("client_id", clientId);
        
      if (error) {
        throw error;
      }
      
      return data as Document[];
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
      return [];
    }
  },
  
  /**
   * Récupère un document par son ID
   */
  async getDocumentById(documentId: string): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .select("*")
        .eq("id", documentId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as Document;
    } catch (error) {
      console.error("Erreur lors de la récupération du document:", error);
      return null;
    }
  },
  
  /**
   * Crée un nouveau document
   */
  async createDocument(document: Omit<Document, "id" | "created_at" | "updated_at">): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .insert([document])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Document;
    } catch (error) {
      console.error("Erreur lors de la création du document:", error);
      return null;
    }
  },
  
  /**
   * Met à jour un document
   */
  async updateDocument(documentId: string, document: Partial<Document>): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .update(document)
        .eq("id", documentId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Document;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du document:", error);
      return null;
    }
  },
  
  /**
   * Supprime un document
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("documents_administratifs")
        .delete()
        .eq("id", documentId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      return false;
    }
  },
  
  /**
   * Récupère la liste des procédures administratives d'un client
   */
  async getProceduresByClientId(clientId: string): Promise<Procedure[]> {
    try {
      const { data, error } = await supabase
        .from("procedures_administratives")
        .select("*")
        .eq("client_id", clientId);
        
      if (error) {
        throw error;
      }
      
      return data as Procedure[];
    } catch (error) {
      console.error("Erreur lors de la récupération des procédures:", error);
      return [];
    }
  },
  
  /**
   * Récupère une procédure par son ID
   */
  async getProcedureById(procedureId: string): Promise<Procedure | null> {
    try {
      const { data, error } = await supabase
        .from("procedures_administratives")
        .select("*")
        .eq("id", procedureId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as Procedure;
    } catch (error) {
      console.error("Erreur lors de la récupération de la procédure:", error);
      return null;
    }
  },
  
  /**
   * Crée une nouvelle procédure
   */
  async createProcedure(procedure: Omit<Procedure, "id" | "created_at" | "updated_at">): Promise<Procedure | null> {
    try {
      const { data, error } = await supabase
        .from("procedures_administratives")
        .insert([procedure])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Procedure;
    } catch (error) {
      console.error("Erreur lors de la création de la procédure:", error);
      return null;
    }
  },
  
  /**
   * Met à jour une procédure
   */
  async updateProcedure(procedureId: string, procedure: Partial<Procedure>): Promise<Procedure | null> {
    try {
      const { data, error } = await supabase
        .from("procedures_administratives")
        .update(procedure)
        .eq("id", procedureId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Procedure;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la procédure:", error);
      return null;
    }
  },
  
  /**
   * Supprime une procédure
   */
  async deleteProcedure(procedureId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("procedures_administratives")
        .delete()
        .eq("id", procedureId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la procédure:", error);
      return false;
    }
  }
};
