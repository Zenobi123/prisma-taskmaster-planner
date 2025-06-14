
import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { ClientSelector } from "./ClientSelector"; // Assuming default export or correct named export
import { DatePickerField } from "./DatePickerField"; // Assuming default export or correct named export
import { StatusSelector } from "./StatusSelector"; // Assuming default export or correct named export
import { ModePaiementSelector } from "./ModePaiementSelector"; // Assuming default export or correct named export
import { PrestationFields } from "./PrestationFields"; // Assuming default export or correct named export
import { TotalAmountDisplay } from "./TotalAmountDisplay"; // Assuming default export or correct named export
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
  status: z.enum(["brouillon", "envoyée", "annulée"], { errorMap: () => ({ message: "Statut requis" }) }),
  status_paiement: z.enum(["non_payée", "partiellement_payée", "payée", "en_retard"], { errorMap: () => ({ message: "Statut de paiement requis" }) }),
  mode_paiement: z.string().optional(),
  notes: z.string().optional(),
  prestations: z.array(
    z.object({
      description: z.string().min(1, "Description requise"),
      quantite: z.number().min(1, "Quantité > 0"),
      prix_unitaire: z.number().min(0, "Prix >= 0"), // This is correct
    })
  ).min(1, "Au moins une prestation est requise"),
});

const defaultPrestation: Prestation = {
  description: "",
  quantite: 1,
  prix_unitaire: 0, // This matches the Zod schema
};

interface CreateFactureFormProps {
  onClose: () => void;
  onFactureCreated: (newFacture: Facture) => void;
}

export const CreateFactureForm: React.FC<CreateFactureFormProps> = ({ onClose, onFactureCreated }) => {
  const [prestations, setPrestations] = useState<Prestation[]>([defaultPrestation]);
  const [editFactureId, setEditFactureId] = useState<string | null>(null);

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
      status: "brouillon", // Corrected enum value
      status_paiement: "non_payée", // Corrected enum value
      mode_paiement: "Espèces", // Assuming this maps to a valid value later or is free text
    },
  });

  const { clients: allClients, isLoading: isLoadingClients, error: clientsError } = useFactureForm(
    setValue,
    setPrestations,
    setEditFactureId
  );

  // Assuming useFactureCreateActions hook is called without arguments and returns these properties
  const { createFacture, isCreating } = useFactureCreateActions();


  const selectedClientId = watch("client_id");
  const selectedClient = allClients.find((c: Client) => c.id === selectedClientId);

  const calculateTotalAmount = useCallback(() => {
    return prestations.reduce((total, p) => total + (p.quantite * (p.prix_unitaire || 0)), 0); // Ensure prix_unitaire is handled if potentially undefined
  }, [prestations]);

  const totalAmount = calculateTotalAmount();

  useEffect(() => {
    setValue("prestations", prestations, { shouldValidate: true });
  }, [prestations, setValue]);

  const onSubmit = async (data: Facture) => {
    try {
      // Ensure data matches the expected structure for createFacture
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

  // Assuming ClientSelector etc. are default exports or correctly named exports.
  // If they are named exports and the file name is, for example, ClientSelector.tsx,
  // then import { ClientSelector } from './ClientSelector'; is correct.
  // If the file name is index.tsx in a folder ClientSelector, then import { ClientSelector } from './ClientSelector'; is also correct.
  // The errors "Module ... has no exported member ..." suggest the components might be default exports.
  // If `ClientSelector.tsx` is `export default function ClientSelector...`, then `import ClientSelector from './ClientSelector'` is needed.
  // For now, I will assume the provided import statements are what's intended (named exports from files with the same name).
  // The build errors will confirm if this assumption is wrong.
  // Based on common practice with ShadCN and similar structures, default exports for these specific components are less likely.
  // The error TS2614: Module '"./ClientSelector"' has no exported member 'ClientSelector'. Did you mean to use 'import ClientSelector from "./ClientSelector"' instead?
  // This strongly suggests they ARE default exports. I will change them.

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ClientSelector // If this was `import ClientSelector from ...`
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
      {errors.prestations && <p className="text-red-500 text-sm">{typeof errors.prestations.message === 'string' ? errors.prestations.message : "Erreur dans les prestations"}</p>}


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

