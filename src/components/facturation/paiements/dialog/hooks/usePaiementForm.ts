
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PaiementFormData } from "../../types/PaiementFormTypes";
import { usePaiementClients } from "./usePaiementClients";
import { usePaiementFactures } from "./usePaiementFactures";
import { usePaiementDates } from "./usePaiementDates";
import { usePaiementMode } from "./usePaiementMode";
import { usePaiementType } from "./usePaiementType";
import { usePaiementFormSubmit } from "./usePaiementFormSubmit";
import { Paiement } from "@/types/paiement";

interface UsePaiementFormProps {
  onSubmit: (paiement: Omit<Paiement, "id">) => Promise<any>;
  onOpenChange: (open: boolean) => void;
}

export const usePaiementForm = ({ onSubmit, onOpenChange }: UsePaiementFormProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedFactureId, setSelectedFactureId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PaiementFormData>({
    defaultValues: {
      client_id: "",
      facture_id: "",
      date: new Date(),
      montant: 0,
      mode: "espèces",
      est_credit: false,
      reference_transaction: "",
      notes: "",
      type_paiement: "total",
      prestations_payees: []
    }
  });

  // Watch values
  const estCredit = watch("est_credit");
  const selectedMode = watch("mode");
  const typePaiement = watch("type_paiement");
  const selectedPrestations = watch("prestations_payees");

  // Compose with other hooks
  const { clients } = usePaiementClients();
  
  const { handleClientChange, handleFactureChange } = usePaiementFactures({
    setValue,
    setSelectedClientId,
    setSelectedFactureId
  });
  
  const { date, handleDateChange } = usePaiementDates({ setValue });
  
  const { handleCreditChange, handleModeChange } = usePaiementMode({ setValue });
  
  const { handleTypePaiementChange, handlePrestationChange } = usePaiementType({
    setValue,
    selectedPrestations,
    selectedFactureId
  });
  
  const { onFormSubmit } = usePaiementFormSubmit({
    clients,
    handleSubmit,
    onSubmit,
    onOpenChange,
    reset,
    setIsSubmitting
  });

  return {
    register,
    handleSubmit,
    errors,
    onFormSubmit,
    selectedClientId,
    selectedFactureId,
    estCredit,
    selectedMode,
    typePaiement,
    selectedPrestations,
    date,
    isSubmitting,
    handleClientChange,
    handleFactureChange,
    handleDateChange,
    handleCreditChange,
    handleModeChange,
    handleTypePaiementChange,
    handlePrestationChange
  };
};
