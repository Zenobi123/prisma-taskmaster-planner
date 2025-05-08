
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/employee";

export const getEmployeesByClient = async (clientId: string): Promise<Employee[]> => {
  try {
    const { data, error } = await supabase
      .from("employes")
      .select("*")
      .eq("client_id", clientId)
      .order('nom', { ascending: true });

    if (error) throw error;
    return data as Employee[];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

export const getEmployeeById = async (employeeId: string): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from("employes")
      .select("*")
      .eq("id", employeeId)
      .single();

    if (error) throw error;
    return data as Employee;
  } catch (error) {
    console.error("Error fetching employee:", error);
    return null;
  }
};

export const createEmployee = async (employee: Omit<Employee, "id" | "created_at" | "updated_at">): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from("employes")
      .insert(employee)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  } catch (error) {
    console.error("Error creating employee:", error);
    return null;
  }
};

export const updateEmployee = async (employeeId: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from("employes")
      .update(employeeData)
      .eq("id", employeeId)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  } catch (error) {
    console.error("Error updating employee:", error);
    return null;
  }
};

export const deleteEmployee = async (employeeId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("employes")
      .delete()
      .eq("id", employeeId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return false;
  }
};

export const bulkCreateEmployees = async (employees: Omit<Employee, "id" | "created_at" | "updated_at">[]): Promise<Employee[] | null> => {
  try {
    if (!employees.length) return [];
    
    const { data, error } = await supabase
      .from("employes")
      .insert(employees)
      .select();

    if (error) throw error;
    return data as Employee[];
  } catch (error) {
    console.error("Error bulk creating employees:", error);
    return null;
  }
};
