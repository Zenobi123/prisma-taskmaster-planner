import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

interface UsePaiementTypeProps {
  setValue: any;
  selectedPrestations: string[];
  selectedFactureId: string | null;
}

export const usePaiementType = ({ setValue, selectedPrestations, selectedFactureId }: UsePaiementTypeProps) => {
  const { toast } = useToast();
  const [prestationAmounts, setPrestationAmounts] = useState<Record<string, number>>({});
  const [originalPrestationAmounts, setOriginalPrestationAmounts] = useState<Record<string, number>>({});
  
  // When the selected facture changes, reset the prestation amounts
  useEffect(() => {
    setPrestationAmounts({});
    setOriginalPrestationAmounts({});
  }, [selectedFactureId]);

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
      setValue("prestations_payees", []);
      setPrestationAmounts({});
    }
  };

  const handlePrestationChange = (id: string, checked: boolean) => {
    console.log(`Prestation ${id} ${checked ? 'selected' : 'unselected'}`);
    
    let updatedPrestations = [...selectedPrestations];
    
    if (checked) {
      if (!updatedPrestations.includes(id)) {
        updatedPrestations.push(id);
      }
    } else {
      updatedPrestations = updatedPrestations.filter(p => p !== id);
      // Remove from prestationAmounts if unchecked
      const newPrestationAmounts = { ...prestationAmounts };
      delete newPrestationAmounts[id];
      setPrestationAmounts(newPrestationAmounts);
    }
    
    setValue("prestations_payees", updatedPrestations);
    
    // Use setTimeout to allow React to update the state before calculation
    setTimeout(() => {
      updateTotalAmount(updatedPrestations);
    }, 0);
  };

  const handlePrestationAmountChange = (id: string, amount: number) => {
    console.log(`Changing amount for prestation ${id} to ${amount}`);
    const newAmounts = { ...prestationAmounts, [id]: amount };
    setPrestationAmounts(newAmounts);
    
    // Use setTimeout to allow React to update the state before calculation
    setTimeout(() => {
      updateTotalAmount(selectedPrestations, newAmounts);
    }, 0);
  };
  
  const loadPrestationData = async (prestationIds: string[]) => {
    if (prestationIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from("prestations")
        .select("*")
        .in("id", prestationIds);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const amounts: Record<string, number> = {};
        data.forEach(p => {
          amounts[p.id] = Number(p.montant);
        });
        
        console.log("Original prestation amounts loaded:", amounts);
        setOriginalPrestationAmounts(amounts);
        
        // Initialize prestationAmounts with original amounts if not already set
        const newPrestationAmounts = { ...prestationAmounts };
        data.forEach(p => {
          if (!newPrestationAmounts[p.id]) {
            newPrestationAmounts[p.id] = Number(p.montant);
          }
        });
        setPrestationAmounts(newPrestationAmounts);
        
        // Update total amount now that we have the data
        updateTotalAmount(prestationIds, newPrestationAmounts);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données de prestation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails des prestations"
      });
    }
  };
  
  const updateTotalAmount = (prestationIds: string[], customAmounts?: Record<string, number>) => {
    if (prestationIds.length === 0) {
      setValue("montant", 0);
      return;
    }
    
    const amountsToUse = customAmounts || prestationAmounts;
    
    // Log for debugging
    console.log("Updating total amount with prestations:", prestationIds);
    console.log("Using amounts:", amountsToUse);
    
    // If we have all the necessary prestation amounts
    if (prestationIds.every(id => id in amountsToUse)) {
      const total = prestationIds.reduce((sum, id) => sum + amountsToUse[id], 0);
      console.log("Calculated total amount:", total);
      setValue("montant", total);
    } else {
      // Otherwise, fetch the missing data
      console.log("Missing prestation data, fetching...");
      loadPrestationData(prestationIds);
    }
  };

  // When selectedPrestations changes, ensure we have all the needed amount data
  useEffect(() => {
    if (selectedPrestations.length > 0) {
      const missingPrestations = selectedPrestations.filter(
        id => !(id in originalPrestationAmounts)
      );
      
      if (missingPrestations.length > 0) {
        loadPrestationData(missingPrestations);
      } else {
        // Update total even if we have all data
        updateTotalAmount(selectedPrestations);
      }
    }
  }, [selectedPrestations]);

  return {
    handleTypePaiementChange,
    handlePrestationChange,
    handlePrestationAmountChange,
    prestationAmounts,
    originalPrestationAmounts
  };
};
