
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePaiementDelete = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deletePaiement = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("paiements")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Paiement supprimé",
        description: `Le paiement a été supprimé avec succès.`,
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le paiement. Veuillez réessayer.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deletePaiement,
    isLoading
  };
};
