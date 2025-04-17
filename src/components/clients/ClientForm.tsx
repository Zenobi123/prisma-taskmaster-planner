
import { Button } from "@/components/ui/button";
import { ClientType, Client, RegimeFiscal } from "@/types/client";
import { ClientTypeSelect } from "./ClientTypeSelect";
import { ClientFormFields } from "./form/ClientFormFields";
import { useClientForm } from "@/hooks/clientForm";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ClientFormProps {
  onSubmit: (data: any) => void;
  type: ClientType;
  onTypeChange?: (value: ClientType) => void;
  initialData?: Client;
}

export function ClientForm({ onSubmit, type, onTypeChange, initialData }: ClientFormProps) {
  const { toast } = useToast();
  const { formData, handleChange, prepareSubmitData } = useClientForm(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Loguer les données initiales et en particulier la valeur du regime fiscal
  useEffect(() => {
    if (initialData) {
      console.log("Initial client data loaded:", initialData);
      console.log("Initial regime fiscal:", initialData.regimefiscal);
      
      // Si le client a un regimefiscal défini, assurons-nous que formData l'a aussi
      if (initialData.regimefiscal && !formData.regimefiscal) {
        console.log("Setting formData regimefiscal from initialData:", initialData.regimefiscal);
        handleChange("regimefiscal", initialData.regimefiscal);
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Vérifier que formData contient regimefiscal avant de préparer les données
      console.log("Current formData before submission:", formData);
      console.log("Current regime fiscal before submission:", formData.regimefiscal);
      
      if (!formData.regimefiscal) {
        console.warn("Regime fiscal is missing in formData, using default value");
        // Appliquer une valeur par défaut basée sur le type
        const defaultRegime: RegimeFiscal = type === "physique" ? "reel" : "simplifie";
        handleChange("regimefiscal", defaultRegime);
      }
      
      // Passer explicitement le type pour la préparation des données
      const clientData = prepareSubmitData(type);
      console.log("Submitting client data:", JSON.stringify(clientData, null, 2));
      
      // Loguer spécifiquement pour confirmer que regimefiscal est inclus
      console.log("Régime fiscal being submitted:", clientData.regimefiscal);
      
      if (!clientData.regimefiscal) {
        console.warn("WARNING: regimefiscal is missing in form submission!");
        toast({
          title: "Attention",
          description: "Le régime fiscal n'a pas été défini. Veuillez sélectionner un régime fiscal.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      onSubmit(clientData);
    } catch (error) {
      console.error("Error preparing client data:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la préparation des données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {onTypeChange && (
        <ClientTypeSelect type={type} onTypeChange={onTypeChange} />
      )}

      <ClientFormFields 
        type={type}
        formData={formData}
        onChange={handleChange}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {initialData ? "Modifier le client" : "Ajouter le client"}
      </Button>
    </form>
  );
}
