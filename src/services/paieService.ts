
import { supabase } from "@/integrations/supabase/client";
import { Employee, Paie } from "@/types/paie";

export const paieService = {
  async getEmployeePayrolls(employeeId: string): Promise<Paie[]> {
    const { data, error } = await supabase
      .from('paie')
      .select('*')
      .eq('employe_id', employeeId)
      .order('annee', { ascending: false })
      .order('mois', { ascending: false });
    
    if (error) {
      return [];
    }
    
    return data as Paie[];
  },
  
  async createPayroll(payrollData: Omit<Paie, 'id' | 'created_at' | 'updated_at'>): Promise<Paie | null> {
    const { data, error } = await supabase
      .from('paie')
      .insert(payrollData)
      .select()
      .single();
    
    if (error) {
      return null;
    }
    
    return data as Paie;
  },
  
  async updatePayroll(id: string, payrollData: Partial<Paie>): Promise<Paie | null> {
    const { data, error } = await supabase
      .from('paie')
      .update(payrollData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return null;
    }
    
    return data as Paie;
  },
  
  async deletePayroll(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('paie')
      .delete()
      .eq('id', id);
    
    if (error) {
      return false;
    }
    
    return true;
  }
};
