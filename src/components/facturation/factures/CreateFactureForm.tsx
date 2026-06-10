
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays } from 'date-fns';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import ClientSelector from './ClientSelector';
import DatePickerField from './DatePickerField';
import StatusSelector from './StatusSelector';
import ModePaiementSelector from './ModePaiementSelector';
import PrestationFields from './PrestationFields';
import TotalAmountDisplay from './TotalAmountDisplay';

import { Prestation } from '@/types/facture';
import { Client } from '@/types/client';
import { useFactureFormSubmit } from '@/hooks/facturation/factureForm/useFactureFormSubmit';
import { adaptClient, getMissingClientFields, type ExistingClientLike } from '@/lib/spec/fiscal';
import {
  getImpotsForSelect,
  getHonorairesForClient,
  getQuickImpotButtons,
  type QuickImpotButton,
} from '@/lib/spec/facturePrestations';
import { toSpecPrestation, toFormPrestation } from '@/lib/spec/prestationBridge';

const factureFormSchema = z.object({
  client_id: z.string().min(1, { message: "Veuillez sélectionner un client" }),
  date: z.date({ required_error: "La date de facturation est requise" }),
  echeance: z.date({ required_error: "La date d'échéance est requise" }),
  status: z.string({ required_error: "Le statut est requis" }),
  mode: z.string().optional(),
  notes: z.string().optional(),
});

type FactureFormData = z.infer<typeof factureFormSchema>;

interface CreateFactureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFactureCreated: () => void;
  clients?: Client[];
}

const CreateFactureForm = ({ open, onOpenChange, onFactureCreated, clients = [] }: CreateFactureFormProps) => {
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
      // Référence : « Échéance : 30 jours à compter de la date d'émission »
      echeance: addDays(new Date(), 30),
      // Référence : toute facture générée est immédiatement « émise »
      status: 'envoyée'
    }
  });

  const watchDate = watch('date');
  const watchEcheance = watch('echeance');
  const watchStatus = watch('status');
  const watchMode = watch('mode');

  // Client sélectionné → ClientSpec (avec impôts calculés) pour l'ajout rapide fidèle.
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId),
    [clients, selectedClientId],
  );
  const clientSpec = useMemo(
    () => (selectedClient ? adaptClient(selectedClient as ExistingClientLike) : null),
    [selectedClient],
  );

  const { onSubmit } = useFactureFormSubmit(selectedClientId, prestations, onFactureCreated, onOpenChange, clientSpec);
  const impotsOptions = useMemo(() => getImpotsForSelect(clientSpec), [clientSpec]);
  const honorairesOptions = useMemo(() => getHonorairesForClient(clientSpec), [clientSpec]);
  const impotButtons = useMemo(
    () => getQuickImpotButtons(clientSpec),
    [clientSpec],
  );

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setValue('client_id', clientId);
    // Référence : avertissement non bloquant dès la sélection si la fiche
    // client est incomplète (le blocage intervient à l'émission).
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      const manquants = getMissingClientFields(adaptClient(client as ExistingClientLike));
      if (manquants.length > 0) {
        toast.warning(`Fiche client incomplète ! Champs manquants : ${manquants.join(', ')}`);
      }
    }
  };

  const addPrestation = () => {
    setPrestations(prev => [...prev, { description: '', type: 'honoraire', quantite: 1, prix_unitaire: 0, montant: 0 }]);
  };

  // Ajout rapide « Impôts du client & CGA » : injecte les montants réels du client
  // (IGS classe + TDL + pénalités via cascade, PSL, Bail, TF, Solde, Patente, CGA).
  const applyImpotButton = (btn: (typeof QUICK_IMPOT_BUTTONS)[number]) => {
    if (!clientSpec) return;
    const next = btn.apply(prestations.map(toSpecPrestation), clientSpec);
    setPrestations(next.map(toFormPrestation));
  };

  // Ajout rapide « Honoraires selon le régime » (liste fidèle à la référence).
  const addHonoraire = (def: { designation: string; montant: number }) => {
    setPrestations(prev => {
      if (prev.some((p) => p.description === def.designation)) return prev;
      return [
        ...prev,
        {
          description: def.designation,
          type: 'honoraire',
          quantite: 1,
          prix_unitaire: def.montant,
          montant: def.montant,
        },
      ];
    });
  };

  const totals = useMemo(() => {
    const totalImpots = prestations
      .filter(p => p.type === "impot")
      .reduce((sum, p) => sum + p.montant, 0);
    const totalHonoraires = prestations
      .filter(p => p.type === "honoraire")
      .reduce((sum, p) => sum + p.montant, 0);
    return {
      impots: totalImpots,
      honoraires: totalHonoraires,
      total: totalImpots + totalHonoraires,
    };
  }, [prestations]);

  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat("fr-FR").format(montant) + " F CFA";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_id">Client *</Label>
          <ClientSelector
            clients={clients}
            value={selectedClientId}
            onChange={handleClientChange}
            error={errors.client_id?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date de facturation *</Label>
          <DatePickerField
            label="Date"
            date={watchDate}
            onSelect={(date) => setValue('date', date)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="echeance">Date d'échéance *</Label>
          <DatePickerField
            label="Échéance"
            date={watchEcheance}
            onSelect={(date) => setValue('echeance', date)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut *</Label>
          <StatusSelector
            value={watchStatus}
            onChange={(status) => setValue('status', status)}
            type="document"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode">Mode de paiement</Label>
          <ModePaiementSelector
            value={watchMode || ''}
            onChange={(mode) => setValue('mode', mode)}
          />
        </div>
      </div>

      {/* Ajout rapide — Impôts du client & CGA (montants réels calculés) */}
      <div className="space-y-2">
        <Label>Impôts du client &amp; CGA</Label>
        {clientSpec ? (
          impotButtons.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {impotButtons.map((btn) => (
                <Button
                  key={btn.key}
                  type="button"
                  size="sm"
                  variant="outline"
                  className={btn.color}
                  onClick={() => applyImpotButton(btn)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {btn.label.replace(/^\+\s*/, '')}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Aucun impôt calculé pour ce client.</p>
          )
        ) : (
          <p className="text-xs text-gray-500">Sélectionnez un client pour proposer ses impôts.</p>
        )}
      </div>

      {/* Ajout rapide — Honoraires selon le régime fiscal */}
      <div className="space-y-2">
        <Label>
          Honoraires selon le régime{!selectedClient ? ' (IGS par défaut)' : ''}
        </Label>
        <div className="flex flex-wrap gap-2">
          {honorairesOptions.map((def) => (
            <Button
              key={def.designation}
              type="button"
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={() => addHonoraire(def)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {def.designation}
            </Button>
          ))}
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
          impotsOptions={impotsOptions}
          honorairesOptions={honorairesOptions}
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

      {/* Totals by type */}
      {prestations.length > 0 && (
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Impôts :</span>
            <span className="font-medium">{formatMontant(totals.impots)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Honoraires :</span>
            <span className="font-medium">{formatMontant(totals.honoraires)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t pt-2">
            <span>Total Général :</span>
            <span>{formatMontant(totals.total)}</span>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#84A98C] hover:bg-[#6B8E74] text-white"
        >
          {isSubmitting ? 'Création...' : 'Créer la facture'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CreateFactureForm;
