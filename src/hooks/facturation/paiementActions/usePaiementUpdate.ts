
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/paiement";
import { recalculerStatutPaiementFacture } from "@/services/factureServices/facturePaiementSyncService";

export const usePaiementUpdate = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updatePaiement = async (id: string, updates: Partial<Paiement>) => {
    setIsLoading(true);
    try {
      const { data: avant } = await supabase
        .from("paiements")
        .select("facture_id")
        .eq("id", id)
        .maybeSingle();

      const { data, error } = await supabase
        .from("paiements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Recalculer l'état de la facture d'origine et, si le paiement a été
      // rattaché à une autre facture, celui de la nouvelle.
      await recalculerStatutPaiementFacture(avant?.facture_id);
      if (data?.facture_id && data.facture_id !== avant?.facture_id) {
        await recalculerStatutPaiementFacture(data.facture_id);
      }

      toast({
        title: "Paiement mis à jour",
        description: `Le paiement a été mis à jour avec succès.`,
      });

      return data;
    } catch (error) {
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
