
import { toast } from 'sonner';
import { format } from 'date-fns';
import { addFactureToDatabase } from '@/services/factureService';
import { Facture, Prestation } from '@/types/facture';
import { FactureFormData } from '@/types/factureForm';
import { getMissingClientFields, type ClientSpec } from '@/lib/spec/fiscal';

export const useFactureFormSubmit = (
  selectedClientId: string,
  prestations: Prestation[],
  onFactureCreated: (facture?: Facture) => void,
  onOpenChange: (open: boolean) => void,
  clientSpec?: ClientSpec | null
) => {
  const onSubmit = async (data: FactureFormData) => {
    try {
      if (!selectedClientId) {
        toast.error('Veuillez sélectionner un client');
        return;
      }

      // Référence : l'émission est bloquée tant que la fiche client est incomplète.
      if (clientSpec) {
        const champsManquants = getMissingClientFields(clientSpec);
        if (champsManquants.length > 0) {
          toast.error(`Impossible d'émettre la facture. Fiche client incomplète : ${champsManquants.join(', ')}`);
          return;
        }
      }

      if (prestations.length === 0) {
        toast.error('Veuillez ajouter au moins une prestation');
        return;
      }

      const totalAmount = prestations.reduce((sum, p) => sum + p.montant, 0);

      const factureData = {
        id: crypto.randomUUID(),
        client_id: selectedClientId,
        date: format(data.date, 'yyyy-MM-dd'),
        echeance: format(data.echeance, 'yyyy-MM-dd'),
        prestations: prestations.map(p => ({
          id: p.id || crypto.randomUUID(),
          description: p.description,
          type: p.type || "honoraire" as const,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          montant: p.montant
        })),
        montant: totalAmount,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: "non_payée" as const,
        mode: data.mode || '',
        notes: data.notes || '',
      };

      const created = await addFactureToDatabase(
        factureData as Parameters<typeof addFactureToDatabase>[0],
      );

      toast.success('Facture créée avec succès');
      // On renvoie la facture créée (avec numéro) pour l'aperçu fidèle automatique.
      onFactureCreated(created);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return { onSubmit };
};
