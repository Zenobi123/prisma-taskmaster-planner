
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { recalculerStatutPaiementFacture } from "@/services/factureServices/facturePaiementSyncService";

export const usePaiementDelete = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deletePaiement = async (id: string) => {
    setIsLoading(true);
    try {
      // Conserver la facture liée pour recalculer son état après suppression.
      const { data: paiement } = await supabase
        .from("paiements")
        .select("facture_id")
        .eq("id", id)
        .maybeSingle();

      const { error } = await supabase
        .from("paiements")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      await recalculerStatutPaiementFacture(paiement?.facture_id);

      toast({
        title: "Paiement supprimé",
        description: `Le paiement a été supprimé avec succès.`,
      });

      return true;
    } catch (error) {
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
