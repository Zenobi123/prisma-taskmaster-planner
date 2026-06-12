// Format d'échange PRISMA-CLIENTS (v1) — enveloppe JSON commune à l'application
// vanilla (facturation/clients.html) et à PRISMA GESTION. Côté vanilla, l'export
// d'un client embarque son historique d'opérations rattaché par NOM de client ;
// la restauration fusionne chaque collection par `id` (sans doublon).

export const VANILLA_EXPORT_FORMAT = "PRISMA-CLIENTS";
export const VANILLA_EXPORT_VERSION = 1;

export const VANILLA_HISTORY_KEYS = [
  "factures",
  "devis",
  "recus",
  "propositions",
  "notes",
  "courriers",
  "contrats",
] as const;

export type VanillaHistoryKey = (typeof VANILLA_HISTORY_KEYS)[number];

/** Agence/établissement vanilla — statutImmo en PascalCase ("Locataire", …). */
export interface VanillaAgence {
  libelle?: string;
  ville?: string;
  quartier?: string;
  principale?: boolean;
  chiffreAffaires?: number;
  statutImmo?: string;
  loyerMensuel?: number;
  loyerAnnuel?: number;
  valeurBien?: number;
  psl?: number;
  bail?: number;
  tf?: number;
}

/** Interaction PRISMA (journal de suivi client) — de passage dans le vanilla. */
export interface VanillaInteraction {
  id?: string;
  date?: string;
  description?: string;
}

/** Fiche client vanilla (champs à plat, montants fiscaux précalculés). */
export interface VanillaClient {
  id?: number;
  type?: string; // "Personne physique" | "Personne morale"
  name?: string;
  niu?: string;
  cdi?: string;
  ville?: string;
  quartier?: string;
  phone?: string;
  email?: string;
  contact?: string;
  civilite?: string; // "M." | "Mme"
  secteur?: string;
  cnps?: string;
  externalise?: string; // "Oui" | "Non"
  statut?: string; // "Actif" | "Inactif"
  statutImmo?: string; // "Locataire" | "Proprietaire" | "Les deux" | ""
  loyerMensuel?: number;
  loyerAnnuel?: number;
  valeurBien?: number;
  psl?: number;
  bail?: number;
  tauxBail?: number;
  tf?: number;
  regimeFiscal?: string; // "IGS" | "Reel" | "NonPro" | "OBNL" | ""
  chiffreAffaires?: number;
  isCGA?: boolean;
  isVendeurBoissons?: boolean;
  modePaiementIGS?: string;
  modePaiementPSL?: string;
  igs?: number;
  igsClasse?: number;
  patente?: number;
  tdl?: number;
  soldeIR?: number;
  licence?: number;
  createdAt?: string;
  agences?: VanillaAgence[];

  // --- Champs PRISMA « de passage » -------------------------------------
  // Absents des formulaires vanilla, mais préservés tels quels par son
  // import (spread ...row) et son export : l'aller-retour
  // PRISMA → vanilla → PRISMA est donc sans perte pour la fiche client.
  nomCommercial?: string;
  sigle?: string;
  rccm?: string; // numerorccm
  formeJuridique?: string; // sa | sarl | sas | snc | association | gie | autre
  nomDirigeant?: string;
  dateCreationEntreprise?: string; // datecreation (création de l'entreprise)
  lieuCreationEntreprise?: string; // lieucreation
  sexe?: string; // homme | femme
  etatCivil?: string; // celibataire | marie | divorce | veuf
  lieuDit?: string; // adresse.lieuDit
  statutPrisma?: string; // actif | inactif | archive (préserve « archive »)
  interactions?: VanillaInteraction[];
}

export interface VanillaPrestation {
  type?: string; // "Impôt" | "Honoraire"
  designation?: string;
  qty?: number;
  price?: number;
  total?: number;
}

export interface VanillaFacture {
  id?: number;
  number?: string; // "N° NNNN/YYYY/MM"
  client?: string;
  clientData?: VanillaClient;
  prestations?: VanillaPrestation[];
  total?: number;
  totalImpots?: number;
  totalHonoraires?: number;
  date?: string;
  isManual?: boolean;
  status?: string; // "émise" | "partielle" | "payée" | …
  fromDevis?: boolean;
  fromDevisId?: number;
  fromDevisNumber?: string;
  // Champs PRISMA de passage (aller-retour sans perte)
  echeance?: string;
  modePaiementPrisma?: string; // espèces | virement | orange_money | …
  notes?: string;
}

export interface VanillaDevis {
  id?: number;
  number?: string; // "DEVIS-NNNN/YYYY/MM"
  client?: string;
  clientData?: VanillaClient;
  prestations?: VanillaPrestation[];
  total?: number;
  totalImpots?: number;
  totalHonoraires?: number;
  date?: string;
  isManual?: boolean;
  status?: string; // "brouillon" | "envoyé" | "accepté" | "refusé" | "converti"
  statusBeforeConversion?: string;
  convertedToFacture?: string;
  convertedToFactureId?: number;
  // Champs PRISMA de passage (aller-retour sans perte)
  objet?: string;
  notes?: string;
  dateValidite?: string;
}

export interface VanillaLignePayee {
  type?: string; // "Impôt" | "Honoraire"
  designation?: string;
  montant?: number;
}

export interface VanillaRecu {
  id?: number;
  number?: string; // "RECU-NNNN/YYYY"
  client?: string;
  clientData?: VanillaClient;
  montant?: number;
  montantImpots?: number;
  montantHonoraires?: number;
  paymentMode?: string; // "Espèces" | "Virement bancaire" | "Mobile Money" | "Chèque"
  motif?: string;
  lignesPayees?: VanillaLignePayee[];
  date?: string;
  isManual?: boolean;
  factureIds?: number[];
  factureNumbers?: string[];
  sourceType?: string | null;
  sourceId?: number | null;
  sourceNumber?: string | null;
  // Champs PRISMA de passage (aller-retour sans perte)
  notes?: string;
  estVerifie?: boolean;
}

export interface VanillaPropositionLigne {
  type?: string; // "Impôt" | "Honoraire"
  designation?: string;
  base?: number;
  base_annuelle?: number;
  fraction?: number;
  amount?: number;
  montant?: number;
}

export interface VanillaProposition {
  id?: number;
  number?: string;
  client?: string;
  clientData?: VanillaClient;
  lignes?: VanillaPropositionLigne[];
  totalImpots?: number;
  totalHonoraires?: number;
  total?: number;
  note?: string;
  date?: string;
  isManual?: boolean;
  sourceType?: string | null;
  sourceId?: number | null;
  sourceNumber?: string | null;
  // Champ PRISMA de passage : statut de la proposition (brouillon | envoyee | acceptee)
  statusPrisma?: string;
}

export interface VanillaCourrier {
  id?: number;
  ref?: string;
  type?: string;
  client?: string;
  clientData?: VanillaClient | null;
  destinataire?: string;
  destinataireAdresse?: string;
  objet?: string;
  corps?: string;
  pj?: string;
  modeleKey?: string;
  statut?: string;
  modeEnvoi?: string;
  dateEnvoi?: string;
  notesSuivi?: string;
  date?: string;
  isManual?: boolean;
  // Champs PRISMA de passage (aller-retour sans perte). Les champs vanilla
  // pj / notesSuivi / destinataireAdresse n'ont pas de colonne PRISMA : ils
  // survivent au transit vanilla → vanilla mais pas à un stockage PRISMA.
  templateTitre?: string;
  messagePersonnalise?: string;
}

export interface VanillaHistorique {
  factures?: VanillaFacture[];
  devis?: VanillaDevis[];
  recus?: VanillaRecu[];
  propositions?: VanillaProposition[];
  notes?: Array<Record<string, unknown>>;
  courriers?: VanillaCourrier[];
  contrats?: Array<Record<string, unknown>>;
}

export interface VanillaEnvelope {
  format: typeof VANILLA_EXPORT_FORMAT;
  version: number;
  type?: "client" | "liste" | string;
  exportedAt?: string;
  count?: number;
  clients: VanillaClient[];
  historique?: VanillaHistorique;
}
