
export interface Template {
  id: string;
  title: string;
  subject: string;
  category: "fiscal" | "relance" | "client" | "information" | "convocation";
  content: string;
}

// ─────────────────────────────────────────────
// TEMPLATES (21 modèles)
// ─────────────────────────────────────────────
export const courrierTemplates: Template[] = [

  // ── FISCAL ──────────────────────────────────

  {
    id: "rappel_obligations",
    title: "Rappel d'obligations fiscales",
    subject: "Rappel - Échéances fiscales à venir",
    category: "fiscal",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous nous permettons de vous rappeler que les échéances fiscales suivantes approchent pour votre entreprise {{nom}} (NIU : {{niu}}) :

- Déclaration mensuelle / trimestrielle des impôts et taxes
- Paiement de l'IGS (Impôt Général Synthétique)
- Dépôt des documents administratifs auprès du centre de rattachement de {{centre}}

Nous restons à votre disposition pour vous accompagner dans ces démarches.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "rappel_igs",
    title: "Rappel paiement IGS",
    subject: "Rappel - Paiement de l'IGS {{annee}}",
    category: "fiscal",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Dans le cadre de notre mission d'accompagnement fiscal, nous vous rappelons que l'Impôt Général Synthétique (IGS) pour l'exercice {{annee}} est exigible.

Sur la base de votre chiffre d'affaires déclaré, votre IGS est estimé à {{montant_igs}} F CFA.

Nous vous invitons à procéder au règlement auprès de {{centre}} avant la date limite afin d'éviter toute pénalité de retard.

N'hésitez pas à nous contacter pour toute question relative au calcul ou aux modalités de paiement.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "rappel_patente",
    title: "Rappel paiement Patente",
    subject: "Rappel - Paiement de la Patente {{annee}}",
    category: "fiscal",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous vous informons que la Patente pour l'exercice {{annee}} est due. Cet impôt professionnel est calculé sur la base de votre chiffre d'affaires annuel.

Régime fiscal : {{regime}}
Centre de rattachement : {{centre}}
NIU : {{niu}}

Votre montant de Patente estimé : {{montant_patente}} F CFA

Merci de procéder au règlement dans les délais légaux. Notre cabinet se tient disponible pour vous assister.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "rappel_declaration_annuelle",
    title: "Rappel déclaration annuelle",
    subject: "Rappel - Déclaration annuelle des résultats {{annee}}",
    category: "fiscal",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous vous rappelons que la déclaration annuelle des résultats de l'exercice {{annee}} doit être déposée auprès de votre centre des impôts ({{centre}}) avant la date limite réglementaire.

Documents à préparer :
- Bilan et compte de résultat
- État récapitulatif des immobilisations
- Relevé des amortissements
- Liste des clients et fournisseurs principaux

Notre équipe est disponible pour vous aider à préparer et déposer ces documents dans les meilleurs délais.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "transmission_documents_fiscaux",
    title: "Transmission documents fiscaux",
    subject: "Transmission de vos documents fiscaux - {{annee}}",
    category: "fiscal",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Veuillez trouver ci-joint l'ensemble de vos documents fiscaux préparés par notre cabinet pour l'exercice {{annee}} :

- Déclaration de l'IGS
- Avis de mise en recouvrement
- Récapitulatif des taxes dues

Ces documents ont été établis conformément à la réglementation fiscale en vigueur au Cameroun et tenant compte de votre régime fiscal ({{regime}}).

Nous vous prions de bien vouloir les vérifier et de nous faire part de toute observation avant envoi définitif à {{centre}}.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "mise_a_jour_regime_fiscal",
    title: "Mise à jour régime fiscal",
    subject: "Information - Changement de régime fiscal",
    category: "fiscal",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Suite à l'évolution de votre activité et de votre chiffre d'affaires, nous vous informons qu'un changement de régime fiscal pourrait vous être applicable.

Votre régime actuel : {{regime}}
Secteur d'activité : {{secteur}}

Ce changement implique de nouvelles obligations déclaratives et un recalcul de vos impôts et taxes. Nous vous recommandons de prendre rendez-vous avec notre équipe afin d'étudier ensemble les implications de cette transition.

Cordialement,
L'équipe de gestion`
  },

  // ── RELANCE ─────────────────────────────────

  {
    id: "relance_facture_impayee",
    title: "Relance facture impayée",
    subject: "Relance - Facture en attente de règlement",
    category: "relance",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Sauf erreur ou omission de notre part, nous constatons qu'une ou plusieurs factures concernant les prestations réalisées pour votre compte restent à ce jour impayées.

Nous vous remercions de bien vouloir procéder au règlement dans les meilleurs délais ou de nous contacter si vous rencontrez des difficultés particulières.

Pour tout renseignement, notre équipe reste disponible.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "relance_documents_manquants",
    title: "Relance documents manquants",
    subject: "Demande - Documents comptables manquants",
    category: "relance",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Dans le cadre du traitement de votre dossier comptable et fiscal pour l'exercice en cours, nous n'avons pas encore reçu les documents suivants :

- Relevés bancaires
- Factures d'achat et de vente
- Justificatifs de charges

Nous vous saurions gré de bien vouloir nous transmettre ces éléments dans les meilleurs délais afin de ne pas compromettre le respect des échéances fiscales.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "relance_rendez_vous",
    title: "Relance prise de rendez-vous",
    subject: "Relance - Rendez-vous annuel de suivi",
    category: "relance",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous n'avons pas encore eu l'occasion de vous rencontrer pour votre bilan annuel. Ce rendez-vous est essentiel pour faire le point sur votre situation fiscale et comptable.

Nous vous invitons à nous contacter afin de convenir d'un créneau qui vous conviendrait.

Dans l'attente de votre retour,

Cordialement,
L'équipe de gestion`
  },

  {
    id: "relance_mise_en_demeure",
    title: "Mise en demeure (dernier rappel)",
    subject: "URGENT - Dernier rappel avant action",
    category: "relance",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Malgré nos précédentes relances, nous constatons que notre intervention reste sans suite.

Nous vous mettons en demeure de régulariser votre situation dans un délai de 15 jours à compter de la réception de la présente lettre.

À défaut de règlement dans ce délai, nous nous verrons contraints de prendre les mesures appropriées pour la protection de nos droits.

Nous espérons qu'il ne sera pas nécessaire d'en venir à cette extrémité et restons disponibles pour trouver une solution amiable.

Cordialement,
L'équipe de gestion`
  },

  // ── CLIENT ──────────────────────────────────

  {
    id: "felicitations_creation",
    title: "Félicitations création d'entreprise",
    subject: "Félicitations pour la création de votre entreprise",
    category: "client",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous avons le plaisir de vous féliciter pour la création de votre entreprise dans le secteur de {{secteur}}.

Notre cabinet comptable se tient à votre disposition pour vous accompagner dans toutes vos démarches administratives et fiscales au Cameroun :

- Immatriculation fiscale et obtention du NIU
- Mise en place de votre comptabilité
- Déclarations fiscales périodiques
- Conseil et optimisation fiscale

Nous vous souhaitons plein succès dans cette nouvelle aventure entrepreneuriale et nous réjouissons de construire ensemble une relation de confiance durable.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "bienvenue_nouveau_client",
    title: "Bienvenue nouveau client",
    subject: "Bienvenue - Confirmation de prise en charge de votre dossier",
    category: "client",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous avons le plaisir de vous confirmer la prise en charge de votre dossier par notre cabinet.

Vos informations enregistrées :
- NIU : {{niu}}
- Régime fiscal : {{regime}}
- Centre de rattachement : {{centre}}
- Secteur d'activité : {{secteur}}

Un(e) gestionnaire de compte vous sera assigné(e) prochainement et vous contactera pour prendre en main votre dossier.

Nous vous remercions de votre confiance.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "confirmation_mission",
    title: "Confirmation de mission",
    subject: "Confirmation - Lettre de mission comptable et fiscale",
    category: "client",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Suite à notre entretien, nous avons le plaisir de vous confirmer notre intervention dans le cadre de la mission suivante :

- Tenue de comptabilité
- Établissement des déclarations fiscales
- Conseil fiscal et patrimonial
- Représentation auprès des administrations

Cette mission est réalisée conformément aux normes professionnelles en vigueur et dans le respect de la réglementation fiscale camerounaise applicable à votre régime ({{regime}}).

Nous vous prions de bien vouloir nous retourner le double de cette lettre signé pour accord.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "fin_mission",
    title: "Fin de mission",
    subject: "Fin de mission - Clôture de votre dossier",
    category: "client",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous vous informons de la fin de notre mission à votre égard, conformément à notre accord.

Nous vous remercions de la confiance que vous nous avez accordée et vous souhaitons bonne continuation dans vos activités.

Vos documents comptables et fiscaux vous seront restitués dans les prochains jours. Nous vous invitons à en accuser réception.

Cordialement,
L'équipe de gestion`
  },

  // ── INFORMATION ─────────────────────────────

  {
    id: "nouvelle_reglementation",
    title: "Nouvelle réglementation fiscale",
    subject: "Information - Nouvelles réglementations fiscales en vigueur",
    category: "information",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous tenons à vous informer des nouvelles réglementations fiscales qui entreront en vigueur prochainement et qui pourraient impacter votre activité dans le secteur de {{secteur}}.

Ces changements concernent :
- Les nouveaux taux de l'IGS et de la Patente
- Les modifications des obligations déclaratives
- Les nouvelles modalités de paiement des impôts

Compte tenu de votre régime fiscal ({{regime}}) et de votre centre de rattachement ({{centre}}), notre équipe a analysé les impacts spécifiques pour votre entreprise.

Nous vous proposons un rendez-vous pour étudier ensemble les mesures à prendre.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "info_loi_finances",
    title: "Loi de finances",
    subject: "Information - Loi de finances {{annee}}",
    category: "information",
    content: `Madame, Monsieur {{civilite}} {{nom}},

La loi de finances {{annee}} introduit plusieurs dispositions susceptibles d'affecter votre situation fiscale.

Principales mesures à retenir pour les entreprises relevant du régime {{regime}} :

1. Modification des barèmes de l'IGS
2. Nouvelles obligations en matière de facturation électronique
3. Renforcement des contrôles fiscaux
4. Ajustements des taux de la Taxe sur la Valeur Ajoutée

Notre cabinet reste à votre disposition pour vous informer des mesures à prendre et vous accompagner dans leur mise en œuvre.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "info_controle_fiscal",
    title: "Information contrôle fiscal",
    subject: "Information - Préparation à un contrôle fiscal",
    category: "information",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Dans le cadre de nos missions de conseil, nous souhaitons attirer votre attention sur l'importance de la préparation aux contrôles fiscaux.

Nous vous recommandons de vous assurer que les documents suivants sont en ordre et accessibles :

- Livres comptables des 3 derniers exercices
- Déclarations fiscales et justificatifs de paiement
- Contrats et conventions conclus avec vos partenaires
- Factures d'achat et de vente

Notre équipe peut procéder à un audit préventif de votre dossier fiscal. N'hésitez pas à nous solliciter.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "info_cga",
    title: "Adhésion CGA",
    subject: "Information - Avantages de l'adhésion au CGA",
    category: "information",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Dans le cadre de notre accompagnement, nous souhaitons vous informer des avantages de l'adhésion à un Centre de Gestion Agréé (CGA).

En tant qu'adhérent CGA, vous bénéficiez notamment :
- D'une réduction de 50% sur votre IGS
- D'un suivi personnalisé de votre comptabilité
- D'une assistance lors des contrôles fiscaux
- D'une formation continue sur les obligations fiscales

Compte tenu de votre chiffre d'affaires et de votre régime ({{regime}}), cette adhésion pourrait représenter une économie substantielle.

Nous vous invitons à nous contacter pour étudier l'opportunité de cette démarche.

Cordialement,
L'équipe de gestion`
  },

  // ── CONVOCATION ─────────────────────────────

  {
    id: "convocation_rdv",
    title: "Convocation rendez-vous",
    subject: "Convocation - Rendez-vous professionnel",
    category: "convocation",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous vous convions à un rendez-vous en nos locaux afin de faire le point sur votre dossier fiscal et comptable pour l'exercice en cours.

Ce rendez-vous nous permettra de :
- Analyser l'évolution de votre situation fiscale
- Planifier les prochaines échéances déclaratives
- Répondre à toutes vos questions

Merci de nous confirmer vos disponibilités dans les meilleurs délais.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "convocation_assemblee",
    title: "Convocation assemblée générale",
    subject: "Convocation - Assemblée Générale {{annee}}",
    category: "convocation",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Nous avons l'honneur de vous convoquer à l'Assemblée Générale Ordinaire de votre société qui se tiendra prochainement.

Ordre du jour :
1. Approbation des comptes de l'exercice {{annee}}
2. Affectation du résultat
3. Renouvellement des mandats
4. Questions diverses

Les documents préparatoires à cette assemblée, établis par notre cabinet, vous seront transmis sous pli séparé.

Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

Cordialement,
L'équipe de gestion`
  },

  {
    id: "convocation_formation",
    title: "Convocation formation fiscale",
    subject: "Invitation - Formation sur les obligations fiscales {{annee}}",
    category: "convocation",
    content: `Madame, Monsieur {{civilite}} {{nom}},

Notre cabinet organise une session de formation sur les obligations fiscales des entreprises au Cameroun pour l'exercice {{annee}}.

Programme :
- La fiscalité des entreprises relevant du régime {{regime}}
- Obligations déclaratives et sanctions en cas de manquement
- Nouveautés de la loi de finances {{annee}}
- Séance de questions/réponses

Cette formation est offerte à l'ensemble de nos clients. Nous vous invitons à confirmer votre participation.

Cordialement,
L'équipe de gestion`
  }
];

// ─────────────────────────────────────────────
// UTILITAIRES
// ─────────────────────────────────────────────

export const getTemplatesByCategory = (category: Template["category"]): Template[] =>
  courrierTemplates.filter(t => t.category === category);

export const getTemplateContent = (templateId: string): string => {
  const template = courrierTemplates.find(t => t.id === templateId);
  return template ? template.content : "";
};

/**
 * Remplace tous les placeholders {{key}} d'un template par les données du client.
 * Supports: {{nom}}, {{civilite}}, {{niu}}, {{centre}}, {{secteur}}, {{regime}},
 *           {{annee}}, {{montant_igs}}, {{montant_patente}}
 */
export const replaceVariables = (content: string, client: any): string => {
  const clientName = client.type === "morale"
    ? (client.raisonsociale || client.nom || "")
    : (client.nom || "");

  const currentYear = new Date().getFullYear().toString();

  // Calculate estimated taxes if chiffreaffaires is available
  const ca = parseFloat(client.chiffreaffaires || "0") || 0;
  const montantPatente = ca > 0 ? Math.min(Math.max(Math.round(ca * 0.00283), 141500), 4500000) : 0;

  // Basic IGS estimation (class 1 = 50 000)
  const igsBarem = [50000, 75000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000, 1500000];
  const caLimits = [0, 10000000, 15000000, 20000000, 30000000, 50000000, 100000000, 200000000, 300000000, 500000000];
  let igsIndex = caLimits.findIndex(limit => ca < limit);
  if (igsIndex === -1) igsIndex = 10;
  const igsBase = igsBarem[Math.max(0, igsIndex - 1)] ?? igsBarem[0];
  const montantIgs = client.iscga ? Math.round(igsBase * 0.5) : igsBase;

  return content
    .replace(/{{nom}}/g, clientName)
    .replace(/{{civilite}}/g, client.civilite || "")
    .replace(/{{niu}}/g, client.niu || "")
    .replace(/{{centre}}/g, client.centrerattachement || "")
    .replace(/{{secteur}}/g, client.secteuractivite || "")
    .replace(/{{regime}}/g, client.regimefiscal || "")
    .replace(/{{annee}}/g, currentYear)
    .replace(/{{montant_igs}}/g, new Intl.NumberFormat("fr-FR").format(montantIgs))
    .replace(/{{montant_patente}}/g, new Intl.NumberFormat("fr-FR").format(montantPatente));
};

export const generateCourrierContent = (
  client: any,
  template: Template,
  customMessage?: string
): string => {
  let content = replaceVariables(template.content, client);
  if (customMessage) {
    content += "\n\n" + customMessage;
  }
  return content;
};
