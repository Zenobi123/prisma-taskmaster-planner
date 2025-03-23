
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UsePaiementFacturesProps {
  setValue: any;
  setSelectedClientId: (id: string | null) => void;
  setSelectedFactureId: (id: string | null) => void;
}

export const usePaiementFactures = ({ 
  setValue, 
  setSelectedClientId, 
  setSelectedFactureId 
}: UsePaiementFacturesProps) => {
  const { toast } = useToast();

  const handleClientChange = (clientId: string) => {
    setValue("client_id", clientId);
    setSelectedClientId(clientId);
    setValue("facture_id", "");
    setSelectedFactureId(null);
  };

  const handleFactureChange = (factureId: string) => {
    setValue("facture_id", factureId);
    setSelectedFactureId(factureId);
    // Calcul automatique du montant total de la facture
    supabase
      .from("factures")
      .select("*")
      .eq("id", factureId)
      .single()
      .then(({ data }) => {
        if (data) {
          const montantRestant = data.montant - (data.montant_paye || 0);
          setValue("montant", montantRestant);
        }
      });
  };

  return {
    handleClientChange,
    handleFactureChange
  };
};
