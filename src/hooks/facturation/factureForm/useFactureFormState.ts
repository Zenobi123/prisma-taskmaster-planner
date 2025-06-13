
import { useState } from "react";

export function useFactureFormState() {
  const [clientId, setClientId] = useState("");
  const [dateFacture, setDateFacture] = useState("");
  const [dateEcheance, setDateEcheance] = useState("");
  const [notes, setNotes] = useState("");
  const [modePaiement, setModePaiement] = useState("");
  const [statutFacture, setStatutFacture] = useState("brouillon");

  const resetForm = () => {
    setClientId("");
    setDateFacture("");
    setDateEcheance("");
    setNotes("");
    setModePaiement("");
    setStatutFacture("brouillon");
  };

  return {
    clientId,
    setClientId,
    dateFacture,
    setDateFacture,
    dateEcheance,
    setDateEcheance,
    notes,
    setNotes,
    modePaiement,
    setModePaiement,
    statutFacture,
    setStatutFacture,
    resetForm
  };
}
