
import { useState, useEffect } from "react";
import { Prestation } from "@/types/facture";

export const useFactureFormPrestations = () => {
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", quantite: 1, montant: 0 },
  ]);

  // Calculate total amount whenever prestations change
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = prestations.reduce((sum, prestation) => {
      return sum + (prestation.montant * (prestation.quantite || 1));
    }, 0);
    setTotalAmount(total);
  }, [prestations]);

  return {
    prestations,
    setPrestations,
    totalAmount
  };
};
