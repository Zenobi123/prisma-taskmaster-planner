
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Facture, Prestation } from "@/types/facture";
import { format, parse } from "date-fns";

export type FactureFormData = {
  client_id: string;
  date: Date;
  echeance: Date;
  status: string;
  status_paiement: string;
  mode_paiement: string;
  prestations: Prestation[];
  notes?: string;
};

export const useFactureFormState = (editMode: boolean = false) => {
  // Form state using react-hook-form
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FactureFormData>({
    defaultValues: {
      client_id: "",
      date: new Date(),
      echeance: new Date(new Date().setDate(new Date().getDate() + 30)), // +30 jours par défaut
      status: "brouillon",
      status_paiement: "non_payée",
      mode_paiement: "espèces",
      prestations: [],
      notes: ""
    }
  });

  // Additional form state
  const [totalAmount, setTotalAmount] = useState(0);
  const [editFactureId, setEditFactureId] = useState<string | null>(null);

  // Watch form values
  const selectedClientId = watch("client_id");
  const selectedDate = watch("date");
  const selectedEcheance = watch("echeance");
  const selectedStatus = watch("status");
  const selectedStatusPaiement = watch("status_paiement");
  const selectedModePaiement = watch("mode_paiement");
  const notes = watch("notes");

  // When status changes to 'brouillon', automatically set payment status to 'non_payée'
  useEffect(() => {
    if (selectedStatus === "brouillon") {
      setValue("status_paiement", "non_payée");
    }
  }, [selectedStatus, setValue]);

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    reset,
    totalAmount,
    setTotalAmount,
    editFactureId,
    setEditFactureId,
    selectedClientId,
    selectedDate,
    selectedEcheance,
    selectedStatus,
    selectedStatusPaiement,
    selectedModePaiement,
    notes
  };
};
