
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UsePaiementTypeProps {
  setValue: any;
  selectedPrestations: string[];
  selectedFactureId: string | null;
}

export const usePaiementType = ({ setValue, selectedPrestations, selectedFactureId }: UsePaiementTypeProps) => {
  const { toast } = useToast();

  const handleTypePaiementChange = (value: "total" | "partiel") => {
    setValue("type_paiement", value);
    
    // Si on passe de partiel à total, on vide les prestations sélectionnées
    if (value === "total") {
      setValue("prestations_payees", []);
      
      // Pour un paiement total, on utilise le montant de la facture complète
      if (selectedFactureId) {
        supabase
          .from("factures")
          .select("montant, montant_paye")
          .eq("id", selectedFactureId)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Erreur lors de la récupération du montant total:", error);
              return;
            }
            
            if (data) {
              const montantRestant = Number(data.montant) - Number(data.montant_paye || 0);
              setValue("montant", montantRestant);
              console.log("Montant total de la facture:", montantRestant);
            }
          });
      }
    } else if (value === "partiel") {
      // Réinitialiser le montant à 0 pour le paiement partiel initialement
      setValue("montant", 0);
    }
  };

  const handlePrestationChange = (id: string, checked: boolean) => {
    let updatedPrestations = [...selectedPrestations];
    
    if (checked) {
      updatedPrestations.push(id);
    } else {
      updatedPrestations = updatedPrestations.filter(p => p !== id);
    }
    
    setValue("prestations_payees", updatedPrestations);
    
    // Si on a sélectionné des prestations, on ajuste le montant
    if (updatedPrestations.length > 0) {
      supabase
        .from("prestations")
        .select("*")
        .in("id", updatedPrestations)
        .then(({ data, error }) => {
          if (error) {
            console.error("Erreur lors du calcul du montant:", error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de calculer le montant des prestations sélectionnées"
            });
            return;
          }
          
          if (data) {
            const montantTotal = data.reduce((sum, p) => sum + Number(p.montant), 0);
            setValue("montant", montantTotal);
            console.log("Montant total calculé:", montantTotal, "pour", data.length, "prestations");
          }
        });
    } else {
      // Si aucune prestation n'est sélectionnée, on remet le montant à 0
      setValue("montant", 0);
    }
  };

  return {
    handleTypePaiementChange,
    handlePrestationChange
  };
};
