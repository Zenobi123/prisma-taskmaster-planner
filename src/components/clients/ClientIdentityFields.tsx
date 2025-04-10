
import { ClientType, FormeJuridique, Sexe, EtatCivil, RegimeFiscalPhysique, RegimeFiscalMorale, SituationImmobiliere, IGSData, CGAClasse } from "@/types/client";
import { PersonalInfoFields } from "./identity/PersonalInfoFields";
import { CompanyInfoFields } from "./identity/CompanyInfoFields";
import { TaxRegimeFields } from "./identity/TaxRegimeFields";
import { PropertyStatusFields } from "./identity/PropertyStatusFields";
import { IGSFields } from "./identity/IGSFields";

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
  situationimmobiliere?: {
    type: SituationImmobiliere;
    valeur?: number;
    loyer?: number;
  };
  igs?: IGSData;
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
  situationimmobiliere = { type: "locataire" },
  igs = { soumisIGS: false, adherentCGA: false },
  onChange 
}: ClientIdentityFieldsProps) {
  console.log("IGS data in ClientIdentityFields:", igs);
  
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

      <IGSFields
        soumisIGS={igs?.soumisIGS || false}
        adherentCGA={igs?.adherentCGA || false}
        classeIGS={igs?.classeIGS}
        patente={igs?.patente}
        acompteJanvier={igs?.acompteJanvier}
        acompteFevrier={igs?.acompteFevrier}
        onChange={onChange}
        hidePayments={true} // Masquer les paiements dans la section Clients
      />

      <PropertyStatusFields
        situationimmobiliere={situationimmobiliere}
        onChange={onChange}
      />
    </div>
  );
}
