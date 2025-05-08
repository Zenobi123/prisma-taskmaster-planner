
import { supabase } from "@/integrations/supabase/client";
import { Paie } from "@/types/paie";
import { Employee } from "@/types/employee";

export const getPaieForEmployee = async (employeeId: string): Promise<Paie[]> => {
  try {
    const { data, error } = await supabase
      .from("paie")
      .select("*")
      .eq("employe_id", employeeId)
      .order('annee', { ascending: false })
      .order('mois', { ascending: false });

    if (error) {
      console.error("Error fetching payroll data:", error);
      throw new Error(error.message);
    }

    return data as Paie[];
  } catch (error) {
    console.error("Error in getPaieForEmployee:", error);
    return [];
  }
};

export const savePaie = async (paieData: Paie): Promise<Paie | null> => {
  try {
    const { data, error } = await supabase
      .from("paie")
      .upsert(paieData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error("Error saving payroll data:", error);
      throw new Error(error.message);
    }

    return data as Paie;
  } catch (error) {
    console.error("Error in savePaie:", error);
    return null;
  }
};

export const deletePaie = async (paieId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("paie")
      .delete()
      .eq("id", paieId);

    if (error) {
      console.error("Error deleting payroll:", error);
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error in deletePaie:", error);
    return false;
  }
};

export const getPayrollByMonthAndYear = async (
  employeeId: string, 
  month: number, 
  year: number
): Promise<Paie | null> => {
  try {
    const { data, error } = await supabase
      .from("paie")
      .select("*")
      .eq("employe_id", employeeId)
      .eq("mois", month)
      .eq("annee", year)
      .maybeSingle();

    if (error) {
      console.error("Error fetching payroll data:", error);
      throw new Error(error.message);
    }

    return data as Paie;
  } catch (error) {
    console.error("Error in getPayrollByMonthAndYear:", error);
    return null;
  }
};
