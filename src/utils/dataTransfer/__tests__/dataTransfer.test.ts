import { describe, it, expect } from "vitest";
import { parseImportContent } from "../dataImport";
import { parseDateInput } from "../parseDateInput";

describe("parseImportContent", () => {
  it("parse un CSV avec séparateur ; et en-têtes en minuscules", () => {
    const csv = ["nom;prenom;email", "Dupont;Jean;jean@example.com"].join("\n");
    const rows = parseImportContent(csv, "csv");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean@example.com",
    });
  });

  it("gère les cellules entre guillemets contenant le séparateur", () => {
    const csv = ['titre;notes', '"Mission A";"Note; avec point-virgule"'].join("\n");
    const rows = parseImportContent(csv, "csv");
    expect(rows[0].notes).toBe("Note; avec point-virgule");
  });

  it("retire l'apostrophe de protection anti-injection", () => {
    const csv = ['valeur', "\"'=SOMME(A1)\""].join("\n");
    const rows = parseImportContent(csv, "csv");
    expect(rows[0].valeur).toBe("=SOMME(A1)");
  });

  it("parse un fichier TXT tabulé", () => {
    const txt = ["nom\tprenom", "Dupont\tJean"].join("\n");
    const rows = parseImportContent(txt, "txt");
    expect(rows[0]).toMatchObject({ nom: "Dupont", prenom: "Jean" });
  });

  it("parse un JSON tableau d'objets", () => {
    const json = JSON.stringify([{ Nom: "Dupont", Email: "a@b.cm" }]);
    const rows = parseImportContent(json, "json");
    expect(rows[0]).toMatchObject({ nom: "Dupont", email: "a@b.cm" });
  });

  it("lève une erreur lisible pour un JSON invalide", () => {
    expect(() => parseImportContent("{not json", "json")).toThrow(/JSON/);
  });

  it("détecte automatiquement le séparateur virgule", () => {
    const csv = ["nom,email", "Dupont,jean@x.cm"].join("\n");
    const rows = parseImportContent(csv, "csv");
    expect(rows[0]).toMatchObject({ nom: "Dupont", email: "jean@x.cm" });
  });
});

describe("parseDateInput", () => {
  it("convertit YYYY-MM-DD en ISO ancré à midi", () => {
    expect(parseDateInput("2024-06-10")).toBe(
      new Date("2024-06-10T12:00:00").toISOString()
    );
  });

  it("convertit DD/MM/YYYY", () => {
    expect(parseDateInput("10/06/2024")).toBe(
      new Date("2024-06-10T12:00:00").toISOString()
    );
  });

  it("renvoie undefined pour une valeur vide ou invalide", () => {
    expect(parseDateInput("")).toBeUndefined();
    expect(parseDateInput("pas une date")).toBeUndefined();
  });
});
