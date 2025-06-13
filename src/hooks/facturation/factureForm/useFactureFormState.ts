
import { useState } from "react";
import { useForm } from "react-hook-form";

type StatusType = "brouillon" | "envoyée" | "annulée";
type StatusPaiementType = "non_payée" | "payée" | "partiellement_payée" | "en_retard";
type ModePaiementType = "espèces" | "virement" | "chèque" | "carte";

export function useFactureFormState() {
  const form = useForm({
    defaultValues: {
      client_id: "",
      date: new Date(),
      echeance: new Date(),
      status: "brouillon" as StatusType,
      status_paiement: "non_payée" as StatusPaiementType,
      mode_paiement: "espèces" as ModePaiementType,
      notes: ""
    }
  });

  const [prestations, setPrestations] = useState([
    { description: "", quantite: 1, montant: 0 }
  ]);

  const totalAmount = prestations.reduce((sum, p) => sum + (p.montant * (p.quantite || 1)), 0);

  const resetForm = () => {
    form.reset();
    setPrestations([{ description: "", quantite: 1, montant: 0 }]);
  };

  return {
    ...form,
    prestations,
    setPrestations,
    totalAmount,
    resetForm,
    // Getters for form values
    selectedClientId: form.watch("client_id"),
    selectedDate: form.watch("date"),
    selectedEcheance: form.watch("echeance"),
    selectedStatus: form.watch("status"),
    selectedStatusPaiement: form.watch("status_paiement"),
    selectedModePaiement: form.watch("mode_paiement"),
    selectedClient: null // Will be set by the main hook
  };
}
