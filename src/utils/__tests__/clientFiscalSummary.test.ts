import { describe, it, expect } from "vitest";
import { computeClientTaxes, type ClientFiscalInput } from "@/utils/clientFiscalSummary";
import { adaptClient, computeAllTaxes } from "@/lib/spec/fiscal";

// Ces tests verrouillent l'unification du moteur fiscal côté fiche client.
// Ils garantissent que :
//  1) la fiche client utilise bien le barème/les formules canoniques
//     (et non plus l'ancien src/utils/fiscalCalculations.ts divergent) ;
//  2) les montants affichés sur la fiche client sont strictement identiques
//     à ceux calculés pour les documents (factures, devis, rapports).

describe("computeClientTaxes — moteur canonique", () => {
  it("TDL suit le barème canonique (régression de l'ancien barème)", () => {
    // IGS principal = 20 000 (CA classe 1). Ancien moteur (faux) : TDL = 5 000.
    // Barème canonique : 20 000 <= 30 000 -> TDL = 7 500.
    const r = computeClientTaxes({ regimefiscal: "igs", chiffreaffaires: 300_000 });
    expect(r.igs).toBe(20_000);
    expect(r.tdl).toBe(7_500);
  });

  it("TDL d'un gros IGS reste plafonné par le barème canonique", () => {
    // CA classe 10 -> IGS principal 2 000 000. Ancien moteur (faux) : 500 000.
    // Barème canonique : montant max = 90 000.
    const r = computeClientTaxes({ regimefiscal: "igs", chiffreaffaires: 30_000_000 });
    expect(r.igs).toBe(2_000_000);
    expect(r.tdl).toBe(90_000);
  });

  it("Solde IR : nul sous le seuil de 15 M (ancien moteur : plancher 500 000)", () => {
    const r = computeClientTaxes({ regimefiscal: "reel", chiffreaffaires: 10_000_000 });
    expect(r.soldeIR).toBe(0);
  });

  it("Solde IR : 0,1 % du CA au-delà de 15 M (ancien moteur : 2 %)", () => {
    const r = computeClientTaxes({ regimefiscal: "reel", chiffreaffaires: 20_000_000 });
    expect(r.soldeIR).toBe(20_000); // 0,1 % de 20 M, pas 400 000
  });

  it("Réduction CGA : l'IGS est réduit de 50 % mais la TDL reste sur le principal", () => {
    const r = computeClientTaxes({ regimefiscal: "igs", chiffreaffaires: 300_000, iscga: true });
    expect(r.igs).toBe(10_000); // 20 000 * 0,5
    expect(r.tdl).toBe(7_500); // TDL calculée sur le principal (20 000)
  });

  it("Immobilier (locataire, régime réel) : PSL et Bail à 10 % du loyer annuel", () => {
    const r = computeClientTaxes({
      regimefiscal: "reel",
      chiffreaffaires: 5_000_000,
      situationimmobiliere: { type: "locataire", loyer: 100_000 },
    });
    expect(r.loyerAnnuel).toBe(1_200_000);
    expect(r.psl).toBe(120_000);
    expect(r.bail).toBe(120_000);
    expect(r.tauxBail).toBe(10);
  });
});

describe("Cohérence fiche client ↔ documents", () => {
  it("computeClientTaxes produit le même résultat que le moteur des documents", () => {
    const inputs: ClientFiscalInput[] = [
      { type: "physique", regimefiscal: "igs", chiffreaffaires: 4_000_000, iscga: false },
      { type: "morale", regimefiscal: "reel", chiffreaffaires: 25_000_000, isvendeurboissons: true },
      {
        type: "morale",
        regimefiscal: "reel",
        chiffreaffaires: 18_000_000,
        situationimmobiliere: { type: "les_deux", loyer: 200_000, valeur: 50_000_000 },
      },
    ];

    for (const input of inputs) {
      const viaSummary = computeClientTaxes(input);
      const viaDocuments = computeAllTaxes(adaptClient({ id: 0, ...input }));
      expect(viaSummary).toEqual(viaDocuments);
    }
  });
});
