
import { Button } from "@/components/ui/button";
import { ClientType, Client } from "@/types/client";
import { ClientTypeSelect } from "./ClientTypeSelect";
import { ClientFormFields } from "./form/ClientFormFields";
import { useClientForm } from "@/hooks/clientForm";

interface ClientFormProps {
  onSubmit: (data: any) => void;
  type: ClientType;
  onTypeChange?: (value: ClientType) => void;
  initialData?: Client;
}

export function ClientForm({ onSubmit, type, onTypeChange, initialData }: ClientFormProps) {
  const { formData, handleChange, prepareSubmitData } = useClientForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientData = prepareSubmitData(type);
    onSubmit(clientData);
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

      <Button type="submit" className="w-full">
        {initialData ? "Modifier le client" : "Ajouter le client"}
      </Button>
    </form>
  );
}
