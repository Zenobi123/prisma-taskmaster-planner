
import { Button } from "@/components/ui/button";
import { ClientType, Client } from "@/types/client";
import { ClientTypeSelect } from "./ClientTypeSelect";
import { ClientFormFields } from "./form/ClientFormFields";
import { useClientForm } from "@/hooks/clientForm";
import { useState } from "react";

interface ClientFormProps {
  onSubmit: (data: any) => void;
  type: ClientType;
  onTypeChange?: (value: ClientType) => void;
  initialData?: Client;
}

export function ClientForm({ onSubmit, type, onTypeChange, initialData }: ClientFormProps) {
  const { formData, handleChange, prepareSubmitData } = useClientForm(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Explicitly passing type as ClientType to ensure type safety
      const clientData = prepareSubmitData(type);
      console.log("Submitting client data:", clientData);
      
      // Log specifically to confirm regimefiscal is included
      console.log("Régime fiscal being submitted:", clientData.regimefiscal);
      
      onSubmit(clientData);
    } catch (error) {
      console.error("Error preparing client data:", error);
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
