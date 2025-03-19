
import { supabase } from "@/integrations/supabase/client";

export const deleteFacture = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("factures")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    throw new Error(error.message);
  }
};
