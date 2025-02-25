
import { Button } from "@/components/ui/button";
import { 
  ClientType, 
  Client, 
  Sexe, 
  EtatCivil, 
  RegimeFiscalPhysique,
  RegimeFiscalMorale,
  SituationImmobiliere 
} from "@/types/client";
import { useState, useEffect } from "react";
import { ClientTypeSelect } from "./ClientTypeSelect";
import { ClientIdentityFields } from "./ClientIdentityFields";
import { ClientAddressFields } from "./ClientAddressFields";
import { ClientContactFields } from "./ClientContactFields";
import { ClientProfessionalFields } from "./ClientProfessionalFields";

interface ClientFormProps {
  onSubmit: (data: any) => void;
  type: ClientType;
  onTypeChange?: (value: ClientType) => void;
  initialData?: Client;
}

export function ClientForm({ onSubmit, type, onTypeChange, initialData }: ClientFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    raisonsociale: "",
    niu: "",
    centrerattachement: "",
    ville: "",
    quartier: "",
    lieuDit: "",
    telephone: "",
    email: "",
    secteuractivite: "commerce",
    numerocnps: "",
    gestionexternalisee: false,
    sexe: "homme" as Sexe,
    etatcivil: "celibataire" as EtatCivil,
    regimefiscal: "reel" as RegimeFiscalPhysique | RegimeFiscalMorale,
    situationimmobiliere: {
      type: "locataire" as SituationImmobiliere,
      valeur: undefined as number | undefined,
      loyer: undefined as number | undefined
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || "",
        raisonsociale: initialData.raisonsociale || "",
        niu: initialData.niu,
        centrerattachement: initialData.centrerattachement,
        ville: initialData.adresse.ville,
        quartier: initialData.adresse.quartier,
        lieuDit: initialData.adresse.lieuDit,
        telephone: initialData.contact.telephone,
        email: initialData.contact.email,
        secteuractivite: initialData.secteuractivite,
        numerocnps: initialData.numerocnps || "",
        gestionexternalisee: initialData.gestionexternalisee || false,
        sexe: initialData.sexe || "homme" as Sexe,
        etatcivil: initialData.etatcivil || "celibataire" as EtatCivil,
        regimefiscal: initialData.regimefiscal || "reel" as RegimeFiscalPhysique | RegimeFiscalMorale,
        situationimmobiliere: {
          type: initialData.situationimmobiliere?.type || "locataire" as SituationImmobiliere,
          valeur: initialData.situationimmobiliere?.valeur,
          loyer: initialData.situationimmobiliere?.loyer
        }
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData = {
      type,
      nom: type === "physique" ? formData.nom : null,
      raisonsociale: type === "morale" ? formData.raisonsociale : null,
      niu: formData.niu,
      centrerattachement: formData.centrerattachement,
      adresse: {
        ville: formData.ville,
        quartier: formData.quartier,
        lieuDit: formData.lieuDit,
      },
      contact: {
        telephone: formData.telephone,
        email: formData.email,
      },
      secteuractivite: formData.secteuractivite,
      numerocnps: formData.numerocnps || null,
      gestionexternalisee: formData.gestionexternalisee,
      sexe: type === "physique" ? formData.sexe : undefined,
      etatcivil: type === "physique" ? formData.etatcivil : undefined,
      regimefiscal: type === "physique" ? formData.regimefiscal : undefined,
      situationimmobiliere: {
        type: formData.situationimmobiliere.type,
        valeur: formData.situationimmobiliere.type === "proprietaire" ? formData.situationimmobiliere.valeur : undefined,
        loyer: formData.situationimmobiliere.type === "locataire" ? formData.situationimmobiliere.loyer : undefined
      }
    };

    onSubmit(clientData);
  };

  const handleChange = (name: string, value: any) => {
    if (name === "situationimmobiliere.type") {
      setFormData(prev => ({
        ...prev,
        situationimmobiliere: {
          type: value as SituationImmobiliere,
          valeur: undefined,
          loyer: undefined
        }
      }));
    } else if (name === "situationimmobiliere.valeur" || name === "situationimmobiliere.loyer") {
      setFormData(prev => ({
        ...prev,
        situationimmobiliere: {
          ...prev.situationimmobiliere,
          [name.split('.')[1]]: value !== "" ? Number(value) : undefined
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
