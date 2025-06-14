import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ClientSelector } from './ClientSelector';
import { DatePickerField } from './DatePickerField';
import { StatusSelector } from './StatusSelector';
import { ModePaiementSelector } from './ModePaiementSelector';
import { PrestationFields } from './PrestationFields';
import { TotalAmountDisplay } from './TotalAmountDisplay';

import { Prestation } from '@/types/facture';
import { useFactureFormSubmit } from '@/hooks/facturation/factureForm/useFactureFormSubmit';

const factureFormSchema = z.object({
  client_id: z.string().min(1, { message: "Veuillez sélectionner un client" }),
  date: z.date({ required_error: "La date de facturation est requise" }),
  echeance: z.date({ required_error: "La date d'échéance est requise" }),
  status: z.string({ required_error: "Le statut est requis" }),
  mode: z.string().optional(),
  notes: z.string().optional(),
  prestations: z.array(z.object({
    id: z.string().optional(),
    description: z.string(),
    quantite: z.number(),
    prix_unitaire: z.number(),
    montant: z.number()
  })).optional()
});

type FactureFormData = z.infer<typeof factureFormSchema>;

interface CreateFactureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFactureCreated: () => void;
}

const CreateFactureForm = ({ open, onOpenChange, onFactureCreated }: CreateFactureFormProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [prestations, setPrestations] = useState<Prestation[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FactureFormData>({
    resolver: zodResolver(factureFormSchema),
    defaultValues: {
      date: new Date(),
      echeance: new Date(),
      status: 'brouillon'
    }
  });

  const watchDate = watch('date');
  const watchEcheance = watch('echeance');
  const watchStatus = watch('status');
  const watchMode = watch('mode');

  const { onSubmit } = useFactureFormSubmit(selectedClientId, prestations, onFactureCreated, onOpenChange);

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setValue('client_id', clientId);
  };

  const addPrestation = () => {
    setPrestations(prev => [...prev, { description: '', quantite: 1, prix_unitaire: 0, montant: 0 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client *</Label>
              <ClientSelector
                selectedClientId={selectedClientId}
                onClientChange={handleClientChange}
                error={errors.client_id?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date de facturation *</Label>
              <DatePickerField
                value={watchDate}
                onChange={(date) => setValue('date', date)}
                error={errors.date?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="echeance">Date d'échéance *</Label>
              <DatePickerField
                value={watchEcheance}
                onChange={(date) => setValue('echeance', date)}
                error={errors.echeance?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <StatusSelector
                value={watchStatus}
                onChange={(status) => setValue('status', status)}
                error={errors.status?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Mode de paiement</Label>
              <ModePaiementSelector
                value={watchMode}
                onChange={(mode) => setValue('mode', mode)}
                error={errors.mode?.message}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Prestations *</Label>
              <Button
                type="button"
                variant="outline"
                onClick={addPrestation}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une prestation
              </Button>
            </div>

            <PrestationFields
              prestations={prestations}
              onPrestationsChange={setPrestations}
              errors={errors.prestations}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Notes additionnelles..."
              rows={3}
            />
          </div>

          <TotalAmountDisplay prestations={prestations} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer la facture'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactureForm;
