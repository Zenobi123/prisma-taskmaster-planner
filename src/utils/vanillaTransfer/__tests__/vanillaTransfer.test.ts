import { describe, it, expect } from "vitest";
import { isVanillaEnvelope, parseVanillaFile, countHistorique, buildVanillaEnvelope, slugifyClientName } from "../envelope";
import { stableNumericId, vanillaToPrismaClient, prismaToVanillaClient, vanillaAgenceToPrisma } from "../clientMapper";
import {
  vanillaFactureToRow,
  factureRowToVanilla,
  vanillaDevisToRow,
  devisRowToVanilla,
  vanillaRecuToPaiementRow,
  paiementRowToVanillaRecu,
  vanillaPropositionToRow,
  vanillaCourrierToRow,
  prestationVanillaToRow,
  prestationRowToVanilla,
} from "../documentMappers";
import { Client } from "@/types/client";
import { VanillaClient, VanillaEnvelope } from "../types";

// Fixture extraite d'un export réel de l'application vanilla (client + historique).
const FIXTURE: VanillaEnvelope = {
  format: "PRISMA-CLIENTS",
  version: 1,
  type: "client",
  exportedAt: "2026-06-11T17:48:57.349Z",
  clients: [
    {
      id: 1778216712363,
      type: "Personne physique",
      name: "NGAH ESSAMA JACQUELINE FLORENCE",
      niu: "P117614879531D",
      cdi: "CFLP Yaoundé 5",
      ville: "Yaoundé",
      quartier: "Nkolbisson",
      phone: "699350141",
      email: "",
      contact: "NGAH ESSAMA JACQUELINE FLORENCE",
      civilite: "Mme",
      secteur: "Services",
      cnps: "",
      externalise: "Non",
      statut: "Actif",
      statutImmo: "Proprietaire",
      loyerMensuel: 0,
      loyerAnnuel: 0,
      valeurBien: 10000000,
      psl: 0,
      bail: 0,
      tauxBail: 10,
      tf: 10000,
      regimeFiscal: "IGS",
      chiffreAffaires: 6000000,
      isCGA: true,
      isVendeurBoissons: false,
      modePaiementIGS: "annuel",
      modePaiementPSL: "annuel",
      igs: 150000,
      igsClasse: 7,
      patente: 0,
      tdl: 45000,
      soldeIR: 0,
      licence: 0,
      createdAt: "2026-05-08T05:05:12.364Z",
    },
  ],
  historique: {
    factures: [
      {
        id: 1778333626749,
        number: "N° 0005/2026/05",
        client: "NGAH ESSAMA JACQUELINE FLORENCE",
        prestations: [
          { type: "Impôt", designation: "Impôt Général Synthétique (IGS) - Classe 7 (CGA)", qty: 1, price: 150000, total: 150000 },
          { type: "Honoraire", designation: "Montage et mise en ligne DSF", qty: 1, price: 20000, total: 20000 },
        ],
        total: 170000,
        totalImpots: 150000,
        totalHonoraires: 20000,
        date: "2026-05-09T13:33:46.749Z",
        isManual: false,
        status: "émise",
        fromDevis: true,
        fromDevisId: 1778217940347,
        fromDevisNumber: "DEVIS-0008/2026/05",
      },
    ],
    devis: [
      {
        id: 1778217940347,
        number: "DEVIS-0008/2026/05",
        client: "NGAH ESSAMA JACQUELINE FLORENCE",
        prestations: [
          { type: "Impôt", designation: "Taxe de Développement Local (TDL)", qty: 1, price: 45000, total: 45000 },
        ],
        total: 45000,
        totalImpots: 45000,
        totalHonoraires: 0,
        date: "2026-05-08T05:25:40.346Z",
        isManual: false,
        status: "converti",
        statusBeforeConversion: "accepté",
        convertedToFacture: "N° 0005/2026/05",
        convertedToFactureId: 1778333626749,
      },
    ],
    recus: [
      {
        id: 1778334521101,
        number: "RECU-0004/2026",
        client: "NGAH ESSAMA JACQUELINE FLORENCE",
        montant: 170000,
        montantImpots: 150000,
        montantHonoraires: 20000,
        paymentMode: "Espèces",
        motif: "Règlement facture N° 0005/2026/05",
        lignesPayees: [
          { type: "Impôt", designation: "Impôt Général Synthétique (IGS) - Classe 7 (CGA)", montant: 150000 },
        ],
        date: "2026-05-09T13:48:41.101Z",
        isManual: false,
        factureIds: [1778333626749],
        factureNumbers: ["N° 0005/2026/05"],
        sourceType: "facture",
        sourceId: 1778333626749,
        sourceNumber: "N° 0005/2026/05",
      },
    ],
    propositions: [],
    notes: [],
    courriers: [],
    contrats: [],
  },
};

describe("envelope — détection et validation PRISMA-CLIENTS", () => {
  it("reconnaît une enveloppe valide", () => {
    expect(isVanillaEnvelope(FIXTURE)).toBe(true);
    const { envelope, error } = parseVanillaFile(JSON.stringify(FIXTURE));
    expect(error).toBeUndefined();
    expect(envelope?.clients).toHaveLength(1);
  });

  it("ne reconnaît pas un tableau de clients brut", () => {
    expect(isVanillaEnvelope([{ niu: "X" }])).toBe(false);
    const { envelope } = parseVanillaFile(JSON.stringify([{ niu: "X" }]));
    expect(envelope).toBeNull();
  });

  it("rejette le JSON invalide et les versions futures", () => {
    expect(parseVanillaFile("{pas du json").error).toBeTruthy();
    const future = { ...FIXTURE, version: 99 };
    expect(parseVanillaFile(JSON.stringify(future)).error).toMatch(/Version/);
  });

  it("compte l'historique", () => {
    expect(countHistorique(FIXTURE.historique)).toBe(3);
    expect(countHistorique(undefined)).toBe(0);
  });

  it("construit une enveloppe liste / client selon l'historique", () => {
    const sans = buildVanillaEnvelope([{ name: "A" }]);
    expect(sans.type).toBe("liste");
    expect(sans.count).toBe(1);
    expect(sans.historique).toBeUndefined();

    const avec = buildVanillaEnvelope([{ name: "A" }], { factures: [] });
    expect(avec.type).toBe("client");
    expect(avec.historique).toBeDefined();
  });

  it("accepte une enveloppe « liste » multi-clients avec historique (export global vanilla)", () => {
    const liste = {
      format: "PRISMA-CLIENTS",
      version: 1,
      type: "liste",
      count: 2,
      clients: [FIXTURE.clients[0], { ...FIXTURE.clients[0], name: "AUTRE CLIENT", niu: "P000" }],
      historique: FIXTURE.historique,
    };
    const { envelope, error } = parseVanillaFile(JSON.stringify(liste));
    expect(error).toBeUndefined();
    expect(envelope?.clients).toHaveLength(2);
    expect(countHistorique(envelope?.historique)).toBe(3);
  });

  it("slugifie le nom de fichier comme le vanilla", () => {
    expect(slugifyClientName("NGAH ESSAMA JACQUELINE FLORENCE")).toBe(
      "NGAH_ESSAMA_JACQUELINE_FLORENCE",
    );
    expect(slugifyClientName("Société Élan & Cie")).toBe("Societe_Elan_Cie");
    expect(slugifyClientName(undefined)).toBe("client");
  });
});

describe("clientMapper — vanilla → PRISMA", () => {
  const vc = FIXTURE.clients[0];

  it("convertit la fiche du fichier d'export réel", () => {
    const c = vanillaToPrismaClient(vc);
    expect(c.type).toBe("physique");
    expect(c.nom).toBe("NGAH ESSAMA JACQUELINE FLORENCE");
    expect(c.raisonsociale).toBeUndefined();
    expect(c.niu).toBe("P117614879531D");
    expect(c.centrerattachement).toBe("CFLP Yaoundé 5");
    expect(c.regimefiscal).toBe("igs");
    expect(c.civilite).toBe("Mme");
    expect(c.chiffreaffaires).toBe(6000000);
    expect(c.iscga).toBe(true);
    expect(c.isvendeurboissons).toBe(false);
    expect(c.modepaiementigs).toBe("annuel");
    expect(c.statut).toBe("actif");
    expect(c.gestionexternalisee).toBe(false);
    expect(c.adresse).toEqual({ ville: "Yaoundé", quartier: "Nkolbisson", lieuDit: "" });
    expect(c.contact?.telephone).toBe("699350141");
  });

  it("convertit la situation immobilière (propriétaire)", () => {
    const c = vanillaToPrismaClient(vc);
    expect(c.situationimmobiliere).toEqual({ type: "proprietaire", valeur: 10000000 });
  });

  it("convertit un locataire et « Les deux »", () => {
    const loc = vanillaToPrismaClient({ ...vc, statutImmo: "Locataire", loyerMensuel: 50000 });
    expect(loc.situationimmobiliere).toEqual({ type: "locataire", loyer: 50000 });

    const deux = vanillaToPrismaClient({
      ...vc,
      statutImmo: "Les deux",
      loyerMensuel: 50000,
      valeurBien: 20000000,
    });
    expect(deux.situationimmobiliere).toEqual({
      type: "les_deux",
      valeur: 20000000,
      loyer: 50000,
    });
  });

  it("mappe les régimes NonPro et OBNL", () => {
    expect(vanillaToPrismaClient({ ...vc, regimeFiscal: "NonPro" }).regimefiscal).toBe(
      "non_professionnel",
    );
    expect(vanillaToPrismaClient({ ...vc, regimeFiscal: "OBNL" }).regimefiscal).toBe("obnl");
    expect(vanillaToPrismaClient({ ...vc, regimeFiscal: "" }).regimefiscal).toBe("reel");
  });

  it("convertit les agences (PascalCase → snake_case)", () => {
    const agence = vanillaAgenceToPrisma({
      libelle: "Agence Bonanjo",
      ville: "Douala",
      quartier: "Akwa",
      principale: false,
      chiffreAffaires: 3000000,
      statutImmo: "Les deux",
      loyerMensuel: 100000,
      valeurBien: 5000000,
      psl: 120000,
      bail: 120000,
      tf: 5000,
    });
    expect(agence.statutImmo).toBe("les_deux");
    expect(agence.loyerMensuel).toBe(100000);
    // Les champs calculés (psl/bail/tf) ne sont pas persistés côté PRISMA.
    expect("psl" in agence).toBe(false);
  });
});

describe("clientMapper — PRISMA → vanilla (aller-retour)", () => {
  const prismaClient: Client = {
    id: "0bd9e64e-0000-0000-0000-000000000000",
    type: "physique",
    nom: "NGAH ESSAMA JACQUELINE FLORENCE",
    regimefiscal: "igs",
    niu: "P117614879531D",
    centrerattachement: "CFLP Yaoundé 5",
    adresse: { ville: "Yaoundé", quartier: "Nkolbisson", lieuDit: "" },
    contact: { telephone: "699350141", email: "", contact_principal: "NGAH ESSAMA JACQUELINE FLORENCE" },
    secteuractivite: "Services",
    interactions: [],
    statut: "actif",
    gestionexternalisee: false,
    civilite: "Mme",
    chiffreaffaires: 6000000,
    iscga: true,
    isvendeurboissons: false,
    modepaiementigs: "annuel",
    modepaiementpsl: "annuel",
    situationimmobiliere: { type: "proprietaire", valeur: 10000000 },
    created_at: "2026-05-08T05:05:12.364Z",
  };

  it("recalcule les montants fiscaux du fichier d'export réel", () => {
    const v = prismaToVanillaClient(prismaClient);
    // Valeurs attendues = celles présentes dans l'export vanilla d'origine.
    expect(v.type).toBe("Personne physique");
    expect(v.regimeFiscal).toBe("IGS");
    expect(v.statutImmo).toBe("Proprietaire");
    expect(v.igs).toBe(150000); // classe 7 (CA 6 M), CGA −50 %
    expect(v.igsClasse).toBe(7);
    expect(v.tdl).toBe(45000); // TDL sur IGS principal 300 000
    expect(v.tf).toBe(10000); // 0,1 % de 10 M
    expect(v.psl).toBe(0);
    expect(v.bail).toBe(0);
    expect(v.civilite).toBe("Mme");
    expect(v.externalise).toBe("Non");
    expect(v.statut).toBe("Actif");
  });

  it("produit un id numérique stable", () => {
    const a = prismaToVanillaClient(prismaClient).id;
    const b = prismaToVanillaClient(prismaClient).id;
    expect(a).toBe(b);
    expect(typeof a).toBe("number");
    expect(a).toBeGreaterThan(0);
  });

  it("survit à l'aller-retour vanilla → PRISMA → vanilla", () => {
    const mapped = vanillaToPrismaClient(FIXTURE.clients[0]);
    const back = prismaToVanillaClient({
      ...prismaClient,
      ...mapped,
      id: prismaClient.id,
    } as Client);
    const original = FIXTURE.clients[0];
    expect(back.name).toBe(original.name);
    expect(back.niu).toBe(original.niu);
    expect(back.regimeFiscal).toBe(original.regimeFiscal);
    expect(back.statutImmo).toBe(original.statutImmo);
    expect(back.valeurBien).toBe(original.valeurBien);
    expect(back.igs).toBe(original.igs);
    expect(back.tdl).toBe(original.tdl);
    expect(back.tf).toBe(original.tf);
    expect(back.chiffreAffaires).toBe(original.chiffreAffaires);
    expect(back.isCGA).toBe(original.isCGA);
  });

  it("exporte les agences en PascalCase avec montants par bien", () => {
    const withAgences: Client = {
      ...prismaClient,
      agences: [
        {
          libelle: "Siège (Yaoundé)",
          ville: "Yaoundé",
          quartier: "Bastos",
          principale: true,
          chiffreAffaires: 4000000,
          statutImmo: "locataire",
          loyerMensuel: 100000,
          valeurBien: 0,
        },
        {
          libelle: "Agence Douala",
          ville: "Douala",
          quartier: "Akwa",
          principale: false,
          chiffreAffaires: 2000000,
          statutImmo: "proprietaire",
          loyerMensuel: 0,
          valeurBien: 50000000,
        },
      ],
    };
    const v = prismaToVanillaClient(withAgences);
    expect(v.agences).toHaveLength(2);
    expect(v.agences![0].statutImmo).toBe("Locataire");
    expect(v.agences![0].loyerAnnuel).toBe(1200000);
    expect(v.agences![0].psl).toBe(120000);
    expect(v.agences![0].bail).toBe(120000);
    expect(v.agences![1].statutImmo).toBe("Proprietaire");
    expect(v.agences![1].tf).toBe(50000);
  });
});

describe("stableNumericId", () => {
  it("est déterministe et distinct pour des entrées différentes", () => {
    expect(stableNumericId("N° 0005/2026/05")).toBe(stableNumericId("N° 0005/2026/05"));
    expect(stableNumericId("a")).not.toBe(stableNumericId("b"));
  });
});

describe("documentMappers — factures", () => {
  const facture = FIXTURE.historique!.factures![0];

  it("vanilla → ligne Supabase", () => {
    const row = vanillaFactureToRow(facture, "client-uuid");
    expect(row.id).toBe("N° 0005/2026/05");
    expect(row.client_id).toBe("client-uuid");
    expect(row.montant).toBe(170000);
    expect(row.date).toBe("2026-05-09");
    expect(row.status).toBe("envoyée");
    expect(row.status_paiement).toBe("non_payée"); // « émise »
  });

  it("statut vanilla « payée » → payée avec montant_paye", () => {
    const row = vanillaFactureToRow({ ...facture, status: "payée" }, "client-uuid");
    expect(row.status_paiement).toBe("payée");
    expect(row.montant_paye).toBe(170000);
  });

  it("ligne Supabase → vanilla (avec lien devis)", () => {
    const v = factureRowToVanilla(
      {
        id: "N° 0005/2026/05",
        date: "2026-05-09",
        montant: 170000,
        montant_paye: 170000,
        status: "envoyée",
        status_paiement: "payée",
      },
      [
        { description: "IGS", type: "impot", quantite: 1, prix_unitaire: 150000, montant: 150000 },
        { description: "DSF", type: "honoraire", quantite: 1, prix_unitaire: 20000, montant: 20000 },
      ],
      { name: "NGAH" } as VanillaClient,
      { id: "DEV-x", numero: "DEVIS-0008/2026/05" },
    );
    expect(v.number).toBe("N° 0005/2026/05");
    expect(v.status).toBe("payée");
    expect(v.total).toBe(170000);
    expect(v.totalImpots).toBe(150000);
    expect(v.totalHonoraires).toBe(20000);
    expect(v.fromDevis).toBe(true);
    expect(v.fromDevisNumber).toBe("DEVIS-0008/2026/05");
    expect(v.prestations![0]).toEqual({
      type: "Impôt",
      designation: "IGS",
      qty: 1,
      price: 150000,
      total: 150000,
    });
  });
});

describe("documentMappers — devis", () => {
  const devis = FIXTURE.historique!.devis![0];

  it("vanilla → ligne Supabase (statut accentué normalisé)", () => {
    const row = vanillaDevisToRow(devis, "client-uuid", "N° 0005/2026/05");
    expect(row.numero).toBe("DEVIS-0008/2026/05");
    expect(row.status).toBe("converti");
    expect(row.facture_id).toBe("N° 0005/2026/05");
    expect(row.montant_total).toBe(45000);

    const accepte = vanillaDevisToRow({ ...devis, status: "accepté" }, "c", null);
    expect(accepte.status).toBe("accepte");
  });

  it("ligne Supabase → vanilla (converti, accents restitués)", () => {
    const v = devisRowToVanilla(
      {
        id: "DEV-uuid",
        numero: "DEVIS-0008/2026/05",
        date: "2026-05-08",
        status: "accepte",
        montant_total: 45000,
        facture_id: null,
      },
      [],
      { name: "NGAH" } as VanillaClient,
    );
    expect(v.status).toBe("accepté");
    expect(v.convertedToFacture).toBeUndefined();
  });
});

describe("documentMappers — reçus ↔ paiements", () => {
  const recu = FIXTURE.historique!.recus![0];

  it("vanilla → ligne paiement", () => {
    const row = vanillaRecuToPaiementRow(recu, "client-uuid", "N° 0005/2026/05", 170000);
    expect(row.reference).toBe("RECU-0004/2026");
    expect(row.facture_id).toBe("N° 0005/2026/05");
    expect(row.mode).toBe("espèces");
    expect(row.montant).toBe(170000);
    expect(row.est_credit).toBe(false);
    expect(row.solde_restant).toBe(0);
    expect(row.elements_specifiques.montantImpots).toBe(150000);
  });

  it("reçu sans facture → avance/crédit", () => {
    const row = vanillaRecuToPaiementRow({ ...recu, factureNumbers: [], sourceType: null }, "c", null, null);
    expect(row.facture_id).toBeNull();
    expect(row.est_credit).toBe(true);
  });

  it("ligne paiement → vanilla avec ventilation au prorata", () => {
    const v = paiementRowToVanillaRecu(
      {
        id: "pay-uuid",
        facture_id: "N° 0005/2026/05",
        date: "2026-05-09T13:48:41.101Z",
        montant: 170000,
        mode: "espèces",
        reference: "RECU-0004/2026",
        notes: null,
        est_credit: false,
        elements_specifiques: null,
      },
      { name: "NGAH" } as VanillaClient,
      { id: "N° 0005/2026/05", montant: 170000 },
      [
        { description: "IGS", type: "impot", quantite: 1, prix_unitaire: 150000, montant: 150000 },
        { description: "DSF", type: "honoraire", quantite: 1, prix_unitaire: 20000, montant: 20000 },
      ],
    );
    expect(v.number).toBe("RECU-0004/2026");
    expect(v.paymentMode).toBe("Espèces");
    expect(v.montantImpots).toBe(150000);
    expect(v.montantHonoraires).toBe(20000);
    expect(v.motif).toBe("Règlement facture N° 0005/2026/05");
    expect(v.factureNumbers).toEqual(["N° 0005/2026/05"]);
    // Paiement total → toutes les lignes payées.
    expect(v.lignesPayees).toHaveLength(2);
  });
});

describe("documentMappers — propositions & courriers", () => {
  it("proposition vanilla → ligne Supabase avec numéro déterministe", () => {
    const row = vanillaPropositionToRow(
      {
        id: 1778000000000,
        client: "NGAH",
        lignes: [{ type: "Impôt", designation: "IGS T1", base: 150000, fraction: 0.25, amount: 37500 }],
        total: 37500,
        totalImpots: 37500,
        totalHonoraires: 0,
        date: "2026-05-08T05:25:40.346Z",
      },
      "client-uuid",
    );
    expect(row.numero).toBe("PROP-IMP-1778000000000");
    expect(row.lignes[0]).toEqual({
      type: "impot",
      designation: "IGS T1",
      base_annuelle: 150000,
      fraction: 0.25,
      montant: 37500,
    });
    expect(row.total_impots).toBe(37500);
  });

  it("courrier vanilla → ligne Supabase", () => {
    const row = vanillaCourrierToRow(
      {
        id: 1778000000001,
        ref: "CRR-0001/2026/05",
        client: "NGAH",
        objet: "Relance IGS",
        corps: "Madame, …",
        statut: "envoyé",
        date: "2026-05-08T05:25:40.346Z",
      },
      "client-uuid",
    );
    expect(row.reference).toBe("CRR-0001/2026/05");
    expect(row.client_id).toBe("client-uuid");
    expect(row.statut).toBe("envoye");
    expect(row.sujet).toBe("Relance IGS");
  });
});

describe("documentMappers — prestations", () => {
  it("aller-retour Impôt/Honoraire", () => {
    const row = prestationVanillaToRow({ type: "Impôt", designation: "IGS", qty: 1, price: 150000, total: 150000 });
    expect(row.type).toBe("impot");
    const back = prestationRowToVanilla(row);
    expect(back.type).toBe("Impôt");
    expect(back.total).toBe(150000);
  });
});

// =============================================================================
// Transit complet : aller-retour PRISMA → vanilla → PRISMA sans perte
// (champs « de passage » portés par l'enveloppe, ignorés par les formulaires
// vanilla mais préservés par son import/export).
// =============================================================================
describe("transit complet — fiche client", () => {
  const PRISMA_MORALE: Client = {
    id: "uuid-morale-1",
    type: "morale",
    raisonsociale: "TRIPHASE SARL",
    nomcommercial: "Triphase",
    sigle: "TPH",
    numerorccm: "RC/YAO/2020/B/123",
    formejuridique: "sarl",
    nomdirigeant: "OBIANG Nathan",
    datecreation: "2020-03-01",
    lieucreation: "Yaoundé",
    regimefiscal: "reel",
    niu: "M031912756642Y",
    centrerattachement: "CIME Yaoundé Ouest",
    adresse: { ville: "Yaoundé", quartier: "Bastos", lieuDit: "Face ambassade" },
    contact: { telephone: "675807543", email: "contact@triphase.cm", contact_principal: "M. OBIANG" },
    secteuractivite: "commerce",
    interactions: [{ id: "INT-1", date: "2026-01-10T10:00:00Z", description: "Appel de relance DSF" }],
    statut: "archive",
    gestionexternalisee: true,
    civilite: "M.",
    chiffreaffaires: 60000000,
    iscga: false,
    isvendeurboissons: false,
    modepaiementigs: "annuel",
    modepaiementpsl: "annuel",
  };

  it("personne morale : identité d'entreprise, lieu-dit, archive et interactions préservés", () => {
    const vanilla = prismaToVanillaClient(PRISMA_MORALE);
    expect(vanilla.nomCommercial).toBe("Triphase");
    expect(vanilla.sigle).toBe("TPH");
    expect(vanilla.rccm).toBe("RC/YAO/2020/B/123");
    expect(vanilla.formeJuridique).toBe("sarl");
    expect(vanilla.nomDirigeant).toBe("OBIANG Nathan");
    expect(vanilla.dateCreationEntreprise).toBe("2020-03-01");
    expect(vanilla.lieuCreationEntreprise).toBe("Yaoundé");
    expect(vanilla.lieuDit).toBe("Face ambassade");
    expect(vanilla.statutPrisma).toBe("archive");
    expect(vanilla.statut).toBe("Inactif"); // l'app vanilla ne connaît pas « archive »
    expect(vanilla.interactions).toHaveLength(1);

    const back = vanillaToPrismaClient(vanilla);
    expect(back.raisonsociale).toBe("TRIPHASE SARL");
    expect(back.nomcommercial).toBe("Triphase");
    expect(back.sigle).toBe("TPH");
    expect(back.numerorccm).toBe("RC/YAO/2020/B/123");
    expect(back.formejuridique).toBe("sarl");
    expect(back.nomdirigeant).toBe("OBIANG Nathan");
    expect(back.datecreation).toBe("2020-03-01");
    expect(back.lieucreation).toBe("Yaoundé");
    expect(back.adresse?.lieuDit).toBe("Face ambassade");
    expect(back.statut).toBe("archive");
    expect(back.interactions).toEqual([
      { id: "INT-1", date: "2026-01-10T10:00:00Z", description: "Appel de relance DSF" },
    ]);
  });

  it("personne physique : sexe et état civil préservés", () => {
    const physique: Client = {
      ...PRISMA_MORALE,
      id: "uuid-physique-1",
      type: "physique",
      raisonsociale: undefined,
      nomcommercial: undefined,
      sigle: undefined,
      numerorccm: undefined,
      formejuridique: undefined,
      nom: "DUPONT JEAN",
      sexe: "homme",
      etatcivil: "marie",
      statut: "actif",
      regimefiscal: "igs",
      chiffreaffaires: 6000000,
    };
    const vanilla = prismaToVanillaClient(physique);
    expect(vanilla.sexe).toBe("homme");
    expect(vanilla.etatCivil).toBe("marie");

    const back = vanillaToPrismaClient(vanilla);
    expect(back.sexe).toBe("homme");
    expect(back.etatcivil).toBe("marie");
    expect(back.statut).toBe("actif");
  });

  it("valeurs d'énumération inconnues abandonnées sans erreur", () => {
    const back = vanillaToPrismaClient({
      ...FIXTURE.clients[0],
      formeJuridique: "kommanditgesellschaft",
      sexe: "autre",
      etatCivil: "pacse",
      statutPrisma: "supprime",
    });
    expect(back.formejuridique).toBeUndefined();
    expect(back.sexe).toBeUndefined();
    expect(back.etatcivil).toBeUndefined();
    expect(back.statut).toBe("actif"); // retombe sur le statut vanilla
  });

  it("une fiche d'origine vanilla n'émet aucun champ de passage parasite", () => {
    const mapped = vanillaToPrismaClient(FIXTURE.clients[0]);
    expect(mapped.nomcommercial).toBeUndefined();
    expect(mapped.interactions).toEqual([]);
  });
});

describe("transit complet — historique", () => {
  const vc = FIXTURE.clients[0];

  it("facture : échéance, mode de paiement et notes préservés", () => {
    const row = {
      id: "N° 0007/2026/06",
      date: "2026-06-01",
      echeance: "2026-07-15",
      montant: 100000,
      montant_paye: 0,
      status: "envoyée",
      status_paiement: "non_payée",
      mode_paiement: "virement",
      notes: "Facturation semestrielle",
    };
    const vanilla = factureRowToVanilla(row, [], vc);
    expect(vanilla.echeance).toBe("2026-07-15");
    expect(vanilla.modePaiementPrisma).toBe("virement");
    expect(vanilla.notes).toBe("Facturation semestrielle");

    const back = vanillaFactureToRow(vanilla, "client-uuid");
    expect(back.echeance).toBe("2026-07-15");
    expect(back.mode_paiement).toBe("virement");
    expect(back.notes).toBe("Facturation semestrielle");
  });

  it("devis : objet, notes et date de validité préservés", () => {
    const row = {
      id: "DEV-1",
      numero: "DEVIS-0003/2026/06",
      date: "2026-06-01",
      date_validite: "2026-06-30",
      objet: "Mission d'assistance fiscale",
      status: "envoye",
      montant_total: 250000,
      notes: "Remise 10 % incluse",
      facture_id: null,
    };
    const vanilla = devisRowToVanilla(row, [], vc);
    expect(vanilla.objet).toBe("Mission d'assistance fiscale");
    expect(vanilla.notes).toBe("Remise 10 % incluse");
    expect(vanilla.dateValidite).toBe("2026-06-30");

    const back = vanillaDevisToRow(vanilla, "client-uuid", null);
    expect(back.objet).toBe("Mission d'assistance fiscale");
    expect(back.notes).toBe("Remise 10 % incluse");
    expect(back.date_validite).toBe("2026-06-30");
  });

  it("reçu : notes et vérification préservées", () => {
    const row = {
      id: "PAI-1",
      facture_id: null,
      date: "2026-06-05T10:00:00Z",
      montant: 50000,
      mode: "orange_money",
      reference: "RECU-0009/2026",
      notes: "Acompte sur honoraires",
      est_credit: true,
      est_verifie: false,
      elements_specifiques: null,
    };
    const vanilla = paiementRowToVanillaRecu(row, vc, null, []);
    expect(vanilla.notes).toBe("Acompte sur honoraires");
    expect(vanilla.estVerifie).toBe(false);

    const back = vanillaRecuToPaiementRow(vanilla, "client-uuid", null, null);
    expect(back.notes).toBe("Acompte sur honoraires");
    expect(back.est_verifie).toBe(false);
  });

  it("proposition : statut préservé (et statut inconnu → brouillon)", () => {
    const back = vanillaPropositionToRow(
      { id: 1, number: "PROP-1", client: vc.name, lignes: [], statusPrisma: "envoyee" },
      "client-uuid",
    );
    expect(back.status).toBe("envoyee");

    const fallback = vanillaPropositionToRow(
      { id: 2, number: "PROP-2", client: vc.name, lignes: [], statusPrisma: "validee" },
      "client-uuid",
    );
    expect(fallback.status).toBe("brouillon");
  });

  it("courrier : titre du modèle et message personnalisé préservés", () => {
    const back = vanillaCourrierToRow(
      {
        ref: "CRR-0002/2026/06",
        client: vc.name,
        objet: "Convocation",
        corps: "Monsieur, …",
        templateTitre: "Convocation entretien fiscal",
        messagePersonnalise: "Merci de vous munir de votre NIU.",
      },
      "client-uuid",
    );
    expect(back.template_titre).toBe("Convocation entretien fiscal");
    expect(back.message_personnalise).toBe("Merci de vous munir de votre NIU.");
  });
});
