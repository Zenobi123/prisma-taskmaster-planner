
import { Button } from "@/components/ui/button";
import { ClientType, Client } from "@/types/client";
import { ClientTypeSelect } from "./ClientTypeSelect";
import { ClientFormFields } from "./form/ClientFormFields";
import { CapitalSocialFormCreation } from "./capital/CapitalSocialFormCreation";
import { CapitalSocialSection } from "./capital/CapitalSocialSection";
import { useClientForm } from "@/hooks/useClientForm";

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

  const isPersonneMorale = type === 'morale';

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

      {/* Section Capital Social - uniquement pour les personnes morales */}
      {isPersonneMorale && (
        <div className="w-full border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Capital Social et Actionnaires</h3>
          {initialData ? (
            <CapitalSocialSection client={initialData} />
          ) : (
            <CapitalSocialFormCreation 
              onCapitalChange={(data) => handleChange('capitalSocial', data)}
              onActionnaireChange={(data) => handleChange('actionnaires', data)}
            />
          )}
        </div>
      )}

      <Button type="submit" className="w-full">
        {initialData ? "Modifier le client" : "Ajouter le client"}
      </Button>
    </form>
  );
}
