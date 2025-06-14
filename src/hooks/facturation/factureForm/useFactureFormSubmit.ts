
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Facture, Prestation } from "@/types/facture";
import { Client } from "@/types/client";
import { FactureFormData } from "./useFactureFormState";
import { getNextFactureNumber } from "@/services/factureService";

export const useFactureFormSubmit = (
  addFacture: (facture: Facture) => Promise<boolean>,
  updateFacture: (facture: Facture) => Promise<boolean>,
  onSuccess: (result: Facture | string) => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitNewFacture = async (
    data: FactureFormData,
    selectedClient: Client | undefined,
    prestations: Prestation[],
    totalAmount: number
  ) => {
    if (!selectedClient) return false;
    
    setIsSubmitting(true);
    
    try {
      // Format dates to strings
      const formattedDate = typeof data.date === 'string' ? data.date : format(data.date, "dd/MM/yyyy");
      const formattedEcheance = typeof data.echeance === 'string' ? data.echeance : format(data.echeance, "dd/MM/yyyy");
      
      // Generate the next facture number
      const nextNumber = await getNextFactureNumber();
      const currentYear = new Date().getFullYear();
      const factureId = `FP ${nextNumber}-${currentYear}`;
      
      console.log("Creating new facture with ID:", factureId);

      const nouvelleFacture: Facture = {
        id: factureId,
        client_id: selectedClient.id,
        client: {
          id: selectedClient.id,
          nom: selectedClient.nom || selectedClient.raisonsociale || "",
          adresse: selectedClient.adresse?.ville || "",
          telephone: selectedClient.contact?.telephone || "",
          email: selectedClient.contact?.email || ""
        },
        date: formattedDate,
        echeance: formattedEcheance,
        montant: totalAmount,
        montant_paye: 0,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
        mode_paiement: data.mode_paiement,
        prestations: prestations.map(p => ({
          id: uuidv4(),
          description: p.description,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
        })),
        paiements: [],
        notes: data.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save the facture
      const success = await addFacture(nouvelleFacture);
      
      if (success) {
        toast({
          title: "Facture créée",
          description: `La facture ${factureId} a été créée avec succès.`,
        });
        onSuccess(nouvelleFacture);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error creating facture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de la facture.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const submitFactureUpdate = async (
    data: FactureFormData,
    editFactureId: string,
    selectedClient: Client | undefined,
    prestations: Prestation[],
    totalAmount: number
  ) => {
    if (!selectedClient) return false;
    
    setIsSubmitting(true);
    
    try {
      // Format dates to strings
      const formattedDate = typeof data.date === 'string' ? data.date : format(data.date, "dd/MM/yyyy");
      const formattedEcheance = typeof data.echeance === 'string' ? data.echeance : format(data.echeance, "dd/MM/yyyy");
      
      const factureToUpdate: Facture = {
        id: editFactureId,
        client_id: selectedClient.id,
        client: {
          id: selectedClient.id,
          nom: selectedClient.nom || selectedClient.raisonsociale || "",
          adresse: selectedClient.adresse?.ville || "",
          telephone: selectedClient.contact?.telephone || "",
          email: selectedClient.contact?.email || ""
        },
        date: formattedDate,
        echeance: formattedEcheance,
        montant: totalAmount,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
        mode_paiement: data.mode_paiement,
        prestations: prestations.map(p => ({
          id: p.id || uuidv4(),
          description: p.description,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
        })),
        notes: data.notes,
        updated_at: new Date().toISOString(),
      };

      // Update the facture
      const success = await updateFacture(factureToUpdate);
      
      if (success) {
        toast({
          title: "Facture mise à jour",
          description: `La facture ${editFactureId} a été mise à jour avec succès.`,
        });
        onSuccess(factureToUpdate);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error updating facture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de la facture.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    submitNewFacture,
    submitFactureUpdate,
    isSubmitting
  };
};
