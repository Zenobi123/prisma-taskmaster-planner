import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { ClientSelector } from "./ClientSelector";
import { DatePickerField } from "./DatePickerField";
import { StatusSelector } from "./StatusSelector";
import { ModePaiementSelector } from "./ModePaiementSelector";
import { PrestationFields } from "./PrestationFields";
import { TotalAmountDisplay } from "./TotalAmountDisplay";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Facture, Prestation } from "@/types/facture";
import { useFactureForm } from "@/hooks/facturation/factureForm/useFactureForm";
import { useFactureCreateActions } from "@/hooks/facturation/factureActions";
import { Client } from "@/types/client";
import { toast } from "sonner";

// Define Zod validation schema for Facture
const validationSchema = z.object({
  client_id: z.string().min(1, "Client requis"),
  date: z.date({ required_error: "Date requise" }),
  echeance: z.date({ required_error: "Échéance requise" }),
  status: z.string().min(1, "Statut requis"),
  status_paiement: z.string().min(1, "Statut de paiement requis"),
  mode_paiement: z.string().optional(),
  notes: z.string().optional(),
  prestations: z.array(
    z.object({
      description: z.string().min(1, "Description requise"),
      quantite: z.number().min(1, "Quantité > 0"),
      prix_unitaire: z.number().min(0, "Prix >= 0"),
    })
  ).min(1, "Au moins une prestation est requise"),
});

const defaultPrestation: Prestation = {
  description: "",
  quantite: 1,
  prix_unitaire: 0,
};

interface CreateFactureFormProps {
  onClose: () => void;
  onFactureCreated: (newFacture: Facture) => void;
}

export const CreateFactureForm: React.FC<CreateFactureFormProps> = ({ onClose, onFactureCreated }) => {
  const [prestations, setPrestations] = useState<Prestation[]>([defaultPrestation]);
  const [editFactureId, setEditFactureId] = useState<string | null>(null); // Required by useFactureForm

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<Facture>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      prestations: [defaultPrestation],
      status: "Brouillon",
      status_paiement: "Non payé",
      mode_paiement: "Espèces",
    },
  });

  // useFactureForm hook provides client data and form initialization logic (for editing, not used here for creation)
  const { clients: allClients, isLoading: isLoadingClients, error: clientsError } = useFactureForm(
    setValue, // Pass react-hook-form's setValue
    setPrestations, // Pass local state setter
    setEditFactureId // Pass local state setter
  );

  const { createFacture, isCreating } = useFactureCreateActions();

  const selectedClientId = watch("client_id");
  const selectedClient = allClients.find((c: Client) => c.id === selectedClientId);

  const calculateTotalAmount = useCallback(() => {
    return prestations.reduce((total, p) => total + p.quantite * p.prix_unitaire, 0);
  }, [prestations]);

  const totalAmount = calculateTotalAmount();

  useEffect(() => {
    setValue("prestations", prestations);
  }, [prestations, setValue]);

  const onSubmit = async (data: Facture) => {
    try {
      const newFacture = await createFacture(data);
      if (newFacture) {
        toast.success("Facture créée avec succès !");
        onFactureCreated(newFacture);
        reset();
        setPrestations([defaultPrestation]);
        onClose();
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la facture.");
      console.error("Create facture error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ClientSelector
        clients={allClients}
        isLoading={isLoadingClients}
        error={clientsError}
        selectedClientId={selectedClientId}
        onClientChange={(clientId) => setValue("client_id", clientId, { shouldValidate: true })}
      />
      {errors.client_id && <p className="text-red-500 text-sm">{errors.client_id.message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePickerField label="Date de la facture" selectedDate={field.value} onDateChange={field.onChange} />
          )}
        />
        <Controller
          name="echeance"
          control={control}
          render={({ field }) => (
            <DatePickerField label="Date d'échéance" selectedDate={field.value} onDateChange={field.onChange} />
          )}
        />
      </div>
      {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      {errors.echeance && <p className="text-red-500 text-sm">{errors.echeance.message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
            name="status"
            control={control}
            render={({ field }) => (
                <StatusSelector label="Statut de la facture" selectedStatus={field.value} onStatusChange={field.onChange} />
            )}
        />
        <Controller
            name="status_paiement"
            control={control}
            render={({ field }) => (
                <StatusSelector label="Statut de paiement" selectedStatus={field.value} onStatusChange={field.onChange} paymentStatus />
            )}
        />
      </div>
      {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      {errors.status_paiement && <p className="text-red-500 text-sm">{errors.status_paiement.message}</p>}

      <Controller
        name="mode_paiement"
        control={control}
        render={({ field }) => (
            <ModePaiementSelector selectedMode={field.value} onModeChange={field.onChange} />
        )}
      />
      {errors.mode_paiement && <p className="text-red-500 text-sm">{errors.mode_paiement.message}</p>}

      <PrestationFields prestations={prestations} setPrestations={setPrestations} defaultPrestation={defaultPrestation} />
      {errors.prestations && <p className="text-red-500 text-sm">{errors.prestations.message}</p>}

      <TotalAmountDisplay totalAmount={totalAmount} />

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Ajouter des notes ici..." />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Création..." : "Créer la facture"}
        </Button>
      </DialogFooter>
    </form>
  );
};
