import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import ClientSelector from "./ClientSelector";
import DatePickerField from "./DatePickerField";
import StatusSelector from "./StatusSelector";
import ModePaiementSelector from "./ModePaiementSelector";
import PrestationFields from "./PrestationFields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Facture, Prestation } from "@/types/facture";
import { useFactureForm } from "@/hooks/facturation/factureForm/useFactureForm";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { formatDate } from "@/utils/factureUtils";

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
  montant: 0,
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
    ? factureToEdit.prestations.map(p => ({ ...p, montant: p.montant ?? (p.quantite * p.prix_unitaire) }))
    : [defaultPrestation]
  );

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
      date: typeof factureToEdit.date === 'string' ? new Date(factureToEdit.date) : factureToEdit.date,
      echeance: typeof factureToEdit.echeance === 'string' ? new Date(factureToEdit.echeance) : factureToEdit.echeance,
      prestations: factureToEdit.prestations.length > 0 ? factureToEdit.prestations.map(p => ({ ...p, montant: p.montant ?? (p.quantite * p.prix_unitaire) })) : [defaultPrestation],
    } : {
      prestations: [defaultPrestation],
      status: "brouillon",
      status_paiement: "non_payée",
      mode_paiement: "Espèces",
      date: new Date(),
      echeance: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
  });

  // Initialize form with factureToEdit data when it changes
  useEffect(() => {
    if (editMode && factureToEdit) {
      reset({
        ...factureToEdit,
        date: typeof factureToEdit.date === 'string' ? new Date(factureToEdit.date) : factureToEdit.date,
        echeance: typeof factureToEdit.echeance === 'string' ? new Date(factureToEdit.echeance) : factureToEdit.echeance,
        prestations: factureToEdit.prestations.length > 0 ? factureToEdit.prestations.map(p => ({ ...p, montant: p.montant ?? (p.quantite * p.prix_unitaire) })) : [defaultPrestation],
      });
      setPrestations(factureToEdit.prestations.length > 0 ? factureToEdit.prestations.map(p => ({ ...p, montant: p.montant ?? (p.quantite * p.prix_unitaire) })) : [defaultPrestation]);
    }
  }, [factureToEdit, editMode, reset]);

  const { clients: allClients, isLoading: isLoadingClients, error: clientsError } = useFactureForm();

  const selectedClientId = watch("client_id");

  const calculateTotalAmount = useCallback(() => {
    return prestations.reduce((total, p) => total + (p.quantite * (p.prix_unitaire || 0)), 0);
  }, [prestations]);

  const totalAmount = calculateTotalAmount();

  useEffect(() => {
    setValue("prestations", prestations, { shouldValidate: true });
  }, [prestations, setValue]);

  const onSubmitHandler = async (data: Facture) => {
    try {
      // Always use string as output for date/echeance
      const toDateString = (dateVal: string | Date) =>
        typeof dateVal === "string"
          ? dateVal
          : dateVal instanceof Date
          ? dateVal.toISOString().split("T")[0]
          : "";

      const formattedData = {
        ...data,
        date: toDateString(data.date),
        echeance: toDateString(data.echeance),
        prestations: prestations.map(p => ({
          ...p,
          montant: p.quantite * p.prix_unitaire
        })),
        montant: totalAmount
      };

      console.log('Submitting facture data:', formattedData);
      
      // Simuler la création/modification de facture
      if (editMode && factureToEdit) {
        toast.success("Facture modifiée avec succès !");
        onSuccess(factureToEdit.id);
      } else {
        toast.success("Facture créée avec succès !");
        onSuccess(formattedData as Facture);
      }
      
      reset();
      setPrestations([defaultPrestation]);
    } catch (error) {
      toast.error(`Erreur lors de ${editMode ? "la modification" : "la création"} de la facture.`);
      console.error(`${editMode ? "Update" : "Create"} facture error:`, error);
    }
  };

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

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total :</span>
          <span className="text-lg font-bold">{totalAmount.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

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
        <Button type="submit">
          {editMode ? "Modifier la facture" : "Créer la facture"}
        </Button>
      </DialogFooter>
    </form>
  );
};
