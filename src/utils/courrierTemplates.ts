
import { Client } from "@/types/client";

const templates = {
  rappel_obligations: `PRISMA GESTION
Cabinet d'Expertise Comptable

Libreville, le [DATE]

Objet : Rappel d'obligations fiscales

[NOM_CLIENT]
[ADRESSE]

Madame, Monsieur,

Nous nous permettons de vous rappeler que certaines obligations fiscales arrivent à échéance prochainement.

En tant que contribuable rattaché au [CENTRE_IMPOTS], nous vous invitons à prendre les dispositions nécessaires pour respecter vos échéances fiscales.

Votre secteur d'activité ([SECTEUR_ACTIVITE]) vous soumet à des obligations spécifiques que nous sommes à votre disposition pour vous expliquer.

N'hésitez pas à nous contacter pour tout complément d'information.

Cordialement,

L'équipe PRISMA GESTION`,

  convocation_rdv: `PRISMA GESTION
Cabinet d'Expertise Comptable

Libreville, le [DATE]

Objet : Convocation à un rendez-vous

[NOM_CLIENT]
[ADRESSE]

Madame, Monsieur,

Nous avons l'honneur de vous convoquer à un rendez-vous dans nos locaux afin de faire le point sur votre dossier.

Cette rencontre nous permettra d'examiner ensemble les aspects comptables et fiscaux de votre activité dans le secteur [SECTEUR_ACTIVITE].

Merci de nous confirmer votre présence en nous contactant au plus tôt.

Dans l'attente de vous rencontrer, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

L'équipe PRISMA GESTION`,

  nouvelle_reglementation: `PRISMA GESTION
Cabinet d'Expertise Comptable

Libreville, le [DATE]

Objet : Information - Nouvelle réglementation

[NOM_CLIENT]
[ADRESSE]

Madame, Monsieur,

Nous tenons à vous informer de l'entrée en vigueur de nouvelles dispositions réglementaires qui concernent votre activité.

Ces changements impactent particulièrement les entreprises du secteur [SECTEUR_ACTIVITE] et les contribuables rattachés au [CENTRE_IMPOTS].

Nous restons à votre entière disposition pour vous accompagner dans la mise en conformité de votre entreprise avec ces nouvelles exigences.

N'hésitez pas à nous contacter pour organiser un rendez-vous afin d'étudier ensemble les implications de ces nouveautés sur votre situation.

Cordialement,

L'équipe PRISMA GESTION`,

  felicitations_creation: `PRISMA GESTION
Cabinet d'Expertise Comptable

Libreville, le [DATE]

Objet : Félicitations pour la création de votre entreprise

[NOM_CLIENT]
[ADRESSE]

Madame, Monsieur,

Nous avons l'honneur de vous adresser nos plus vives félicitations pour la création de votre entreprise dans le secteur [SECTEUR_ACTIVITE].

Votre rattachement au [CENTRE_IMPOTS] a été effectué avec succès sous le numéro [NIU].

Nous sommes fiers de vous accompagner dans cette nouvelle aventure entrepreneuriale et restons à votre disposition pour tous vos besoins en matière de gestion comptable et fiscale.

Nous vous souhaitons plein succès dans vos activités.

Très cordialement,

L'équipe PRISMA GESTION`
};

export const getTemplateContent = (templateId: string): string => {
  return templates[templateId as keyof typeof templates] || '';
};

export const replaceVariables = (template: string, client: Client): string => {
  const nom = client.type === "morale" ? client.raisonsociale : client.nom;
  const adresse = `${client.adresse.lieuDit}, ${client.adresse.quartier}, ${client.adresse.ville}`;
  
  return template
    .replace(/\[NOM_CLIENT\]/g, nom || '')
    .replace(/\[ADRESSE\]/g, adresse)
    .replace(/\[NIU\]/g, client.niu)
    .replace(/\[CENTRE_IMPOTS\]/g, client.centrerattachement)
    .replace(/\[SECTEUR_ACTIVITE\]/g, client.secteuractivite)
    .replace(/\[DATE\]/g, new Date().toLocaleDateString('fr-FR'));
};
