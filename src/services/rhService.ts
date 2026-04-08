
import { supabase } from "@/integrations/supabase/client";
import { Employee, Genre, ContratType } from "@/types/employee";

export const rhService = {
  async getEmployeesByClient(clientId: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employes')
      .select('*')
      .eq('client_id', clientId)
      .order('nom', { ascending: true });
    
    if (error) {
      return [];
    }
    
    return data as Employee[];
  },
  
  async getEmployee(employeeId: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employes')
      .select('*')
      .eq('id', employeeId)
      .single();
    
    if (error) {
      return null;
    }
    
    return data as Employee;
  },
  
  async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employes')
      .insert(employeeData)
      .select()
      .single();
    
    if (error) {
      return null;
    }
    
    return data as Employee;
  },
  
  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employes')
      .update(employeeData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return null;
    }
    
    return data as Employee;
  },
  
  async bulkCreateEmployees(employeesData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    const { error } = await supabase
      .from('employes')
      .insert(employeesData);
    
    if (error) {
      return false;
    }
    
    return true;
  },
  
  async deleteEmployee(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('employes')
      .delete()
      .eq('id', id);
    
    if (error) {
      return false;
    }
    
    return true;
  }
};
