
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

export const useFactures = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('factures')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      const mappedFactures: Facture[] = data.map((row: any) => ({
        id: row.id,
        client: {
          id: row.client_id,
          nom: row.client_nom,
          adresse: row.client_adresse,
          telephone: row.client_telephone,
          email: row.client_email
        },
        date: row.date,
        echeance: row.echeance,
        montant: Number(row.montant),
        status: row.status,
        prestations: Array.isArray(row.prestations) 
          ? row.prestations 
          : JSON.parse(row.prestations),
        notes: row.notes,
        modeReglement: row.mode_reglement,
        moyenPaiement: row.moyen_paiement
      }));
      
      setFactures(mappedFactures);
      console.log("Factures chargées:", mappedFactures);
    } catch (error) {
      console.error("Erreur lors du chargement des factures:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => {
    try {
      const { error } = await supabase
        .from('factures')
        .update({ status: newStatus })
        .eq('id', factureId);
        
      if (error) {
        throw error;
      }
      
      const updatedFactures = factures.map(facture => 
        facture.id === factureId 
          ? { ...facture, status: newStatus } 
          : facture
      );
      
      setFactures(updatedFactures);
      
      toast({
        title: "Statut mis à jour",
        description: `La facture ${factureId} est maintenant ${newStatus.replace('_', ' ')}.`
      });

      return updatedFactures.find(f => f.id === factureId);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleDeleteInvoice = async (factureId: string) => {
    try {
      const { error } = await supabase
        .from('factures')
        .delete()
        .eq('id', factureId);
        
      if (error) throw error;
      
      setFactures(factures.filter(f => f.id !== factureId));
      
      toast({
        title: "Facture supprimée",
        description: `La facture ${factureId} a été supprimée avec succès.`,
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleCreateInvoice = async (formData: any) => {
    try {
      const newId = `F${new Date().getFullYear()}-${(factures.length + 1).toString().padStart(3, '0')}`;
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', formData.clientId)
        .single();
        
      if (clientError) {
        throw new Error("Client non trouvé");
      }
      
      const montantTotal = formData.prestations.reduce((sum: number, p: any) => sum + p.montant, 0);
      
      // Get client name correctly based on client type
      const clientNom = clientData.type === 'physique' 
        ? clientData.nom || "Client sans nom"
        : clientData.raisonsociale || "Client sans nom";
      
      // Safely extract client address
      let clientAdresse = "Adresse non spécifiée";
      if (clientData.adresse && typeof clientData.adresse === 'object' && 'ville' in clientData.adresse) {
        clientAdresse = String(clientData.adresse.ville) || "Adresse non spécifiée";
      }
      
      // Safely extract client telephone
      let clientTelephone = "Téléphone non spécifié";
      if (clientData.contact && typeof clientData.contact === 'object' && 'telephone' in clientData.contact) {
        clientTelephone = String(clientData.contact.telephone) || "Téléphone non spécifié";
      }
      
      // Safely extract client email
      let clientEmail = "Email non spécifié";
      if (clientData.contact && typeof clientData.contact === 'object' && 'email' in clientData.contact) {
        clientEmail = String(clientData.contact.email) || "Email non spécifié";
      }
      
      const newFacture = {
        id: newId,
        client_id: formData.clientId,
        client_nom: clientNom,
        client_adresse: clientAdresse,
        client_telephone: clientTelephone,
        client_email: clientEmail,
        date: formData.dateEmission,
        echeance: formData.dateEcheance,
        montant: montantTotal,
        status: formData.modeReglement === 'comptant' ? 'payée' : 'en_attente',
        prestations: JSON.stringify(formData.prestations),
        notes: formData.notes,
        mode_reglement: formData.modeReglement,
        moyen_paiement: formData.moyenPaiement
      };
      
      const { error: insertError } = await supabase
        .from('factures')
        .insert(newFacture);
        
      if (insertError) {
        throw insertError;
      }
      
      const newFactureForState: Facture = {
        id: newId,
        client: {
          id: formData.clientId,
          nom: clientNom,
          adresse: clientAdresse,
          telephone: clientTelephone,
          email: clientEmail
        },
        date: formData.dateEmission,
        echeance: formData.dateEcheance,
        montant: montantTotal,
        status: formData.modeReglement === 'comptant' ? 'payée' : 'en_attente',
        prestations: formData.prestations,
        notes: formData.notes,
        modeReglement: formData.modeReglement,
        moyenPaiement: formData.moyenPaiement
      };
      
      setFactures([...factures, newFactureForState]);
      
      toast({
        title: "Facture créée",
        description: "La nouvelle facture a été créée avec succès.",
      });
      
      return newFactureForState;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    factures,
    isLoading,
    handleUpdateStatus,
    handleDeleteInvoice,
    handleCreateInvoice
  };
};
