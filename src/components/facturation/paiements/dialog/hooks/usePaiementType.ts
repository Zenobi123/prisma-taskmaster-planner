
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
    
    // Immédiatement mettre à jour les prestations sélectionnées
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
    
    // Mettre à jour le formulaire immédiatement
    setValue("prestations_payees", updatedPrestations);
    
    // Mettre à jour immédiatement le montant total
    if (checked) {
      // Si on a déjà le montant dans originalPrestationAmounts, l'utiliser immédiatement
      if (id in originalPrestationAmounts) {
        const newAmounts = { 
          ...prestationAmounts, 
          [id]: originalPrestationAmounts[id] 
        };
        setPrestationAmounts(newAmounts);
        
        // Calculer le nouveau montant total
        const newTotal = Object.values(newAmounts).reduce((sum, amount) => sum + amount, 0);
        setValue("montant", newTotal);
      } else {
        // Sinon, charger les données nécessaires
        loadPrestationData([id]).then(() => {
          updateTotalAmount(updatedPrestations);
        });
      }
    } else {
      // Si on déselectionne, recalculer le total immédiatement
      const newTotal = updatedPrestations
        .filter(pId => pId in prestationAmounts)
        .reduce((sum, pId) => sum + prestationAmounts[pId], 0);
      setValue("montant", newTotal);
    }
  };

  const handlePrestationAmountChange = (id: string, amount: number) => {
    console.log(`Changing amount for prestation ${id} to ${amount}`);
    const newAmounts = { ...prestationAmounts, [id]: amount };
    setPrestationAmounts(newAmounts);
    
    // Mettre à jour immédiatement le montant total
    const newTotal = selectedPrestations
      .filter(pId => pId in newAmounts)
      .reduce((sum, pId) => sum + newAmounts[pId], 0);
    setValue("montant", newTotal);
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
        setOriginalPrestationAmounts(prev => ({...prev, ...amounts}));
        
        // Initialize prestationAmounts with original amounts if not already set
        const newPrestationAmounts = { ...prestationAmounts };
        data.forEach(p => {
          if (!newPrestationAmounts[p.id]) {
            newPrestationAmounts[p.id] = Number(p.montant);
          }
        });
        setPrestationAmounts(newPrestationAmounts);
        
        // Mettre à jour immédiatement le montant total
        const newTotal = selectedPrestations
          .filter(pId => pId in newPrestationAmounts)
          .reduce((sum, pId) => sum + newPrestationAmounts[pId], 0);
        setValue("montant", newTotal);
        
        return amounts;
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

  // Quand selectedPrestations change, assurez-vous d'avoir toutes les données nécessaires
  useEffect(() => {
    if (selectedPrestations.length > 0) {
      const missingPrestations = selectedPrestations.filter(
        id => !(id in originalPrestationAmounts)
      );
      
      if (missingPrestations.length > 0) {
        loadPrestationData(missingPrestations);
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
