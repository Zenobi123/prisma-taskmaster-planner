
import React from "react";
import { Button } from "@/components/ui/button";
import { CollaborateurRole, CollaborateurPermissions } from "@/types/collaborateur";
import { useForm, validators } from "@/hooks/useForm";
import { 
  TextField, 
  SelectField, 
  DateField,
  RadioGroupField,
  SubmitButton
} from "@/components/ui/form";

interface CollaborateurFormData {
  nom: string;
  prenom: string;
  email: string;
  poste: CollaborateurRole;
  telephone: string;
  niveauetude: string;
  dateentree: string;
  datenaissance: string;
  statut: string;
  ville: string;
  quartier: string;
  permissions: CollaborateurPermissions[];
}

interface StandardCollaborateurFormProps {
  initialData: CollaborateurFormData;
  onSubmit: (data: CollaborateurFormData) => void;
  isSubmitting?: boolean;
}

export function StandardCollaborateurForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: StandardCollaborateurFormProps) {
  const formValidators = {
    nom: validators.required("Le nom est requis"),
    prenom: validators.required("Le prénom est requis"),
    email: validators.email("Format d'email invalide"),
    telephone: validators.phone("Format de téléphone invalide"),
  };

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: initialData,
    validators: formValidators,
    onSubmit,
  });

  const roleOptions = [
    { value: "expert-comptable", label: "Expert Comptable" },
    { value: "assistant", label: "Assistant" },
    { value: "fiscaliste", label: "Fiscaliste" },
    { value: "gestionnaire", label: "Gestionnaire" },
    { value: "comptable", label: "Comptable" },
  ];

  const niveauxEtudeOptions = [
    { value: "BAC", label: "BAC" },
    { value: "BAC+2", label: "BAC+2" },
    { value: "BAC+3", label: "BAC+3" },
    { value: "BAC+4", label: "BAC+4" },
    { value: "BAC+5", label: "BAC+5" },
    { value: "BAC+6 et plus", label: "BAC+6 et plus" },
  ];

  const statutOptions = [
    { value: "actif", label: "Actif" },
    { value: "inactif", label: "Inactif" },
    { value: "congé", label: "En congé" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            id="nom"
            label="Nom"
            value={values.nom}
            onChange={(value) => handleChange("nom", value)}
            required
            error={errors.nom}
          />
          
          <TextField
            id="prenom"
            label="Prénom"
            value={values.prenom}
            onChange={(value) => handleChange("prenom", value)}
            required
            error={errors.prenom}
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
          
          <TextField
            id="telephone"
            label="Téléphone"
            type="tel"
            value={values.telephone}
            onChange={(value) => handleChange("telephone", value)}
            required
            error={errors.telephone}
          />
          
          <DateField
            id="datenaissance"
            label="Date de naissance"
            value={values.datenaissance}
            onChange={(value) => handleChange("datenaissance", value)}
            required
          />
          
          <RadioGroupField
            id="statut"
            label="Statut"
            value={values.statut}
            onChange={(value) => handleChange("statut", value)}
            options={statutOptions}
            layout="horizontal"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            id="poste"
            label="Rôle"
            value={values.poste}
            onChange={(value) => handleChange("poste", value as CollaborateurRole)}
            options={roleOptions}
            required
          />
          
          <SelectField
            id="niveauetude"
            label="Niveau d'étude"
            value={values.niveauetude}
            onChange={(value) => handleChange("niveauetude", value)}
            options={niveauxEtudeOptions}
            required
          />
          
          <DateField
            id="dateentree"
            label="Date d'entrée"
            value={values.dateentree}
            onChange={(value) => handleChange("dateentree", value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      <SubmitButton 
        isSubmitting={isSubmitting}
        submitText="Ajouter le collaborateur"
        submittingText="Ajout en cours..."
        className="w-full"
      />
    </form>
  );
}
