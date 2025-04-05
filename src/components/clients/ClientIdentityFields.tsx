
import { ClientType, FormeJuridique, Sexe, EtatCivil, RegimeFiscalPhysique, RegimeFiscalMorale, SituationImmobiliere } from "@/types/client";
import { PersonalInfoFields } from "./identity/PersonalInfoFields";
import { CompanyInfoFields } from "./identity/CompanyInfoFields";
import { TaxRegimeFields } from "./identity/TaxRegimeFields";
import { TransitionFiscaleFields } from "./identity/TransitionFiscaleFields";
import { PropertyStatusFields } from "./identity/PropertyStatusFields";
import { TransitionFiscaleData } from "@/hooks/fiscal/types";

interface ClientIdentityFieldsProps {
  type: ClientType;
  nom: string;
  raisonsociale: string;
  sigle?: string;
  datecreation?: string;
  lieucreation?: string;
  nomdirigeant?: string;
  formejuridique?: FormeJuridique;
  sexe?: Sexe;
  etatcivil?: EtatCivil;
  regimefiscal?: RegimeFiscalPhysique | RegimeFiscalMorale;
  transitionFiscale?: TransitionFiscaleData;
  situationimmobiliere?: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  onChange: (name: string, value: any) => void;
}

export function ClientIdentityFields({ 
  type,
  nom = "",
  raisonsociale = "",
  sigle = "",
  datecreation = "",
  lieucreation = "",
  nomdirigeant = "",
  formejuridique,
  sexe = "homme",
  etatcivil = "celibataire",
  regimefiscal,
  transitionFiscale = { igsAssujetissement: false },
  situationimmobiliere = { type: "locataire" },
  onChange 
}: ClientIdentityFieldsProps) {
  return (
    <div className="space-y-6">
      {type === "physique" ? (
        <PersonalInfoFields
          nom={nom}
          sexe={sexe}
          etatcivil={etatcivil}
          onChange={onChange}
        />
      ) : (
        <CompanyInfoFields
          raisonsociale={raisonsociale}
          sigle={sigle}
          datecreation={datecreation}
          lieucreation={lieucreation}
          nomdirigeant={nomdirigeant}
          formejuridique={formejuridique}
          onChange={onChange}
        />
      )}

      <TaxRegimeFields
        type={type}
        regimefiscal={regimefiscal}
        onChange={onChange}
      />
      
      <TransitionFiscaleFields
        transitionFiscale={transitionFiscale}
        onChange={onChange}
      />

      <PropertyStatusFields
        situationimmobiliere={situationimmobiliere}
        onChange={onChange}
      />
    </div>
  );
}
