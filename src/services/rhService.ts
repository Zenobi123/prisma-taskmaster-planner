
import { supabase } from "@/integrations/supabase/client";
import { Employe, Genre, ContratType } from "@/types/paie";

/**
 * Service pour la gestion des données RH
 */
export const rhService = {
  /**
   * Récupère la liste des employés d'un client
   */
  async getEmployesByClientId(clientId: string): Promise<Employe[]> {
    try {
      const { data, error } = await supabase
        .from("employes")
        .select("*")
        .eq("client_id", clientId);
        
      if (error) {
        throw error;
      }
      
      // Vérifier et convertir les types
      return (data || []).map(emp => ({
        ...emp,
        genre: (emp.genre as Genre) || "Homme",
        type_contrat: (emp.type_contrat as ContratType) || "CDI"
      })) as Employe[];
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      return [];
    }
  },
  
  /**
   * Récupère un employé par son ID
   */
  async getEmployeeById(employeeId: string): Promise<Employe | null> {
    try {
      const { data, error } = await supabase
        .from("employes")
        .select("*")
        .eq("id", employeeId)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Vérifier et convertir les types
      return {
        ...data,
        genre: (data.genre as Genre) || "Homme",
        type_contrat: (data.type_contrat as ContratType) || "CDI"
      } as Employe;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'employé:", error);
      return null;
    }
  },
  
  /**
   * Crée un nouvel employé
   */
  async createEmployee(employee: Omit<Employe, "id" | "created_at" | "updated_at">): Promise<Employe | null> {
    try {
      const { data, error } = await supabase
        .from("employes")
        .insert([employee])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        ...data,
        genre: (data.genre as Genre) || "Homme",
        type_contrat: (data.type_contrat as ContratType) || "CDI"
      } as Employe;
    } catch (error) {
      console.error("Erreur lors de la création de l'employé:", error);
      return null;
    }
  },
  
  /**
   * Met à jour un employé
   */
  async updateEmployee(employeeId: string, employee: Partial<Employe>): Promise<Employe | null> {
    try {
      const { data, error } = await supabase
        .from("employes")
        .update(employee)
        .eq("id", employeeId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        ...data,
        genre: (data.genre as Genre) || "Homme",
        type_contrat: (data.type_contrat as ContratType) || "CDI"
      } as Employe;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'employé:", error);
      return null;
    }
  },
  
  /**
   * Supprime un employé
   */
  async deleteEmployee(employeeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("employes")
        .delete()
        .eq("id", employeeId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      return false;
    }
  },
  
  /**
   * Compte le nombre d'employés par département
   */
  async countEmployeesByDepartment(clientId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from("employes")
        .select("departement")
        .eq("client_id", clientId);
        
      if (error) {
        throw error;
      }
      
      const departments: Record<string, number> = {};
      
      data.forEach(emp => {
        const dept = emp.departement || "Non défini";
        departments[dept] = (departments[dept] || 0) + 1;
      });
      
      return departments;
    } catch (error) {
      console.error("Erreur lors du comptage des employés par département:", error);
      return {};
    }
  },
  
  /**
   * Compte le nombre d'employés par type de contrat
   */
  async countEmployeesByContractType(clientId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from("employes")
        .select("type_contrat")
        .eq("client_id", clientId);
        
      if (error) {
        throw error;
      }
      
      const contracts: Record<string, number> = {
        CDI: 0,
        CDD: 0,
        Stage: 0,
        Prestation: 0
      };
      
      data.forEach(emp => {
        const type = emp.type_contrat as ContratType || "CDI";
        contracts[type] = (contracts[type] || 0) + 1;
      });
      
      return contracts;
    } catch (error) {
      console.error("Erreur lors du comptage des employés par type de contrat:", error);
      return {
        CDI: 0,
        CDD: 0,
        Stage: 0,
        Prestation: 0
      };
    }
  }
};
