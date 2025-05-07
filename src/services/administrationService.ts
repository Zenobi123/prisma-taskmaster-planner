
import { supabase } from "@/integrations/supabase/client";

/**
 * Types pour les données administratives
 */
interface Document {
  id: string;
  client_id: string;
  nom: string;
  type: string;
  categorie: string;
  date_emission: string | null;
  date_expiration: string | null;
  fichier_url: string | null;
  observations: string | null;
  created_at: string;
  updated_at: string;
}

interface Procedure {
  id: string;
  client_id: string;
  nom: string;
  description: string | null;
  date_debut: string | null;
  date_fin: string | null;
  statut: string;
  responsable: string | null;
  observations: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Service pour la gestion des données administratives
 */
export const administrationService = {
  /**
   * Récupère les documents administratifs d'un client
   */
  async getDocumentsByClientId(clientId: string, category?: string): Promise<Document[]> {
    try {
      let query = supabase
        .from("documents")
        .select("*")
        .eq("client_id", clientId);
        
      if (category) {
        query = query.eq("categorie", category);
      }
      
      const { data, error } = await query.order("date_emission", { ascending: false });
      
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
        .from("documents")
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
        .from("documents")
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
        .from("documents")
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
        .from("documents")
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
   * Récupère les procédures administratives d'un client
   */
  async getProceduresByClientId(clientId: string): Promise<Procedure[]> {
    try {
      const { data, error } = await supabase
        .from("procedures")
        .select("*")
        .eq("client_id", clientId)
        .order("date_debut", { ascending: false });
        
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
        .from("procedures")
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
        .from("procedures")
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
        .from("procedures")
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
        .from("procedures")
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

export type { Document, Procedure };
