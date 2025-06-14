import { useMutation, useQueryClient } from "@tanstack/react-query";
import { factureCreationService } from "@/services/factureCreationService";
import { Facture } from "@/types/facture";
import { toast } from "sonner";
import { format } from 'date-fns';
import { FactureFormData, Prestation } from "@/types/factureForm";
import { updateFacture } from "@/services/factureServices/factureUpdateService";

export const useFactureFormSubmit = (
  selectedClientId: string,
  prestations: Prestation[],
  onFactureCreated: () => void,
  onOpenChange: (open: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createFacture = useMutation({
    mutationFn: (factureData: Facture) => factureCreationService.createFacture(factureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      toast.success("Facture créée avec succès");
    },
    onError: (error) => {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error("Erreur lors de la création de la facture");
    }
  });

  const updateFacture = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Facture> }) => updateFacture(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      toast.success("Facture modifiée avec succès");
    },
    onError: (error) => {
      console.error('Erreur lors de la modification de la facture:', error);
      toast.error("Erreur lors de la modification de la facture");
    }
  });

  const onSubmit = async (data: FactureFormData) => {
    if (!selectedClientId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    if (prestations.length === 0) {
      toast.error("Veuillez ajouter au moins une prestation");
      return;
    }

    try {
      const factureData = {
        ...data,
        client_id: selectedClientId,
        date: format(data.date, 'yyyy-MM-dd'),
        echeance: format(data.echeance, 'yyyy-MM-dd'),
        prestations: prestations.map(p => ({
          id: p.id,
          description: p.description,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          montant: p.quantite * p.prix_unitaire
        })),
        montant: prestations.reduce((sum, p) => sum + (p.quantite * p.prix_unitaire), 0)
      };

      await createFacture.mutateAsync(factureData);
      onFactureCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error("Erreur lors de la création de la facture");
    }
  };

  const onEdit = async (data: FactureFormData, factureId: string) => {
    try {
      const factureData = {
        ...data,
        client_id: selectedClientId,
        date: format(data.date, 'yyyy-MM-dd'),
        echeance: format(data.echeance, 'yyyy-MM-dd'),
        prestations: prestations.map(p => ({
          id: p.id,
          description: p.description,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          montant: p.quantite * p.prix_unitaire
        })),
        montant: prestations.reduce((sum, p) => sum + (p.quantite * p.prix_unitaire), 0)
      };

      await updateFacture.mutateAsync({ id: factureId, data: factureData });
      onFactureCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la modification de la facture:', error);
      toast.error("Erreur lors de la modification de la facture");
    }
  };

  return {
    onSubmit,
    onEdit,
    isSubmitting: createFacture.isPending || updateFacture.isPending
  };
};
