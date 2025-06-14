
import { useState, useEffect } from "react";
import { Prestation } from "@/types/facture";

const defaultPrestation: Prestation = { description: "", quantite: 1, prix_unitaire: 0, montant: 0 };

export const useFactureFormPrestations = () => {
  const [prestations, setPrestations] = useState<Prestation[]>([
    { ...defaultPrestation }
  ]);

  // Calculate total amount whenever prestations change
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = prestations.reduce((sum, prestation) => {
      return sum + (prestation.montant ?? (prestation.prix_unitaire * (prestation.quantite || 1)));
    }, 0);
    setTotalAmount(total);
  }, [prestations]);

  return {
    prestations,
    setPrestations,
    totalAmount
  };
};
