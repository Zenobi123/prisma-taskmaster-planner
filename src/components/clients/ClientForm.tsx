
import { Button } from "@/components/ui/button";
import { ClientType, Client } from "@/types/client";
import { ClientTypeSelect } from "./ClientTypeSelect";
import { ClientIdentityFields } from "./ClientIdentityFields";
import { ClientAddressFields } from "./ClientAddressFields";
import { ClientContactFields } from "./ClientContactFields";
import { ClientProfessionalFields } from "./ClientProfessionalFields";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {onTypeChange && (
          <ClientTypeSelect type={type} onTypeChange={onTypeChange} />
        )}

        <ClientIdentityFields
          type={type}
          nom={formData.nom}
          raisonsociale={formData.raisonsociale}
          sexe={formData.sexe}
          etatcivil={formData.etatcivil}
          regimefiscal={formData.regimefiscal}
          situationimmobiliere={formData.situationimmobiliere}
          onChange={handleChange}
        />

        <ClientProfessionalFields
          niu={formData.niu}
          centrerattachement={formData.centrerattachement}
          secteuractivite={formData.secteuractivite}
          numerocnps={formData.numerocnps}
          gestionexternalisee={formData.gestionexternalisee}
          onChange={handleChange}
        />

        <ClientAddressFields
          ville={formData.ville}
          quartier={formData.quartier}
          lieuDit={formData.lieuDit}
          onChange={handleChange}
        />

        <ClientContactFields
          telephone={formData.telephone}
          email={formData.email}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Modifier le client" : "Ajouter le client"}
      </Button>
    </form>
  );
}
