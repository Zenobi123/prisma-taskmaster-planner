
import { supabase } from "@/integrations/supabase/client";
import { Employe, Paie, PaieStatut } from "@/types/paie";
import { PayrollCalculator } from "@/components/gestion/tabs/paie/PayrollCalculator";

/**
 * Service pour la gestion des données de paie
 */
export const paieService = {
  /**
   * Récupère la liste des employés d'un client
   * @param clientId Identifiant du client
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
      
      return data as Employe[];
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
      
      return data as Employe;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'employé:", error);
      return null;
    }
  },
  
  /**
   * Récupère la liste des paies d'un client pour un mois et une année donnés
   */
  async getPayrollsByClientId(clientId: string, month?: number, year?: number): Promise<Paie[]> {
    try {
      let query = supabase
        .from("paies")
        .select("*")
        .eq("client_id", clientId);
      
      if (month !== undefined) {
        query = query.eq("mois", month);
      }
      
      if (year !== undefined) {
        query = query.eq("annee", year);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Paie[];
    } catch (error) {
      console.error("Erreur lors de la récupération des paies:", error);
      return [];
    }
  },
  
  /**
   * Récupère la liste des paies d'un employé
   */
  async getPayrollsByEmployeeId(employeeId: string): Promise<Paie[]> {
    try {
      const { data, error } = await supabase
        .from("paies")
        .select("*")
        .eq("employe_id", employeeId)
        .order("created_at", { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as Paie[];
    } catch (error) {
      console.error("Erreur lors de la récupération des paies de l'employé:", error);
      return [];
    }
  },
  
  /**
   * Crée une nouvelle fiche de paie
   */
  async createPayroll(payroll: Omit<Paie, "id" | "created_at" | "updated_at">): Promise<Paie | null> {
    try {
      const { data, error } = await supabase
        .from("paies")
        .insert([payroll])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Paie;
    } catch (error) {
      console.error("Erreur lors de la création de la fiche de paie:", error);
      return null;
    }
  },
  
  /**
   * Met à jour une fiche de paie
   */
  async updatePayroll(payrollId: string, payroll: Partial<Paie>): Promise<Paie | null> {
    try {
      const { data, error } = await supabase
        .from("paies")
        .update(payroll)
        .eq("id", payrollId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Paie;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la fiche de paie:", error);
      return null;
    }
  },
  
  /**
   * Supprime une fiche de paie
   */
  async deletePayroll(payrollId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("paies")
        .delete()
        .eq("id", payrollId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la fiche de paie:", error);
      return false;
    }
  },
  
  /**
   * Change le statut d'une fiche de paie
   */
  async changePayrollStatus(payrollId: string, status: PaieStatut): Promise<Paie | null> {
    try {
      const { data, error } = await supabase
        .from("paies")
        .update({ statut: status })
        .eq("id", payrollId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Paie;
    } catch (error) {
      console.error("Erreur lors du changement de statut de la fiche de paie:", error);
      return null;
    }
  },
  
  /**
   * Calcule les cotisations d'un salarié
   */
  calculateEmployeeDeductions(grossSalary: number) {
    return {
      cnps: PayrollCalculator.calculateCNPSEmployee(grossSalary),
      irpp: PayrollCalculator.calculateIRPP(grossSalary),
      cac: PayrollCalculator.calculateCAC(PayrollCalculator.calculateIRPP(grossSalary)),
      tdl: PayrollCalculator.calculateTDL(grossSalary),
      rav: PayrollCalculator.calculateRAV(grossSalary),
      cfc: PayrollCalculator.calculateCFCEmployee(grossSalary)
    };
  },
  
  /**
   * Calcule les charges patronales
   */
  calculateEmployerCharges(grossSalary: number, risk: 'faible' | 'moyen' | 'eleve' = 'moyen') {
    return {
      cnps: PayrollCalculator.calculateCNPSEmployer(grossSalary, risk),
      fne: PayrollCalculator.calculateFNE(grossSalary),
      cfc: PayrollCalculator.calculateCFCEmployer(grossSalary)
    };
  },
  
  /**
   * Calcule le salaire net
   */
  calculateNetSalary(grossSalary: number): number {
    return PayrollCalculator.calculateNetSalary(grossSalary);
  }
};
