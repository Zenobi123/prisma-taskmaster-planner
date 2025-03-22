
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/paiement";
import { PaiementFormData } from "../types/PaiementFormTypes";

interface UsePaiementDialogFormProps {
  onSubmit: (paiement: Omit<Paiement, "id">) => Promise<any>;
  onOpenChange: (open: boolean) => void;
}

export const usePaiementDialogForm = ({ onSubmit, onOpenChange }: UsePaiementDialogFormProps) => {
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedFactureId, setSelectedFactureId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [clients, setClients] = useState<any[]>([]);
  
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

  const estCredit = watch("est_credit");
  const selectedMode = watch("mode");
  const typePaiement = watch("type_paiement");
  const selectedPrestations = watch("prestations_payees");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, nom, raisonsociale, type");

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer la liste des clients."
      });
    }
  };

  const handleClientChange = (clientId: string) => {
    setValue("client_id", clientId);
    setSelectedClientId(clientId);
    setValue("facture_id", "");
    setSelectedFactureId(null);
  };

  const handleFactureChange = (factureId: string) => {
    setValue("facture_id", factureId);
    setSelectedFactureId(factureId);
    // Calcul automatique du montant total de la facture
    supabase
      .from("factures")
      .select("*")
      .eq("id", factureId)
      .single()
      .then(({ data }) => {
        if (data) {
          const montantRestant = data.montant - (data.montant_paye || 0);
          setValue("montant", montantRestant);
        }
      });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setValue("date", date);
    }
  };

  const handleCreditChange = (checked: boolean) => {
    setValue("est_credit", checked);
    if (checked) {
      setValue("facture_id", "");
      setSelectedFactureId(null);
    }
  };

  const handleModeChange = (value: "espèces" | "virement" | "orange_money" | "mtn_money") => {
    setValue("mode", value);
  };

  const handleTypePaiementChange = (value: "total" | "partiel") => {
    setValue("type_paiement", value);
    // Si on passe de partiel à total, on vide les prestations sélectionnées
    if (value === "total") {
      setValue("prestations_payees", []);
    }
  };

  const handlePrestationChange = (id: string, checked: boolean) => {
    let updatedPrestations = [...selectedPrestations];
    
    if (checked) {
      updatedPrestations.push(id);
    } else {
      updatedPrestations = updatedPrestations.filter(p => p !== id);
    }
    
    setValue("prestations_payees", updatedPrestations);
    
    // Si on a sélectionné des prestations, on ajuste le montant
    if (updatedPrestations.length > 0 && typePaiement === "partiel") {
      supabase
        .from("prestations")
        .select("*")
        .in("id", updatedPrestations)
        .then(({ data }) => {
          if (data) {
            const montantTotal = data.reduce((sum, p) => sum + Number(p.montant), 0);
            setValue("montant", montantTotal);
          }
        });
    }
  };

  const onFormSubmit = async (data: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      const clientInfo = clients.find(c => c.id === data.client_id);
      const clientName = clientInfo ? (clientInfo.nom || clientInfo.raisonsociale) : "";
      
      const paiementData: Omit<Paiement, "id"> = {
        client: clientName,
        client_id: data.client_id,
        facture: data.est_credit ? "" : data.facture_id,
        date: format(data.date, "yyyy-MM-dd"),
        montant: data.montant,
        mode: data.mode,
        est_credit: data.est_credit,
        reference: `PAY-${Date.now().toString(36)}`,
        reference_transaction: data.reference_transaction,
        notes: data.notes,
        solde_restant: 0, // Sera calculé côté serveur
        type_paiement: data.type_paiement,
        prestations_payees: data.type_paiement === "partiel" ? data.prestations_payees : []
      };

      await onSubmit(paiementData);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du paiement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
