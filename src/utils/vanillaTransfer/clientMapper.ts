// Conversion bidirectionnelle des fiches clients entre le modèle vanilla
// (champs à plat, libellés PascalCase) et le modèle PRISMA GESTION (Supabase).
//
// Export : les montants fiscaux (IGS, TDL, PSL, Bail, TPF…) sont recalculés par
// le moteur canonique (`adaptClient` → `computeAllTaxes`) plutôt que recopiés,
// afin de garantir des fiches cohérentes avec les barèmes en vigueur.

import {
  Agence,
  Client,
  ClientStatus,
  EtatCivil,
  FormeJuridique,
  Interaction,
  RegimeFiscal,
  Sexe,
  SituationImmobiliere,
} from "@/types/client";
import {
  adaptClient,
  computeAgencyImmo,
  type AgenceSpec,
} from "@/lib/spec/fiscal";
import { VanillaAgence, VanillaClient } from "./types";

/**
 * Hash déterministe (djb2) → identifiant numérique stable pour un id Supabase.
 * L'application vanilla fusionne l'historique par `id` : un id stable rend les
 * exports répétés idempotents (pas de doublon à la réimportation).
 */
export function stableNumericId(value: string): number {
  let h = 5381;
  for (let i = 0; i < value.length; i++) {
    h = ((h << 5) + h + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

const norm = (s: string | undefined | null): string =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

const REGIME_TO_PRISMA: Record<string, RegimeFiscal> = {
  igs: "igs",
  reel: "reel",
  nonpro: "non_professionnel",
  non_professionnel: "non_professionnel",
  obnl: "obnl",
};

const REGIME_TO_VANILLA: Record<string, string> = {
  igs: "IGS",
  reel: "Reel",
  non_professionnel: "NonPro",
  obnl: "OBNL",
};

const STATUT_IMMO_TO_PRISMA: Record<string, SituationImmobiliere> = {
  locataire: "locataire",
  proprietaire: "proprietaire",
  "les deux": "les_deux",
  les_deux: "les_deux",
};

const STATUT_IMMO_AGENCE_TO_VANILLA: Record<string, string> = {
  locataire: "Locataire",
  proprietaire: "Proprietaire",
  les_deux: "Les deux",
};

// Validation des énumérations PRISMA portées par les champs « de passage » :
// une valeur inconnue est abandonnée (undefined) plutôt que de risquer une
// contrainte CHECK à l'insertion.
const FORMES_JURIDIQUES: ReadonlySet<string> = new Set([
  "sa",
  "sarl",
  "sas",
  "snc",
  "association",
  "gie",
  "autre",
]);
const SEXES: ReadonlySet<string> = new Set(["homme", "femme"]);
const ETATS_CIVILS: ReadonlySet<string> = new Set(["celibataire", "marie", "divorce", "veuf"]);
const STATUTS_PRISMA: ReadonlySet<string> = new Set(["actif", "inactif", "archive"]);

const asEnum = <T extends string>(value: string | undefined, allowed: ReadonlySet<string>): T | undefined =>
  value && allowed.has(norm(value)) ? (norm(value) as T) : undefined;

/** Interactions PRISMA de passage → tableau assaini (id/date/description). */
function sanitizeInteractions(raw: VanillaClient["interactions"]): Interaction[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i) => i && typeof i === "object" && (i.description || i.date))
    .map((i, idx) => ({
      id: String(i.id || `IMP-${idx + 1}`),
      date: i.date || new Date().toISOString(),
      description: String(i.description || ""),
    }));
}

export function vanillaAgenceToPrisma(a: VanillaAgence): Agence {
  return {
    libelle: a.libelle || "",
    ville: a.ville || "",
    quartier: a.quartier || "",
    principale: !!a.principale,
    chiffreAffaires: Number(a.chiffreAffaires) || 0,
    statutImmo: (STATUT_IMMO_TO_PRISMA[norm(a.statutImmo)] ?? "") as Agence["statutImmo"],
    loyerMensuel: Number(a.loyerMensuel) || 0,
    valeurBien: Number(a.valeurBien) || 0,
  };
}

/** Fiche vanilla → client PRISMA prêt à insérer (sans id ni created_at). */
export function vanillaToPrismaClient(v: VanillaClient): Partial<Client> {
  const type: Client["type"] = norm(v.type).includes("morale") ? "morale" : "physique";
  const regimefiscal = REGIME_TO_PRISMA[norm(v.regimeFiscal)] ?? "reel";

  const immoType = STATUT_IMMO_TO_PRISMA[norm(v.statutImmo)];
  const situationimmobiliere = immoType
    ? {
        type: immoType,
        ...(immoType !== "locataire" ? { valeur: Number(v.valeurBien) || 0 } : {}),
        ...(immoType !== "proprietaire" ? { loyer: Number(v.loyerMensuel) || 0 } : {}),
      }
    : undefined;

  const agences =
    Array.isArray(v.agences) && v.agences.length > 0
      ? v.agences.map(vanillaAgenceToPrisma)
      : undefined;

  // Statut : le champ de passage statutPrisma (actif/inactif/archive) prime
  // sur le statut vanilla (Actif/Inactif), qui ne connaît pas « archive ».
  const statut =
    asEnum<ClientStatus>(v.statutPrisma, STATUTS_PRISMA) ??
    (norm(v.statut) === "inactif" ? "inactif" : "actif");

  return {
    type,
    nom: type === "physique" ? v.name || "" : undefined,
    raisonsociale: type === "morale" ? v.name || "" : undefined,
    niu: (v.niu || "").trim(),
    centrerattachement: v.cdi || "",
    adresse: { ville: v.ville || "", quartier: v.quartier || "", lieuDit: v.lieuDit || "" },
    contact: {
      telephone: v.phone || "",
      email: v.email || "",
      contact_principal: v.contact || "",
    },
    civilite: norm(v.civilite).startsWith("mme") || norm(v.civilite).startsWith("madame") ? "Mme" : "M.",
    secteuractivite: v.secteur || "",
    numerocnps: v.cnps || undefined,
    gestionexternalisee: norm(v.externalise) === "oui",
    statut,
    regimefiscal,
    chiffreaffaires: Number(v.chiffreAffaires) || 0,
    iscga: !!v.isCGA,
    isvendeurboissons: !!v.isVendeurBoissons,
    modepaiementigs: norm(v.modePaiementIGS) === "trimestriel" ? "trimestriel" : "annuel",
    modepaiementpsl: norm(v.modePaiementPSL) === "trimestriel" ? "trimestriel" : "annuel",
    situationimmobiliere,
    agences,
    interactions: sanitizeInteractions(v.interactions),
    // Champs PRISMA de passage (identité entreprise / état civil)
    nomcommercial: v.nomCommercial || undefined,
    sigle: v.sigle || undefined,
    numerorccm: v.rccm || undefined,
    formejuridique: asEnum<FormeJuridique>(v.formeJuridique, FORMES_JURIDIQUES),
    nomdirigeant: v.nomDirigeant || undefined,
    datecreation: v.dateCreationEntreprise || undefined,
    lieucreation: v.lieuCreationEntreprise || undefined,
    sexe: asEnum<Sexe>(v.sexe, SEXES),
    etatcivil: asEnum<EtatCivil>(v.etatCivil, ETATS_CIVILS),
  };
}

/** Client PRISMA → fiche vanilla complète (montants recalculés). */
export function prismaToVanillaClient(c: Client): VanillaClient {
  const spec = adaptClient(c);

  const agences: VanillaAgence[] = (c.agences || []).map((a) => {
    const r = computeAgencyImmo(a as AgenceSpec, spec.regimeFiscal);
    return {
      libelle: a.libelle,
      ville: a.ville,
      quartier: a.quartier,
      principale: !!a.principale,
      chiffreAffaires: a.chiffreAffaires || 0,
      statutImmo: STATUT_IMMO_AGENCE_TO_VANILLA[a.statutImmo] ?? "",
      loyerMensuel: a.loyerMensuel || 0,
      loyerAnnuel: (a.loyerMensuel || 0) * 12,
      valeurBien: a.valeurBien || 0,
      psl: r.psl,
      bail: r.bail,
      tf: r.tf,
    };
  });

  return {
    id: stableNumericId(String(c.id)),
    type: spec.type,
    name: spec.name,
    niu: spec.niu,
    cdi: spec.cdi,
    ville: spec.ville,
    quartier: spec.quartier,
    phone: spec.phone,
    email: spec.email || "",
    contact: spec.contact || spec.name,
    civilite: spec.civilite,
    secteur: spec.secteur,
    cnps: spec.cnps || "",
    externalise: spec.externalise,
    statut: spec.statut,
    statutImmo: spec.statutImmo || "",
    loyerMensuel: spec.loyerMensuel || 0,
    loyerAnnuel: spec.loyerAnnuel || 0,
    valeurBien: spec.valeurBien || 0,
    psl: spec.psl || 0,
    bail: spec.bail || 0,
    tauxBail: spec.tauxBail || 10,
    tf: spec.tf || 0,
    regimeFiscal: REGIME_TO_VANILLA[c.regimefiscal] ?? (spec.regimeFiscal || ""),
    chiffreAffaires: spec.chiffreAffaires || 0,
    isCGA: !!spec.isCGA,
    isVendeurBoissons: !!spec.isVendeurBoissons,
    modePaiementIGS: spec.modePaiementIGS,
    modePaiementPSL: spec.modePaiementPSL,
    igs: spec.igs || 0,
    igsClasse: spec.igsClasse || 0,
    patente: spec.patente || 0,
    tdl: spec.tdl || 0,
    soldeIR: spec.soldeIR || 0,
    licence: spec.licence || 0,
    createdAt: c.created_at || new Date().toISOString(),
    ...(agences.length > 0 ? { agences } : {}),
    // Champs PRISMA de passage : émis seulement s'ils sont renseignés, pour
    // garder les exports de fiches d'origine vanilla identiques à avant.
    ...(c.nomcommercial ? { nomCommercial: c.nomcommercial } : {}),
    ...(c.sigle ? { sigle: c.sigle } : {}),
    ...(c.numerorccm ? { rccm: c.numerorccm } : {}),
    ...(c.formejuridique ? { formeJuridique: c.formejuridique } : {}),
    ...(c.nomdirigeant ? { nomDirigeant: c.nomdirigeant } : {}),
    ...(c.datecreation ? { dateCreationEntreprise: c.datecreation } : {}),
    ...(c.lieucreation ? { lieuCreationEntreprise: c.lieucreation } : {}),
    ...(c.sexe ? { sexe: c.sexe } : {}),
    ...(c.etatcivil ? { etatCivil: c.etatcivil } : {}),
    ...(c.adresse?.lieuDit ? { lieuDit: c.adresse.lieuDit } : {}),
    ...(c.statut ? { statutPrisma: c.statut } : {}),
    ...(Array.isArray(c.interactions) && c.interactions.length > 0
      ? { interactions: c.interactions }
      : {}),
  };
}
