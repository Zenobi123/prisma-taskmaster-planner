
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, parse } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useFactures } from "@/hooks/facturation/useFactures";
import { Facture, Prestation } from "@/types/facture";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { getNextFactureNumber } from "@/services/factureService";

export interface FactureFormData {
  client_id: string;
  date: Date;
  echeance: Date;
  status: string;
  status_paiement: string;
  mode_paiement: string;
  prestations: Prestation[];
  notes?: string;
}

export function useFactureForm(onSuccess: () => void, editMode: boolean = false) {
  const { toast } = useToast();
  const { addFacture, updateFacture, factures } = useFactures();
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", quantite: 1, montant: 0 },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editFactureId, setEditFactureId] = useState<string | null>(null);

  // Fetch clients using the client service
  const { data: allClients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FactureFormData>({
    defaultValues: {
      client_id: "",
      date: new Date(),
      echeance: new Date(new Date().setDate(new Date().getDate() + 30)), // +30 jours par défaut
      status: "brouillon",
      status_paiement: "non_payée",
      mode_paiement: "espèces",
      prestations: prestations,
      notes: ""
    }
  });

  const selectedClientId = watch("client_id");
  const selectedClient = allClients.find(client => client.id === selectedClientId);
  const selectedDate = watch("date");
  const selectedEcheance = watch("echeance");
  const selectedStatus = watch("status");
  const selectedStatusPaiement = watch("status_paiement");
  const selectedModePaiement = watch("mode_paiement");
  const notes = watch("notes");

  // When status changes to 'brouillon', automatically set payment status to 'non_payée'
  useEffect(() => {
    if (selectedStatus === "brouillon") {
      setValue("status_paiement", "non_payée");
    }
  }, [selectedStatus, setValue]);

  useEffect(() => {
    const total = prestations.reduce((sum, prestation) => {
      return sum + (prestation.montant * (prestation.quantite || 1));
    }, 0);
    setTotalAmount(total);
  }, [prestations]);

  // Function to initialize form for editing
  const initializeFormForEdit = useCallback((facture: Facture) => {
    // Set edit facture ID
    setEditFactureId(facture.id);
    
    // Set form values
    setValue("client_id", facture.client_id);
    
    // Convert date strings to Date objects
    const dateFormat = "dd/MM/yyyy";
    const dateObj = parse(facture.date, dateFormat, new Date());
    const echeanceObj = parse(facture.echeance, dateFormat, new Date());
    
    setValue("date", dateObj);
    setValue("echeance", echeanceObj);
    setValue("status", facture.status);
    setValue("status_paiement", facture.status_paiement);
    setValue("mode_paiement", facture.mode_paiement || "espèces");
    setValue("notes", facture.notes || "");
    
    // Set prestations
    if (facture.prestations && facture.prestations.length > 0) {
      setPrestations(facture.prestations);
    }
  }, [setValue, setPrestations]);

  const onSubmit = async (data: FactureFormData) => {
    if (!selectedClient) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un client.",
      });
      return;
    }

    if (prestations.some(p => !p.description || p.montant <= 0)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir correctement tous les champs des prestations.",
      });
      return;
    }

    const formattedDate = format(data.date, "dd/MM/yyyy");
    const formattedEcheance = format(data.echeance, "dd/MM/yyyy");

    try {
      if (editMode && editFactureId) {
        // Update existing facture
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
          status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée",
          mode_paiement: data.mode_paiement,
          prestations: prestations.map(p => ({
            id: p.id || uuidv4(),
            description: p.description,
            quantite: p.quantite,
            montant: p.montant,
          })),
          notes: data.notes,
          updated_at: new Date().toISOString(),
        };

        await updateFacture(factureToUpdate);
        
        toast({
          title: "Facture mise à jour",
          description: `La facture ${editFactureId} a été mise à jour avec succès.`,
        });
      } else {
        // Create new facture
        // Generate the next facture number in format FP XXXX-YYYY
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
          status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée",
          mode_paiement: data.mode_paiement,
          prestations: prestations.map(p => ({
            id: uuidv4(),
            description: p.description,
            quantite: p.quantite,
            montant: p.montant,
          })),
          paiements: [],
          notes: data.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Save the facture to Supabase via the useFactures hook
        await addFacture(nouvelleFacture);
        
        // Show success message and close modal
        toast({
          title: "Facture créée",
          description: `La facture ${factureId} a été créée avec succès.`,
        });
      }
      
      onSuccess();
      
      // Reset form if needed
      if (!editMode) {
        reset();
        setPrestations([{ description: "", quantite: 1, montant: 0 }]);
      }
    } catch (error) {
      console.error("Error handling facture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors du traitement de la facture.",
      });
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    prestations,
    setPrestations,
    totalAmount,
    selectedClientId,
    selectedClient,
    selectedDate,
    selectedEcheance,
    selectedStatus,
    selectedStatusPaiement,
    selectedModePaiement,
    notes,
    allClients,
    onSubmit,
    initializeFormForEdit
  };
}
