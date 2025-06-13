
import { useState } from "react";
import { Prestation } from "@/types/facture";

export function useFactureFormPrestations() {
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", quantite: 1, montant: 0 }
  ]);

  return {
    prestations,
    setPrestations
  };
}
