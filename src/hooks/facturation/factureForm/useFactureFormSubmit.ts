
import { toast } from 'sonner';
import { format } from 'date-fns';
import { addFactureToDatabase } from '@/services/factureService';
import { Prestation } from '@/types/facture';
import { FactureFormData } from '@/types/factureForm';

export const useFactureFormSubmit = (
  selectedClientId: string,
  prestations: Prestation[],
  onFactureCreated: () => void,
  onOpenChange: (open: boolean) => void
) => {
  const onSubmit = async (data: FactureFormData) => {
    try {
      if (!selectedClientId) {
        toast.error('Veuillez sélectionner un client');
        return;
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
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          montant: p.montant
        })),
        montant: totalAmount,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: "non_payée" as const,
        mode: data.mode || '',
        notes: data.notes || '',
        client: {
          id: '',
          nom: '',
          adresse: '',
          telephone: '',
          email: ''
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        montant_paye: 0
      };

      await addFactureToDatabase(factureData);
      
      toast.success('Facture créée avec succès');
      onFactureCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return { onSubmit };
};
