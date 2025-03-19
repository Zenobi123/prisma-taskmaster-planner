
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { createFacture, updateFacture } from "@/services/factureService";
import { Facture, Prestation } from "@/types/facture";
import { format } from "date-fns";

// Schéma de validation pour une prestation
const prestationSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  quantite: z.number().min(1, "La quantité doit être d'au moins 1"),
  montant: z.number().min(0, "Le montant ne peut pas être négatif"),
  taux: z.number().min(0).max(100).optional()
});

// Schéma de validation pour une facture
const factureSchema = z.object({
  client_id: z.string().uuid("Veuillez sélectionner un client"),
  date: z.date(),
  echeance: z.date(),
  notes: z.string().optional(),
  prestations: z.array(prestationSchema).min(1, "Au moins une prestation est requise")
});

type FactureFormData = z.infer<typeof factureSchema>;

interface UseFactureFormProps {
  factureExistante?: Facture;
  onSuccess?: (facture: Facture) => void;
}

export function useFactureForm({ factureExistante, onSuccess }: UseFactureFormProps = {}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialiser le formulaire avec les données de la facture existante si disponible
  const defaultValues: Partial<FactureFormData> = factureExistante 
    ? {
        client_id: factureExistante.client_id,
        date: new Date(factureExistante.date),
        echeance: new Date(factureExistante.echeance),
        notes: factureExistante.notes,
        prestations: factureExistante.prestations.map(p => ({
          description: p.description,
          quantite: p.quantite,
          montant: p.montant,
          taux: p.taux
        }))
      }
    : {
        date: new Date(),
        echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // + 30 jours
        prestations: [{ description: "", quantite: 1, montant: 0 }]
      };

  const form = useForm<FactureFormData>({
    resolver: zodResolver(factureSchema),
    defaultValues
  });

  // Gérer l'ajout d'une prestation
  const ajouterPrestation = () => {
    const prestations = form.getValues("prestations") || [];
    form.setValue("prestations", [
      ...prestations,
      { description: "", quantite: 1, montant: 0 }
    ]);
  };

  // Gérer la suppression d'une prestation
  const supprimerPrestation = (index: number) => {
    const prestations = form.getValues("prestations");
    if (prestations.length > 1) {
      form.setValue(
        "prestations",
        prestations.filter((_, i) => i !== index)
      );
    } else {
      toast({
        title: "Action impossible",
        description: "Une facture doit comporter au moins une prestation",
        variant: "destructive"
      });
    }
  };

  // Calculer le total des prestations
  const calculerTotal = (): number => {
    const prestations = form.getValues("prestations") || [];
    return prestations.reduce(
      (total, prestation) => total + prestation.montant * prestation.quantite,
      0
    );
  };

  // Soumettre le formulaire
  const onSubmit = async (data: FactureFormData) => {
    try {
      setIsSubmitting(true);
      
      // Calculer le montant total
      const montantTotal = calculerTotal();
      
      // Préparer les données de la facture
      const factureData = {
        client_id: data.client_id,
        date: format(data.date, "yyyy-MM-dd"),
        echeance: format(data.echeance, "yyyy-MM-dd"),
        montant: montantTotal,
        status: "en_attente" as const,
        notes: data.notes || "",
        prestations: data.prestations.map(p => ({
          description: p.description,
          quantite: p.quantite,
          montant: p.montant,
          taux: p.taux || 0
        }))
      };
      
      let facture: Facture;
      
      // Créer ou mettre à jour la facture
      if (factureExistante) {
        facture = await updateFacture(factureExistante.id, factureData);
        toast({
          title: "Facture mise à jour",
          description: `La facture a été mise à jour avec succès.`
        });
      } else {
        facture = await createFacture(factureData);
        toast({
          title: "Facture créée",
          description: `La facture a été créée avec succès.`
        });
      }
      
      // Réinitialiser le formulaire et appeler le callback de succès
      if (!factureExistante) {
        form.reset();
      }
      
      if (onSuccess) {
        onSuccess(facture);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la facture:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la facture.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    ajouterPrestation,
    supprimerPrestation,
    calculerTotal,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
