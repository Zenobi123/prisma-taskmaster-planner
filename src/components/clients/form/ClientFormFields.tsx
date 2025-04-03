
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientType } from "@/types/client";
import { ClientIdentityFields } from "../ClientIdentityFields";
import { ClientProfessionalFields } from "../ClientProfessionalFields";
import { ClientAddressFields } from "../ClientAddressFields";
import { ClientContactFields } from "../ClientContactFields";

interface ClientFormFieldsProps {
  type: ClientType;
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export function ClientFormFields({ type, formData, onChange }: ClientFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Identité</h3>
        <ClientIdentityFields 
          type={type}
          nom={formData.nom || ""}
          raisonsociale={formData.raisonsociale || ""}
          sigle={formData.sigle || ""}
          datecreation={formData.datecreation || ""}
          lieucreation={formData.lieucreation || ""}
          nomdirigeant={formData.nomdirigeant || ""}
          formejuridique={formData.formejuridique}
          sexe={formData.sexe}
          etatcivil={formData.etatcivil}
          regimefiscal={formData.regimefiscal}
          situationimmobiliere={formData.situationimmobiliere}
          onChange={onChange}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations professionnelles</h3>
        <ClientProfessionalFields 
          niu={formData.niu || ""}
          centrerattachement={formData.centrerattachement || ""}
          secteuractivite={formData.secteuractivite || ""}
          numerocnps={formData.numerocnps || ""}
          gestionexternalisee={formData.gestionexternalisee || false}
          onChange={onChange}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adresse</h3>
        <ClientAddressFields 
          ville={formData.adresse?.ville || ""}
          quartier={formData.adresse?.quartier || ""}
          lieuDit={formData.adresse?.lieuDit || ""}
          onChange={(name, value) => {
            onChange(`adresse.${name}`, value);
          }}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact</h3>
        <ClientContactFields 
          telephone={formData.contact?.telephone || ""}
          email={formData.contact?.email || ""}
          onChange={(name, value) => {
            onChange(`contact.${name}`, value);
          }}
        />
      </div>
    </div>
  );
}
