
import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import ClientSelector from "./ClientSelector"; // Corrected import
import DatePickerField from "./DatePickerField"; // Corrected import
import StatusSelector from "./StatusSelector"; // Corrected import
import ModePaiementSelector from "./ModePaiementSelector"; // Corrected import
import PrestationFields from "./PrestationFields"; // Corrected import
import TotalAmountDisplay from "./TotalAmountDisplay"; // Corrected import
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Facture, Prestation } from "@/types/facture";
import { useFactureForm } from "@/hooks/facturation/factureForm/useFactureForm";
import { useFactureCreateActions, useFactureUpdateActions } from "@/hooks/facturation/factureActions"; // Assuming useFactureUpdateActions exists for edit mode
import { Client } from "@/types/client";
import { toast } from "sonner";

// Define Zod validation schema for Facture
const validationSchema = z.object({
  client_id: z.string().min(1, "Client requis"),
  date: z.date({ required_error: "Date requise" }),
  echeance: z.date({ required_error: "Échéance requise" }),
  status: z.enum(["brouillon", "envoyée", "annulée"], { errorMap: () => ({ message: "Statut requis" }) }),
  status_paiement: z.enum(["non_payée", "partiellement_payée", "payée", "en_retard"], { errorMap: () => ({ message: "Statut de paiement requis" }) }),
  mode_paiement: z.string().optional(),
  notes: z.string().optional(),
  prestations: z.array(
    z.object({
      description: z.string().min(1, "Description requise"),
      quantite: z.number().min(1, "Quantité doit être supérieure à 0"),
      prix_unitaire: z.number().min(0, "Prix unitaire doit être supérieur ou égal à 0"),
    })
  ).min(1, "Au moins une prestation est requise"),
});

const defaultPrestation: Prestation = {
  description: "",
  quantite: 1,
  prix_unitaire: 0,
};

interface CreateFactureFormProps {
  onSuccess: (newFactureOrId: Facture | string) => void;
  onCancel: () => void;
  editMode?: boolean;
  factureToEdit?: Facture | null;
}

export const CreateFactureForm: React.FC<CreateFactureFormProps> = ({ 
  onSuccess, 
  onCancel, 
  editMode = false, 
  factureToEdit = null 
}) => {
  const [prestations, setPrestations] = useState<Prestation[]>(
    factureToEdit?.prestations && factureToEdit.prestations.length > 0 
    ? factureToEdit.prestations 
    : [defaultPrestation]
  );
  const [editFactureId, setEditFactureId] = useState<string | null>(factureToEdit?.id || null);

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
    defaultValues: editMode && factureToEdit ? {
      ...factureToEdit,
      date: new Date(factureToEdit.date),
      echeance: new Date(factureToEdit.echeance),
      prestations: factureToEdit.prestations.length > 0 ? factureToEdit.prestations : [defaultPrestation],
    } : {
      prestations: [defaultPrestation],
      status: "brouillon",
      status_paiement: "non_payée",
      mode_paiement: "Espèces",
      date: new Date(),
      echeance: new Date(new Date().setDate(new Date().getDate() + 30)), // Default echeance to 30 days from now
    },
  });

  // Initialize editFactureId from factureToEdit prop
  useEffect(() => {
    if (editMode && factureToEdit) {
      setEditFactureId(factureToEdit.id);
      // Reset form with factureToEdit data when it changes or on initial load in edit mode
      reset({
        ...factureToEdit,
        date: new Date(factureToEdit.date),
        echeance: new Date(factureToEdit.echeance),
        prestations: factureToEdit.prestations.length > 0 ? factureToEdit.prestations : [defaultPrestation],
      });
      setPrestations(factureToEdit.prestations.length > 0 ? factureToEdit.prestations : [defaultPrestation]);
    }
  }, [factureToEdit, editMode, reset]);


  const { clients: allClients, isLoading: isLoadingClients, error: clientsError } = useFactureForm(
    setValue,
    setPrestations,
    setEditFactureId // This might need to be adjusted if useFactureForm doesn't handle editFactureId
  );
  
  const { addFacture, isCreating } = useFactureCreateActions();
  // Assuming useFactureUpdateActions hook exists and has a similar signature for updates
  const { updateFacture, isUpdating } = useFactureUpdateActions ? useFactureUpdateActions() : { updateFacture: null, isUpdating: false };


  const selectedClientId = watch("client_id");
  // const selectedClient = allClients.find((c: Client) => c.id === selectedClientId); // Already available in useFactureForm?

  const calculateTotalAmount = useCallback(() => {
    return prestations.reduce((total, p) => total + (p.quantite * (p.prix_unitaire || 0)), 0);
  }, [prestations]);

  const totalAmount = calculateTotalAmount();

  useEffect(() => {
    setValue("prestations", prestations, { shouldValidate: true });
  }, [prestations, setValue]);

  const onSubmitHandler = async (data: Facture) => {
    try {
      if (editMode && factureToEdit && updateFacture) {
        const updatedFacture = await updateFacture(factureToEdit.id, data);
        if (updatedFacture) {
          toast.success("Facture modifiée avec succès !");
          onSuccess(factureToEdit.id); // Or updatedFacture if it's returned
          reset();
          setPrestations([defaultPrestation]);
          // onCancel(); // Typically call onCancel from the dialog, not here
        }
      } else {
        const newFacture = await addFacture(data);
        if (newFacture) {
          toast.success("Facture créée avec succès !");
          onSuccess(newFacture);
          reset();
          setPrestations([defaultPrestation]);
          // onCancel(); // Typically call onCancel from the dialog, not here
        }
      }
    } catch (error) {
      toast.error(`Erreur lors de ${editMode ? "la modification" : "la création"} de la facture.`);
      console.error(`${editMode ? "Update" : "Create"} facture error:`, error);
    }
  };
  
  const currentIsLoading = editMode ? isUpdating : isCreating;

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <ClientSelector
        clients={allClients}
        isLoading={isLoadingClients}
        error={clientsError}
        value={selectedClientId || ""}
        onChange={(clientId) => setValue("client_id", clientId, { shouldValidate: true })}
      />
      {errors.client_id && <p className="text-red-500 text-sm">{errors.client_id.message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePickerField label="Date de la facture" date={field.value} onSelect={field.onChange} />
          )}
        />
        <Controller
          name="echeance"
          control={control}
          render={({ field }) => (
            <DatePickerField label="Date d'échéance" date={field.value} onSelect={field.onChange} />
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
                <StatusSelector label="Statut de la facture" value={field.value} onChange={field.onChange} type="document"/>
            )}
        />
        <Controller
            name="status_paiement"
            control={control}
            render={({ field }) => (
                <StatusSelector label="Statut de paiement" value={field.value} onChange={field.onChange} type="paiement"/>
            )}
        />
      </div>
      {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      {errors.status_paiement && <p className="text-red-500 text-sm">{errors.status_paiement.message}</p>}

      <Controller
        name="mode_paiement"
        control={control}
        render={({ field }) => (
            <ModePaiementSelector value={field.value || ""} onChange={field.onChange} />
        )}
      />
      {errors.mode_paiement && <p className="text-red-500 text-sm">{errors.mode_paiement.message}</p>}

      <PrestationFields prestations={prestations} onPrestationsChange={setPrestations} />
      {errors.prestations && <p className="text-red-500 text-sm">{typeof errors.prestations.message === 'string' ? errors.prestations.message : "Erreur dans les prestations"}</p>}
      {errors.prestations?.root?.message && <p className="text-red-500 text-sm">{errors.prestations.root.message}</p>}
       {Array.isArray(errors.prestations) && errors.prestations.map((err, index) => (
        <div key={index}>
          {err?.description && <p className="text-red-500 text-sm">Prestation {index+1} Description: {err.description.message}</p>}
          {err?.quantite && <p className="text-red-500 text-sm">Prestation {index+1} Quantité: {err.quantite.message}</p>}
          {err?.prix_unitaire && <p className="text-red-500 text-sm">Prestation {index+1} Prix: {err.prix_unitaire.message}</p>}
        </div>
      ))}


      <TotalAmountDisplay totalAmount={totalAmount} />

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Ajouter des notes ici..." />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </DialogClose>
        <Button type="submit" disabled={currentIsLoading}>
          {currentIsLoading ? (editMode ? "Modification..." : "Création...") : (editMode ? "Modifier la facture" : "Créer la facture")}
        </Button>
      </DialogFooter>
    </form>
  );
};
