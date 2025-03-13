
import React from "react";
import { Button } from "@/components/ui/button";
import { ClientType, FormeJuridique, Sexe, EtatCivil, RegimeFiscalPhysique, RegimeFiscalMorale, SituationImmobiliere } from "@/types/client";
import { useForm, validators } from "@/hooks/useForm";
import { 
  TextField, 
  SelectField, 
  DateField,
  RadioGroupField,
  CheckboxField,
  SubmitButton
} from "@/components/ui/form";

interface ClientFormData {
  type: ClientType;
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
}

interface StandardClientFormProps {
  initialData: ClientFormData;
  type: ClientType;
  onTypeChange?: (type: ClientType) => void;
  onSubmit: (data: ClientFormData) => void;
  isSubmitting?: boolean;
}

export function StandardClientForm({
  initialData,
  type,
  onTypeChange,
  onSubmit,
  isSubmitting = false,
}: StandardClientFormProps) {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: initialData,
    validators: {
      // Validation conditionnelle selon le type de client
      nom: (value, formValues) => 
        formValues.type === "physique" && !value ? "Le nom est requis" : undefined,
      raisonsociale: (value, formValues) => 
        formValues.type === "morale" && !value ? "La raison sociale est requise" : undefined,
      email: validators.email("Format d'email invalide"),
      telephone: validators.phone("Format de téléphone invalide"),
    },
    onSubmit,
  });

  const handleImmobiliereTypeChange = (type: SituationImmobiliere) => {
    handleChange("situationimmobiliere", {
      ...values.situationimmobiliere,
      type,
      valeur: undefined,
      loyer: undefined
    });
  };

  const handleImmobiliereValueChange = (key: "valeur" | "loyer", value: string) => {
    handleChange("situationimmobiliere", {
      ...values.situationimmobiliere,
      [key]: value ? Number(value) : undefined
    });
  };

  const formesJuridiquesOptions = [
    { value: "sa", label: "Société Anonyme (SA)" },
    { value: "sarl", label: "Société à Responsabilité Limitée (SARL)" },
    { value: "sas", label: "Société par Actions Simplifiée (SAS)" },
    { value: "snc", label: "Société en Nom Collectif (SNC)" },
    { value: "association", label: "Association" },
    { value: "gie", label: "Groupement d'Intérêt Économique (GIE)" },
    { value: "autre", label: "Autre" },
  ];

  const sexeOptions = [
    { value: "homme", label: "Homme" },
    { value: "femme", label: "Femme" },
  ];

  const etatCivilOptions = [
    { value: "celibataire", label: "Célibataire" },
    { value: "marie", label: "Marié(e)" },
    { value: "divorce", label: "Divorcé(e)" },
    { value: "veuf", label: "Veuf/Veuve" },
  ];

  const situationImmobiliereOptions = [
    { value: "proprietaire", label: "Propriétaire" },
    { value: "locataire", label: "Locataire" },
  ];

  const regimeFiscalPhysiqueOptions = [
    { value: "reel", label: "Réel" },
    { value: "simplifie", label: "Simplifié" },
    { value: "liberatoire", label: "Libératoire" },
    { value: "non_professionnel_public", label: "Non professionnel (Secteur public)" },
    { value: "non_professionnel_prive", label: "Non professionnel (Secteur privé)" },
    { value: "non_professionnel_autre", label: "Non professionnel (Autres)" },
  ];

  const regimeFiscalMoraleOptions = [
    { value: "reel", label: "Réel" },
    { value: "simplifie", label: "Simplifié" },
    { value: "non_lucratif", label: "Organisme à but non lucratif" },
  ];

  const typeOptions = [
    { value: "physique", label: "Particulier" },
    { value: "morale", label: "Entreprise" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {onTypeChange && (
        <RadioGroupField
          id="type"
          label="Type de client"
          value={type}
          onChange={(value) => onTypeChange(value as ClientType)}
          options={typeOptions}
          layout="horizontal"
        />
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations d'identité</h3>
        
        {type === "physique" ? (
          <div className="space-y-4">
            <TextField
              id="nom"
              label="Nom et prénoms"
              value={values.nom}
              onChange={(value) => handleChange("nom", value)}
              required
              error={errors.nom}
            />
            
            <RadioGroupField
              id="sexe"
              label="Sexe"
              value={values.sexe}
              onChange={(value) => handleChange("sexe", value as Sexe)}
              options={sexeOptions}
              layout="horizontal"
            />
            
            <RadioGroupField
              id="etatcivil"
              label="État civil"
              value={values.etatcivil}
              onChange={(value) => handleChange("etatcivil", value as EtatCivil)}
              options={etatCivilOptions}
              layout="grid"
              columns={2}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <TextField
              id="raisonsociale"
              label="Raison sociale"
              value={values.raisonsociale}
              onChange={(value) => handleChange("raisonsociale", value)}
              required
              error={errors.raisonsociale}
            />
            
            <TextField
              id="sigle"
              label="Sigle"
              value={values.sigle}
              onChange={(value) => handleChange("sigle", value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField
                id="datecreation"
                label="Date de création"
                value={values.datecreation}
                onChange={(value) => handleChange("datecreation", value)}
              />
              
              <TextField
                id="lieucreation"
                label="Lieu de création"
                value={values.lieucreation}
                onChange={(value) => handleChange("lieucreation", value)}
              />
            </div>
            
            <TextField
              id="nomdirigeant"
              label="Nom du dirigeant"
              value={values.nomdirigeant}
              onChange={(value) => handleChange("nomdirigeant", value)}
            />
            
            <SelectField
              id="formejuridique"
              label="Forme juridique"
              value={values.formejuridique || ""}
              onChange={(value) => handleChange("formejuridique", value as FormeJuridique)}
              options={formesJuridiquesOptions}
            />
          </div>
        )}
        
        <RadioGroupField
          id="regimefiscal"
          label="Régime fiscal"
          value={values.regimefiscal}
          onChange={(value) => handleChange("regimefiscal", value)}
          options={type === "physique" ? regimeFiscalPhysiqueOptions : regimeFiscalMoraleOptions}
          layout={type === "physique" ? "grid" : "vertical"}
          columns={2}
        />
        
        <div className="space-y-4">
          <RadioGroupField
            id="situationimmobiliere"
            label="Situation immobilière"
            value={values.situationimmobiliere.type}
            onChange={(value) => handleImmobiliereTypeChange(value as SituationImmobiliere)}
            options={situationImmobiliereOptions}
            layout="horizontal"
          />
          
          {values.situationimmobiliere.type === "proprietaire" ? (
            <TextField
              id="valeur"
              label="Valeur de l'immobilisation"
              type="number"
              value={values.situationimmobiliere.valeur?.toString() || ""}
              onChange={(value) => handleImmobiliereValueChange("valeur", value)}
              placeholder="Valeur en FCFA"
            />
          ) : (
            <TextField
              id="loyer"
              label="Montant du loyer mensuel"
              type="number"
              value={values.situationimmobiliere.loyer?.toString() || ""}
              onChange={(value) => handleImmobiliereValueChange("loyer", value)}
              placeholder="Montant en FCFA"
            />
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            id="niu"
            label="NIU"
            value={values.niu}
            onChange={(value) => handleChange("niu", value)}
            required
          />
          
          <TextField
            id="centrerattachement"
            label="Centre de rattachement"
            value={values.centrerattachement}
            onChange={(value) => handleChange("centrerattachement", value)}
            required
          />
          
          <TextField
            id="secteuractivite"
            label="Secteur d'activité"
            value={values.secteuractivite}
            onChange={(value) => handleChange("secteuractivite", value)}
            required
          />
          
          <TextField
            id="numerocnps"
            label="Numéro CNPS"
            value={values.numerocnps}
            onChange={(value) => handleChange("numerocnps", value)}
          />
          
          <CheckboxField
            id="gestionexternalisee"
            label="Gestion externalisée"
            checked={values.gestionexternalisee}
            onChange={(value) => handleChange("gestionexternalisee", value)}
            className="col-span-2"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            id="ville"
            label="Ville"
            value={values.ville}
            onChange={(value) => handleChange("ville", value)}
            required
          />
          
          <TextField
            id="quartier"
            label="Quartier"
            value={values.quartier}
            onChange={(value) => handleChange("quartier", value)}
            required
          />
          
          <TextField
            id="lieuDit"
            label="Lieu-dit"
            value={values.lieuDit}
            onChange={(value) => handleChange("lieuDit", value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            id="telephone"
            label="Téléphone"
            type="tel"
            value={values.telephone}
            onChange={(value) => handleChange("telephone", value)}
            required
            error={errors.telephone}
          />
          
          <TextField
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={(value) => handleChange("email", value)}
            required
            error={errors.email}
          />
        </div>
      </div>
      
      <SubmitButton 
        isSubmitting={isSubmitting}
        submitText={initialData.nom || initialData.raisonsociale ? "Modifier le client" : "Ajouter le client"}
        submittingText={initialData.nom || initialData.raisonsociale ? "Modification en cours..." : "Ajout en cours..."}
        className="w-full"
      />
    </form>
  );
}
