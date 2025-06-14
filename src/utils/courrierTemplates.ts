
export interface Template {
  id: string;
  title: string;
  subject: string;
  content: string;
}

export const courrierTemplates: Template[] = [
  {
    id: "rappel_obligations",
    title: "Rappel d'obligations fiscales",
    subject: "Rappel - Échéances fiscales à venir",
    content: `Madame, Monsieur {{nom}},

Nous nous permettons de vous rappeler que les échéances fiscales suivantes approchent pour votre entreprise {{nom}} :

- Déclaration mensuelle/trimestrielle
- Paiement des impôts et taxes
- Dépôt des documents administratifs

Nous restons à votre disposition pour vous accompagner dans ces démarches.

Cordialement,
L'équipe de gestion`
  },
  {
    id: "convocation_rdv",
    title: "Convocation rendez-vous",
    subject: "Convocation - Rendez-vous professionnel",
    content: `Madame, Monsieur {{nom}},

Nous souhaitons organiser un rendez-vous avec vous afin de faire le point sur votre dossier et examiner les prochaines étapes.

Merci de nous confirmer vos disponibilités pour la semaine à venir.

Dans l'attente de votre retour,

Cordialement,
L'équipe de gestion`
  },
  {
    id: "nouvelle_reglementation",
    title: "Nouvelle réglementation",
    subject: "Information - Nouvelles réglementations en vigueur",
    content: `Madame, Monsieur {{nom}},

Nous tenons à vous informer des nouvelles réglementations qui entreront en vigueur prochainement et qui pourraient impacter votre activité.

Ces changements concernent :
- Les obligations fiscales
- Les déclarations sociales
- Les nouveaux taux d'imposition

Nous vous proposons un rendez-vous pour étudier ensemble l'impact de ces mesures sur votre entreprise.

Cordialement,
L'équipe de gestion`
  },
  {
    id: "felicitations_creation",
    title: "Félicitations création",
    subject: "Félicitations pour la création de votre entreprise",
    content: `Madame, Monsieur {{nom}},

Nous avons le plaisir de vous féliciter pour la création de votre entreprise {{nom}}.

Notre équipe se tient à votre disposition pour vous accompagner dans toutes vos démarches administratives et fiscales.

Nous vous souhaitons plein succès dans cette nouvelle aventure entrepreneuriale.

Cordialement,
L'équipe de gestion`
  }
];

export const getTemplateContent = (templateId: string): string => {
  const template = courrierTemplates.find(t => t.id === templateId);
  return template ? template.content : "";
};

export const replaceVariables = (content: string, client: any): string => {
  const clientName = client.type === "morale" ? client.raisonsociale : client.nom;
  return content
    .replace(/{{nom}}/g, clientName || "")
    .replace(/{{niu}}/g, client.niu || "")
    .replace(/{{centre}}/g, client.centrerattachement || "")
    .replace(/{{secteur}}/g, client.secteuractivite || "");
};

export const generateCourrierContent = (client: any, template: Template, customMessage?: string): string => {
  let content = replaceVariables(template.content, client);
  
  if (customMessage) {
    content += "\n\n" + customMessage;
  }
  
  return content;
};
