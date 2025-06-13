
import { useState } from "react";

export function useFactureFormPrestations() {
  const [prestations, setPrestations] = useState([]);

  const addPrestation = (prestation: any) => {
    setPrestations([...prestations, prestation]);
  };

  const removePrestation = (index: number) => {
    setPrestations(prestations.filter((_, i) => i !== index));
  };

  const updatePrestation = (index: number, updates: any) => {
    const newPrestations = [...prestations];
    newPrestations[index] = { ...newPrestations[index], ...updates };
    setPrestations(newPrestations);
  };

  return {
    prestations,
    setPrestations,
    addPrestation,
    removePrestation,
    updatePrestation
  };
}
