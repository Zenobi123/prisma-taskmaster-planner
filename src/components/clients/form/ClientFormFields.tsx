
import { ClientType } from "@/types/client";
import { ClientFormState } from "@/hooks/client-form/useClientFormState";
import { ClientIdentityFields } from "../ClientIdentityFields";
import { ClientAddressFields } from "../ClientAddressFields";
import { ClientContactFields } from "../ClientContactFields";
import { ClientProfessionalFields } from "../ClientProfessionalFields";
import { AgencesEditor } from "../identity/AgencesEditor";

interface ClientFormFieldsProps {
  type: ClientType;
  formData: ClientFormState;
  onChange: (name: string, value) => void;
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
        ville={formData.ville}
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
        contact_principal={formData.contact_principal}
        situationimmobiliere={formData.situationimmobiliere}
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

      <AgencesEditor
        agences={formData.agences}
        ville={formData.ville}
        quartier={formData.quartier}
        regimefiscal={formData.regimefiscal}
        fallbackCA={formData.chiffreaffaires}
        fallbackLoyerMensuel={formData.situationimmobiliere?.loyer}
        fallbackValeurBien={formData.situationimmobiliere?.valeur}
        fallbackStatutImmo={
          formData.situationimmobiliere?.type === "proprietaire" ? "proprietaire"
          : formData.situationimmobiliere?.type === "les_deux" ? "les_deux"
          : "locataire"
        }
        onChange={onChange}
      />
    </div>
  );
}
