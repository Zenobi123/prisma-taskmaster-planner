// SPEC_LOVABLE.md §9 — Modèles de courriers (20 modèles)
// Placeholders supportés : {CLIENT_NOM}, {CLIENT_NIU}, {CLIENT_VILLE},
// {CLIENT_QUARTIER}, {CLIENT_CONTACT}, {CIVILITE} (=Madame|Monsieur)

import type { ClientSpec } from './fiscal';
import { getCiviliteLongue, formatMoney, calculateIGS, calculatePatente } from './fiscal';

export type CourrierType = 'fiscal' | 'client' | 'relance' | 'administratif' | 'autre';
export type CourrierStatut = 'brouillon' | 'envoye' | 'accuse' | 'classe';
export type CourrierModeEnvoi = '' | 'depot' | 'recommande' | 'email' | 'coursier';

export interface CourrierModelePayload {
  type: CourrierType;
  objet: string;
  corps: string;
  pj: string;
  destinataire: string;
  destinataireAdresse: string;
}

export interface CourrierModele extends CourrierModelePayload {
  key: string;
  label: string;
  dynamic?: boolean;
}

const DGI_DESTINATAIRE = 'Monsieur le Chef de Centre Régional des Impôts';

// ============== FISCAL (DGI) ==============

const MODELES_FISCAL: CourrierModele[] = [
  {
    key: 'demande_acf',
    label: "Demande d'Attestation de Conformité Fiscale (ACF)",
    type: 'fiscal',
    objet: "Demande d'Attestation de Conformité Fiscale (ACF)",
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

J'ai l'honneur de venir très respectueusement solliciter de votre haute bienveillance la délivrance d'une Attestation de Conformité Fiscale (ACF) au profit de {CLIENT_NOM}, NIU : {CLIENT_NIU}.

Cette attestation est sollicitée pour l'usage administratif requis dans le cadre de nos activités.

Dans l'attente de votre réponse favorable, je vous prie d'agréer, Monsieur le Chef de Centre, l'expression de mes salutations distinguées.`,
    pj: `Copie de la carte de contribuable
Quittances de paiement de l'IGS / Patente
Dernière DSF déposée`,
  },
  {
    key: 'demande_attim',
    label: "Demande d'Attestation de non redevance (ATTIM)",
    type: 'fiscal',
    objet: "Demande d'Attestation de non redevance (ATTIM)",
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

J'ai l'honneur de solliciter de votre haute bienveillance la délivrance d'une Attestation d'Immatriculation (ATTIM) au profit de {CLIENT_NOM}, NIU : {CLIENT_NIU}.

Cette attestation nous est nécessaire pour la finalisation de nos démarches administratives.

Veuillez agréer, Monsieur le Chef de Centre, l'expression de mes salutations distinguées.`,
    pj: `Copie de la carte de contribuable
Justificatif de paiement des droits requis`,
  },
  {
    key: 'reclamation_fiscale',
    label: 'Réclamation fiscale',
    type: 'fiscal',
    objet: 'Réclamation fiscale',
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

Par la présente, je formule, au nom de {CLIENT_NOM} (NIU : {CLIENT_NIU}), une réclamation contre l'imposition mise à la charge de mon mandant, telle qu'elle ressort de l'avis ou du document fiscal en notre possession.

Les motifs détaillés de cette réclamation sont exposés dans la note jointe.

Je sollicite, en conséquence, le réexamen de cette imposition.

Je vous prie d'agréer, Monsieur le Chef de Centre, l'expression de mes salutations respectueuses.`,
    pj: `Note explicative
Copie de l'avis d'imposition contesté
Pièces justificatives`,
  },
  {
    key: 'demande_degrevement',
    label: 'Demande de dégrèvement fiscal',
    type: 'fiscal',
    objet: 'Demande de dégrèvement fiscal',
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

J'ai l'honneur de solliciter, au nom de {CLIENT_NOM} (NIU : {CLIENT_NIU}), un dégrèvement total ou partiel des impositions mises à la charge de mon mandant.

Cette requête est motivée par les éléments objectifs développés dans la note jointe.

Dans l'attente d'une suite favorable, je vous prie d'agréer, Monsieur le Chef de Centre, l'expression de mes salutations distinguées.`,
    pj: `Note explicative
Avis d'imposition concerné
Justificatifs financiers`,
  },
  {
    key: 'demande_moratoire',
    label: 'Demande de moratoire de paiement',
    type: 'fiscal',
    objet: 'Demande de moratoire de paiement',
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

En raison des difficultés financières momentanées que rencontre {CLIENT_NOM} (NIU : {CLIENT_NIU}), j'ai l'honneur de solliciter de votre bienveillance l'octroi d'un moratoire pour le paiement échelonné des impositions exigibles.

Un échéancier prévisionnel est joint à la présente.

Je vous prie d'agréer, Monsieur le Chef de Centre, l'expression de mes salutations respectueuses.`,
    pj: `Échéancier proposé
Justificatifs financiers
Avis d'imposition`,
  },
  {
    key: 'demande_sursis',
    label: 'Demande de sursis de paiement',
    type: 'fiscal',
    objet: 'Demande de sursis de paiement',
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

J'ai l'honneur de solliciter le sursis de paiement des impositions contestées de {CLIENT_NOM} (NIU : {CLIENT_NIU}), conformément aux dispositions du Livre des Procédures Fiscales.

Ce sursis est sollicité dans l'attente du règlement définitif de la réclamation introduite parallèlement à la présente.

Veuillez agréer, Monsieur le Chef de Centre, l'expression de mes salutations distinguées.`,
    pj: `Copie de la réclamation introduite
Avis d'imposition contesté`,
  },
];

// ============== CLIENT ==============

const MODELES_CLIENT: CourrierModele[] = [
  {
    key: 'lettre_mission',
    label: 'Lettre de mission - Prestations comptables et fiscales',
    type: 'client',
    objet: 'Lettre de mission - Prestations comptables et fiscales',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Par la présente, nous vous confirmons les termes de la mission que vous nous avez confiée et qui consiste, à titre principal, à assurer la tenue de votre comptabilité, l'établissement de vos déclarations fiscales et sociales ainsi qu'un accompagnement permanent en matière de gestion fiscale.

Notre mission s'exécutera dans le respect des règles déontologiques et des normes professionnelles en vigueur.

Nous restons à votre entière disposition pour tout échange complémentaire.

Veuillez agréer, {CIVILITE}, l'expression de notre considération distinguée.`,
    pj: 'Convention de mission signée',
  },
  {
    key: 'relance_paiement',
    label: 'Relance - Factures impayées',
    type: 'relance',
    objet: 'Relance - Factures impayées',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Sauf erreur ou omission de notre part, nous constatons que certaines de nos factures émises à votre attention demeurent impayées à ce jour.

Nous vous saurions gré de bien vouloir procéder à leur règlement dans les meilleurs délais, ou nous faire connaître, le cas échéant, les difficultés rencontrées.

Notre cabinet reste à votre écoute pour convenir, si nécessaire, d'un échéancier adapté.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: 'Relevé des factures impayées',
  },
  {
    key: 'mise_en_demeure',
    label: 'Mise en demeure de paiement',
    type: 'relance',
    objet: 'Mise en demeure de paiement',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Malgré nos précédentes relances, nous constatons que les sommes dues à notre cabinet n'ont toujours pas été réglées.

Par la présente, nous vous mettons en demeure d'effectuer le règlement intégral des montants restant dus, dans un délai de huit (8) jours à compter de la réception de la présente.

À défaut, nous nous verrions contraints d'engager toutes les voies de droit appropriées pour obtenir le recouvrement de notre créance.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: 'Décompte détaillé des sommes dues',
  },
  {
    key: 'transmission_documents',
    label: 'Transmission de documents',
    type: 'client',
    objet: 'Transmission de documents',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Nous avons l'honneur de vous transmettre, ci-joint, les documents relatifs à votre dossier.

Nous vous invitons à les conserver précieusement et restons à votre disposition pour toute information complémentaire.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: 'Voir documents joints',
  },
  {
    key: 'information_client',
    label: 'Information / Notification client',
    type: 'client',
    objet: 'Information / Notification client',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Nous vous informons par la présente d'éléments susceptibles d'avoir une incidence sur la gestion de votre dossier.

Nous vous invitons à prendre connaissance des informations détaillées dans le contenu joint et restons disponibles pour toute clarification.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: '',
  },
  {
    key: 'lettre_accompagnement_proposition_avance',
    label: "Transmission de votre proposition d'avance client",
    type: 'client',
    dynamic: true,
    objet: "Transmission de votre proposition d'avance client",
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Nous avons l'honneur de vous transmettre, ci-joint, la proposition d'avance client établie à votre attention dans le cadre du suivi de vos obligations fiscales et sociales.

Cette proposition reprend, par poste, les montants annuels et la fraction à verser pour la période concernée.

Nous restons à votre disposition pour tout ajustement de planification.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: 'Proposition de paiement détaillée',
  },
  {
    key: 'votre_demande_devis',
    label: 'Modalités de délivrance des devis pour renouvellement de dossier fiscal',
    type: 'client',
    dynamic: true,
    objet: 'Modalités de délivrance des devis pour renouvellement de dossier fiscal',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Nous accusons réception de votre demande relative à l'élaboration d'un devis pour le renouvellement de votre dossier fiscal.

Conformément à nos modalités, ce service est facturé à la somme de {FRAIS_RENOUVELLEMENT}, payable préalablement à la production du devis personnalisé.

Dès réception de votre règlement, nous procéderons à l'établissement et à la transmission du devis dans les meilleurs délais.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: '',
  },
  {
    key: 'lettre_transmission_devis_professionnel',
    label: 'Transmission de votre devis',
    type: 'client',
    dynamic: true,
    objet: 'Transmission de votre devis',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Nous avons l'honneur de vous transmettre, ci-joint, le devis détaillé relatif aux prestations comptables, fiscales et administratives à exécuter pour votre compte.

Ce devis est valable trente (30) jours à compter de sa date d'émission.

Pour toute information complémentaire ou demande d'ajustement, notre équipe se tient à votre entière disposition.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: 'Devis détaillé',
  },
  {
    key: 'transmission_devis',
    label: 'Transmission de votre devis fiscal annuel',
    type: 'client',
    dynamic: true,
    objet: 'Transmission de votre devis fiscal annuel',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Vous trouverez, ci-joint, le devis fiscal annuel reprenant les impôts, taxes et honoraires prévisionnels pour l'exercice en cours.

Ce devis tient compte de votre régime fiscal, de votre situation immobilière ainsi que des prestations comptables récurrentes.

Nous demeurons à votre disposition pour vous accompagner dans la planification de vos paiements.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: 'Devis fiscal annuel',
  },
  {
    key: 'rappel_delais',
    label: 'Rappel des différents délais fiscaux',
    type: 'client',
    dynamic: true,
    objet: 'Rappel des différents délais fiscaux',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Dans le cadre du suivi de vos obligations, nous vous rappelons les principales échéances fiscales :

- IGS annuel : 1er Mars (péribilité au 1er Avril)
- Patente : 28 Février
- Bail Commercial / TF : annuel
- DSF : 15 Mars
- DARP : 30 Juin
- DBEF : 30 Juin

En cas de paiement trimestriel des IGS et PSL, les échéances sont fixées au 15 Janvier, 15 Mars, 15 Juillet et 15 Octobre.

Nous restons à votre disposition pour toute action requise dans les délais impartis.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: '',
  },
  {
    key: 'annonce_nouvelles_taxes',
    label: 'Annonce de nouvelles taxes et changements fiscaux',
    type: 'client',
    dynamic: true,
    objet: 'Annonce de nouvelles taxes et changements fiscaux',
    destinataire: '{CLIENT_NOM}',
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `{CIVILITE} {CLIENT_NOM},

Nous portons à votre connaissance les évolutions législatives et réglementaires récentes qui pourraient affecter votre situation fiscale et la gestion de votre entité.

Une note explicative détaillée vous sera transmise prochainement, accompagnée de nos préconisations.

Notre équipe demeure à votre disposition pour vous accompagner dans la mise en conformité.

Veuillez agréer, {CIVILITE}, l'expression de nos salutations distinguées.`,
    pj: '',
  },
];

// ============== ADMINISTRATIF ==============

const MODELES_ADMIN: CourrierModele[] = [
  {
    key: 'demande_niu',
    label: "Demande d'immatriculation fiscale (NIU)",
    type: 'administratif',
    objet: "Demande d'immatriculation fiscale (NIU)",
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

J'ai l'honneur de solliciter, au nom de {CLIENT_NOM}, l'immatriculation fiscale et l'attribution d'un Numéro d'Identifiant Unique (NIU).

Toutes les pièces requises pour l'instruction de cette demande sont jointes à la présente.

Je vous prie d'agréer, Monsieur le Chef de Centre, l'expression de mes salutations distinguées.`,
    pj: `Photocopie certifiée de la pièce d'identité du dirigeant
Plan de localisation
Statuts ou registre de commerce (si Personne morale)`,
  },
  {
    key: 'changement_regime',
    label: 'Demande de changement de régime fiscal',
    type: 'administratif',
    objet: 'Demande de changement de régime fiscal',
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

Suite à l'évolution de l'activité de {CLIENT_NOM} (NIU : {CLIENT_NIU}), j'ai l'honneur de solliciter le passage de notre régime fiscal actuel au régime adapté à notre nouveau chiffre d'affaires.

Une note de présentation explicative est jointe à la présente.

Veuillez agréer, Monsieur le Chef de Centre, l'expression de mes salutations distinguées.`,
    pj: `Note de présentation
Justificatifs de chiffre d'affaires`,
  },
  {
    key: 'cessation_activite',
    label: "Déclaration de cessation d'activité",
    type: 'administratif',
    objet: "Déclaration de cessation d'activité",
    destinataire: DGI_DESTINATAIRE,
    destinataireAdresse: '{CLIENT_VILLE}',
    corps: `Monsieur le Chef de Centre,

J'ai l'honneur de vous notifier, au nom de {CLIENT_NOM} (NIU : {CLIENT_NIU}), la cessation effective d'activité à compter de la date indiquée dans la déclaration jointe.

Toutes les obligations en cours seront régularisées dans les meilleurs délais.

Je vous prie d'agréer, Monsieur le Chef de Centre, l'expression de mes salutations respectueuses.`,
    pj: `Déclaration de cessation
Dernière DSF déposée
Quittances à jour`,
  },
];

// ============== EXPORT GLOBAL ==============

export const MODELES_COURRIER: Record<string, CourrierModele> = Object.fromEntries(
  [...MODELES_FISCAL, ...MODELES_CLIENT, ...MODELES_ADMIN].map((m) => [m.key, m]),
);

export const MODELES_PAR_CATEGORIE = {
  fiscal: MODELES_FISCAL,
  client: MODELES_CLIENT,
  administratif: MODELES_ADMIN,
};

// ============== PLACEHOLDERS ==============

export function applyPlaceholders(text: string, client: ClientSpec | null | undefined, extra: Record<string, string> = {}): string {
  if (!text) return '';
  const civiliteLongue = getCiviliteLongue(client?.civilite);
  const map: Record<string, string> = {
    '{CLIENT_NOM}': client?.name || '',
    '{CLIENT_NIU}': client?.niu || '[NIU non renseigné]',
    '{CLIENT_VILLE}': client?.ville || '[Ville non renseignée]',
    '{CLIENT_QUARTIER}': client?.quartier || '',
    '{CLIENT_CONTACT}': client?.contact || '',
    '{CIVILITE}': civiliteLongue,
    ...extra,
  };
  let out = text;
  for (const [k, v] of Object.entries(map)) {
    out = out.replaceAll(k, v);
  }
  return out;
}

export function applyPlaceholdersToPayload(
  payload: CourrierModelePayload,
  client: ClientSpec | null | undefined,
  extra: Record<string, string> = {},
): CourrierModelePayload {
  return {
    type: payload.type,
    objet: applyPlaceholders(payload.objet, client, extra),
    corps: applyPlaceholders(payload.corps, client, extra),
    pj: applyPlaceholders(payload.pj, client, extra),
    destinataire: applyPlaceholders(payload.destinataire, client, extra),
    destinataireAdresse: applyPlaceholders(payload.destinataireAdresse, client, extra),
  };
}

// ============== MODÈLES DYNAMIQUES (SPEC §9.6) ==============

// Renvoie un payload enrichi avec les données du client (montants IGS/Patente, etc.)
// pour les modèles marqués `dynamic`.
export function getDynamicModelePayload(
  key: string,
  client: ClientSpec | null | undefined,
  extra: { fraisRenouvellement?: number } = {},
): CourrierModelePayload | null {
  const base = MODELES_COURRIER[key];
  if (!base || !base.dynamic) return null;

  let frais = '15 000 F CFA';
  if (extra.fraisRenouvellement && extra.fraisRenouvellement > 0) {
    frais = formatMoney(extra.fraisRenouvellement);
  }

  // Cas spécial : injection des montants IGS/Patente dans le corps
  let corps = base.corps;

  if (key === 'transmission_devis' && client) {
    let bloc = '';
    if (client.regimeFiscal === 'IGS' && client.chiffreAffaires) {
      const { montant, classe } = calculateIGS(client.chiffreAffaires, !!client.isCGA);
      bloc = `\n\nMontant prévisionnel IGS (Classe ${classe}) : ${formatMoney(montant)}`;
    } else if (client.regimeFiscal === 'Reel' && client.chiffreAffaires) {
      const p = calculatePatente(client.chiffreAffaires);
      bloc = `\n\nMontant prévisionnel Patente : ${formatMoney(p.montant)}`;
    }
    corps = corps.replace(/\.\s*$/, '.') + bloc;
  }

  const merged: CourrierModelePayload = {
    type: base.type,
    objet: base.objet,
    corps,
    pj: base.pj,
    destinataire: base.destinataire,
    destinataireAdresse: base.destinataireAdresse,
  };

  return applyPlaceholdersToPayload(merged, client, {
    '{FRAIS_RENOUVELLEMENT}': frais,
  });
}

// ============== HELPERS DE STYLE ==============

export const COURRIER_TYPE_BADGE: Record<CourrierType, string> = {
  fiscal: 'bg-blue-100 text-blue-800',
  client: 'bg-green-100 text-green-800',
  relance: 'bg-red-100 text-red-800',
  administratif: 'bg-violet-100 text-violet-800',
  autre: 'bg-gray-100 text-gray-800',
};

export const COURRIER_STATUT_BADGE: Record<CourrierStatut, string> = {
  brouillon: 'bg-yellow-100 text-yellow-800',
  envoye: 'bg-blue-100 text-blue-800',
  accuse: 'bg-green-100 text-green-800',
  classe: 'bg-gray-100 text-gray-800',
};

export const COURRIER_TYPE_LABEL: Record<CourrierType, string> = {
  fiscal: 'Courrier fiscal (DGI)',
  client: 'Courrier client',
  relance: 'Relance de paiement',
  administratif: 'Administratif',
  autre: 'Autre',
};

export const COURRIER_STATUT_LABEL: Record<CourrierStatut, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accuse: 'Accusé R.',
  classe: 'Classé',
};

export function generateCourrierRef(existingCount: number, date: Date = new Date()): string {
  const num = String(existingCount + 1).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `CRR-${num}/${date.getFullYear()}/${month}`;
}
