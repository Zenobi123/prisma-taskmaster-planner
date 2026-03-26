
import { ClientType, FormeJuridique, Sexe, EtatCivil, SituationImmobiliere, RegimeFiscal, Civilite, ModePaiement } from "@/types/client";
import { ClientIdentityFields } from "../ClientIdentityFields";
import { ClientAddressFields } from "../ClientAddressFields";
import { ClientContactFields } from "../ClientContactFields";
import { ClientProfessionalFields } from "../ClientProfessionalFields";

interface FormDataType {
  nom: string;
  nomcommercial: string;
  numerorccm: string;
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
  regimefiscal: RegimeFiscal;
  civilite: Civilite;
  chiffreaffaires: string;
  iscga: boolean;
  isvendeurboissons: boolean;
  modepaiementigs: ModePaiement;
  modepaiementpsl: ModePaiement;
  gestionexternalisee: boolean;
  inscriptionfanrharmony2: boolean;
  sexe: Sexe;
  etatcivil: EtatCivil;
  situationimmobiliere: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
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
        nomcommercial={formData.nomcommercial}
        numerorccm={formData.numerorccm}
        raisonsociale={formData.raisonsociale}
        sigle={formData.sigle}
        datecreation={formData.datecreation}
        lieucreation={formData.lieucreation}
        nomdirigeant={formData.nomdirigeant}
        formejuridique={formData.formejuridique}
        sexe={formData.sexe}
        etatcivil={formData.etatcivil}
        situationimmobiliere={formData.situationimmobiliere}
        onChange={onChange}
      />

      <ClientProfessionalFields
        niu={formData.niu}
        centrerattachement={formData.centrerattachement}
        secteuractivite={formData.secteuractivite}
        numerocnps={formData.numerocnps}
        regimefiscal={formData.regimefiscal}
        civilite={formData.civilite}
        chiffreaffaires={formData.chiffreaffaires}
        iscga={formData.iscga}
        isvendeurboissons={formData.isvendeurboissons}
        modepaiementigs={formData.modepaiementigs}
        modepaiementpsl={formData.modepaiementpsl}
        gestionexternalisee={formData.gestionexternalisee}
        inscriptionfanrharmony2={formData.inscriptionfanrharmony2}
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
