
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useFactures } from "@/hooks/useFactures";
import { Facture, Prestation } from "@/types/facture";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

export interface FactureFormData {
  client_id: string;
  date: Date;
  echeance: Date;
  status: string;
  mode_paiement: string;
  prestations: Prestation[];
  notes?: string;
}

export function useFactureForm(onSuccess: () => void) {
  const { toast } = useToast();
  const { addFacture } = useFactures();
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", quantite: 1, montant: 0 },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch clients using the client service
  const { data: allClients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FactureFormData>({
    defaultValues: {
      client_id: "",
      date: new Date(),
      echeance: new Date(new Date().setDate(new Date().getDate() + 30)), // +30 jours par défaut
      status: "en_attente",
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
  const selectedModePaiement = watch("mode_paiement");
  const notes = watch("notes");

  useEffect(() => {
    const total = prestations.reduce((sum, prestation) => {
      return sum + (prestation.montant * (prestation.quantite || 1));
    }, 0);
    setTotalAmount(total);
  }, [prestations]);

  const onSubmit = (data: FactureFormData) => {
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

    const factureId = `F-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const nouvelleFacture: Facture = {
      id: factureId,
      client_id: selectedClient.id,
      client: {
        id: selectedClient.id,
        nom: selectedClient.nom || "",
        adresse: selectedClient.adresse?.ville || "",
        telephone: selectedClient.contact?.telephone || "",
        email: selectedClient.contact?.email || ""
      },
      date: formattedDate,
      echeance: formattedEcheance,
      montant: totalAmount,
      montant_paye: 0,
      status: data.status as "en_attente" | "envoyée" | "payée" | "partiellement_payée" | "annulée",
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

    addFacture(nouvelleFacture);
    
    toast({
      title: "Facture créée",
      description: `La facture ${factureId} a été créée avec succès.`,
    });
    
    onSuccess();
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
    selectedModePaiement,
    notes,
    allClients,
    onSubmit
  };
}
