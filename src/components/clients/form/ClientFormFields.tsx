
import { ClientType, FormeJuridique, Sexe, EtatCivil, RegimeFiscalPhysique, RegimeFiscalMorale, SituationImmobiliere } from "@/types/client";
import { ClientIdentityFields } from "../ClientIdentityFields";
import { ClientAddressFields } from "../ClientAddressFields";
import { ClientContactFields } from "../ClientContactFields";
import { ClientProfessionalFields } from "../ClientProfessionalFields";

interface FormDataType {
  nom: string;
  raisonsociale: string;
  sigle: string;
  datecreation: string;
  lieucreation: string;
  nomdirigeant: string;
  formejuridique?: FormeJuridique;
  niu: string;
  centrerattachement: string;
  ville: string;
  quartier: string;
  lieuDit: string;
  telephone: string;
  email: string;
  secteuractivite: string;
  numerocnps: string;
  gestionexternalisee: boolean;
  sexe: Sexe;
  etatcivil: EtatCivil;
  regimefiscal: RegimeFiscalPhysique | RegimeFiscalMorale;
  situationimmobiliere: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  igs?: any;
}

interface ClientFormFieldsProps {
  type: ClientType;
  formData: FormDataType;
  onChange: (name: string, value: any) => void;
}

export function ClientFormFields({ type, formData, onChange }: ClientFormFieldsProps) {
  return (
    <div className="space-y-4">
      <ClientIdentityFields
        type={type}
        nom={formData.nom}
        raisonsociale={formData.raisonsociale}
        sigle={formData.sigle}
        datecreation={formData.datecreation}
        lieucreation={formData.lieucreation}
        nomdirigeant={formData.nomdirigeant}
        formejuridique={formData.formejuridique}
        sexe={formData.sexe}
        etatcivil={formData.etatcivil}
        regimefiscal={formData.regimefiscal}
        situationimmobiliere={formData.situationimmobiliere}
        igs={formData.igs}
        onChange={onChange}
      />

      <ClientProfessionalFields
        niu={formData.niu}
        centrerattachement={formData.centrerattachement}
        secteuractivite={formData.secteuractivite}
        numerocnps={formData.numerocnps}
        gestionexternalisee={formData.gestionexternalisee}
        onChange={onChange}
      />

      <ClientAddressFields
        ville={formData.ville}
        quartier={formData.quartier}
        lieuDit={formData.lieuDit}
        onChange={onChange}
      />

      <ClientContactFields
        telephone={formData.telephone}
        email={formData.email}
        onChange={onChange}
      />
    </div>
  );
}
