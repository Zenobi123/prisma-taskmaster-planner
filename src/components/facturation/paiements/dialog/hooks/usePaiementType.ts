
import { supabase } from "@/integrations/supabase/client";

interface UsePaiementTypeProps {
  setValue: any;
  selectedPrestations: string[];
}

export const usePaiementType = ({ setValue, selectedPrestations }: UsePaiementTypeProps) => {
  const handleTypePaiementChange = (value: "total" | "partiel") => {
    setValue("type_paiement", value);
    // Si on passe de partiel à total, on vide les prestations sélectionnées
    if (value === "total") {
      setValue("prestations_payees", []);
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
        .then(({ data }) => {
          if (data) {
            const montantTotal = data.reduce((sum, p) => sum + Number(p.montant), 0);
            setValue("montant", montantTotal);
          }
        });
    }
  };

  return {
    handleTypePaiementChange,
    handlePrestationChange
  };
};
