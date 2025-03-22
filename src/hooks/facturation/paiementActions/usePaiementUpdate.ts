
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/paiement";

export const usePaiementUpdate = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updatePaiement = async (id: string, updates: Partial<Paiement>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("paiements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Paiement mis à jour",
        description: `Le paiement a été mis à jour avec succès.`,
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement. Veuillez réessayer.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePaiement,
    isLoading
  };
};
