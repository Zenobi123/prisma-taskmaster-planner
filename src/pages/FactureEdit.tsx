import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { format } from "date-fns";
import { parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchFactureById } from "@/services/facture/facturesQuery";
import { useFactures } from "@/hooks/useFactures";
import { Prestation } from "@/types/facture";

import { FactureEditHeader } from "@/components/facturation/factureEdit/FactureEditHeader";
import { ClientInfoCard } from "@/components/facturation/factureEdit/ClientInfoCard";
import { DatesCard } from "@/components/facturation/factureEdit/DatesCard";
import { PrestationsCard } from "@/components/facturation/factureEdit/PrestationsCard";
import { PaymentModeCard } from "@/components/facturation/factureEdit/PaymentModeCard";
import { NotesCard } from "@/components/facturation/factureEdit/NotesCard";
import { FactureEditLoading } from "@/components/facturation/factureEdit/FactureEditLoading";
import { FactureEditError } from "@/components/facturation/factureEdit/FactureEditError";
import { FactureAlreadyPaid } from "@/components/facturation/factureEdit/FactureAlreadyPaid";

const FactureEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateEmission, setDateEmission] = useState<Date | undefined>();
  const [dateEcheance, setDateEcheance] = useState<Date | undefined>();
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { data: facture, isLoading, isError } = useQuery({
    queryKey: ['facture', id],
    queryFn: () => id ? fetchFactureById(id) : Promise.reject("ID manquant"),
    enabled: !!id
  });
  
  const { handleUpdateInvoice } = useFactures();
  
  const form = useForm({
    defaultValues: {
      date: "",
      echeance: "",
      prestations: [] as Prestation[],
      notes: "",
      mode_reglement: "",
    }
  });
  
  useEffect(() => {
    if (facture) {
      try {
        const dateObj = parseISO(facture.date);
        const echeanceObj = parseISO(facture.echeance);
        setDateEmission(dateObj);
        setDateEcheance(echeanceObj);
        form.setValue("date", facture.date);
        form.setValue("echeance", facture.echeance);
      } catch (e) {
        console.error("Erreur lors du parsing des dates:", e);
      }
      
      setPrestations(facture.prestations);
      form.setValue("prestations", facture.prestations);
      
      form.setValue("notes", facture.notes || "");
      form.setValue("mode_reglement", facture.mode_reglement || "");
    }
  }, [facture, form]);
  
  useEffect(() => {
    if (dateEmission) {
      form.setValue("date", format(dateEmission, "yyyy-MM-dd"));
    }
    
    if (dateEcheance) {
      form.setValue("echeance", format(dateEcheance, "yyyy-MM-dd"));
    }
    
    form.setValue("prestations", prestations);
  }, [dateEmission, dateEcheance, prestations, form]);
  
  const onSubmit = async (data: any) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const montant = prestations.reduce((sum, p) => sum + p.montant, 0);
      
      const updateData = {
        ...data,
        prestations,
        montant,
      };
      
      await handleUpdateInvoice(id, updateData);
      
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès.",
      });
      
      navigate(`/facturation/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la facture.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackClick = () => {
    navigate(`/facturation/${id}`);
  };

  if (isLoading) {
    return <FactureEditLoading />;
  }
  
  if (isError || !facture) {
    return <FactureEditError onBackClick={() => navigate("/facturation")} />;
  }
  
  if (facture.status === "paye") {
    return <FactureAlreadyPaid factureId={id || ""} onBackClick={handleBackClick} />;
  }

  return (
    <div className="container mx-auto py-8">
      <FactureEditHeader factureId={facture.id} onBackClick={handleBackClick} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ClientInfoCard facture={facture} />
          
          <DatesCard 
            dateEmission={dateEmission} 
            dateEcheance={dateEcheance}
            setDateEmission={setDateEmission}
            setDateEcheance={setDateEcheance}
          />
          
          <PrestationsCard 
            prestations={prestations}
            setPrestations={setPrestations}
          />
          
          <PaymentModeCard form={form} />
          
          <NotesCard 
            form={form} 
            loading={loading} 
            prestationsLength={prestations.length} 
          />
        </form>
      </Form>
    </div>
  );
};

export default FactureEdit;
