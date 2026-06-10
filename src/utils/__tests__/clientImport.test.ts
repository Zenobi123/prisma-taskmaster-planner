import { describe, it, expect } from "vitest";
import {
  CSV_COLUMNS,
  normKey,
  canonicalize,
  buildClient,
  parseCSV,
  parseJSON,
  parseText,
  getFormat,
  parseByFormat,
  buildTemplate,
} from "../clientImport";

// Une ligne CSV valide complète, dans l'ordre des colonnes canoniques.
const VALID_CSV_ROW =
  "physique;Dupont Jean;;NIU001;CFLP DOUALA 1;reel;Douala;Akwa;+237600000000;jean@example.com;Dupont;Commerce;5000000";
const CSV_HEADER = CSV_COLUMNS.join(";");

describe("normKey", () => {
  it("rend la clé insensible à la casse, aux accents et aux séparateurs", () => {
    expect(normKey("Secteur d'activité")).toBe("secteurdactivite");
    expect(normKey("Contact_Principal")).toBe("contactprincipal");
    expect(normKey("CENTRE")).toBe("centre");
  });
});

describe("canonicalize", () => {
  it("mappe les libellés (accents/casse/alias) vers les clés canoniques", () => {
    const rec = canonicalize({
      Type: "physique",
      NIU: "X1",
      "Régime fiscal": "igs",
      Centre: "CFLP",
      Tel: "690",
      Secteur: "Commerce",
      CA: "1000",
      Inconnu: "ignoré",
    });
    expect(rec.type).toBe("physique");
    expect(rec.niu).toBe("X1");
    expect(rec.regimefiscal).toBe("igs");
    expect(rec.centrerattachement).toBe("CFLP");
    expect(rec.telephone).toBe("690");
    expect(rec.secteuractivite).toBe("Commerce");
    expect(rec.chiffreaffaires).toBe("1000");
    // Les clés inconnues sont ignorées
    expect(Object.values(rec)).not.toContain("ignoré");
  });

  it("convertit les valeurs nulles/numériques en chaînes vides ou texte", () => {
    const rec = canonicalize({ type: "morale", niu: null, chiffreaffaires: 42 });
    expect(rec.niu).toBe("");
    expect(rec.chiffreaffaires).toBe("42");
  });
});

describe("buildClient", () => {
  const base = {
    type: "physique",
    niu: "NIU001",
    regimefiscal: "reel",
    ville: "Douala",
  };

  it("construit un client valide avec les bons champs imbriqués", () => {
    const { client, error } = buildClient(
      { ...base, nom: "Jean", telephone: "690", email: "j@x.cm", chiffreaffaires: "5000" },
      "Ligne 2"
    );
    expect(error).toBeUndefined();
    expect(client).toMatchObject({
      type: "physique",
      nom: "Jean",
      niu: "NIU001",
      regimefiscal: "reel",
      adresse: { ville: "Douala", quartier: "", lieuDit: "" },
      contact: { telephone: "690", email: "j@x.cm" },
      chiffreaffaires: 5000,
      statut: "actif",
      gestionexternalisee: false,
    });
    expect(client?.interactions).toEqual([]);
  });

  it("accepte les libellés d'export (« Personne morale »)", () => {
    const { client, error } = buildClient(
      { type: "Personne morale", raisonsociale: "ACME", niu: "N2", regimefiscal: "igs" },
      "Élément 1"
    );
    expect(error).toBeUndefined();
    expect(client?.type).toBe("morale");
    expect(client?.raisonsociale).toBe("ACME");
    expect(client?.nom).toBeUndefined();
  });

  it("rejette un type invalide", () => {
    const { client, error } = buildClient({ ...base, type: "entreprise" }, "Ligne 2");
    expect(client).toBeUndefined();
    expect(error).toContain("type");
  });

  it("rejette un NIU manquant", () => {
    const { error } = buildClient({ ...base, niu: "" }, "Ligne 2");
    expect(error).toContain("NIU");
  });

  it("rejette un régime fiscal invalide", () => {
    const { error } = buildClient({ ...base, regimefiscal: "forfait" }, "Ligne 2");
    expect(error).toContain("régime fiscal");
  });

  it("rejette un chiffre d'affaires non numérique", () => {
    const { error } = buildClient({ ...base, chiffreaffaires: "abc" }, "Ligne 2");
    expect(error).toContain("chiffre d'affaires");
  });

  it("laisse le chiffre d'affaires indéfini s'il est vide", () => {
    const { client } = buildClient({ ...base, chiffreaffaires: "" }, "Ligne 2");
    expect(client?.chiffreaffaires).toBeUndefined();
  });
});

describe("parseCSV", () => {
  it("parse un CSV valide en ignorant l'en-tête", () => {
    const { clients, errors } = parseCSV(`${CSV_HEADER}\n${VALID_CSV_ROW}`);
    expect(errors).toHaveLength(0);
    expect(clients).toHaveLength(1);
    expect(clients[0]).toMatchObject({ type: "physique", niu: "NIU001", chiffreaffaires: 5000000 });
  });

  it("signale une erreur si le fichier ne contient pas de données", () => {
    const { clients, errors } = parseCSV(CSV_HEADER);
    expect(clients).toHaveLength(0);
    expect(errors[0]).toContain("au moins un en-tête");
  });

  it("signale les lignes ayant trop peu de colonnes", () => {
    const { clients, errors } = parseCSV(`${CSV_HEADER}\nphysique;Jean`);
    expect(clients).toHaveLength(0);
    expect(errors[0]).toContain("colonnes insuffisant");
  });

  it("collecte les valides et les erreurs sur un fichier mixte", () => {
    const badRow = "entreprise;X;;N2;CFLP;reel;Yaoundé;Centre;690;e@x.cm;C;Services;1000";
    const { clients, errors } = parseCSV(`${CSV_HEADER}\n${VALID_CSV_ROW}\n${badRow}`);
    expect(clients).toHaveLength(1);
    expect(errors).toHaveLength(1);
  });
});

describe("parseJSON", () => {
  it("parse un tableau d'objets valides", () => {
    const json = JSON.stringify([
      { type: "physique", nom: "Jean", niu: "N1", regimefiscal: "reel", ville: "Douala" },
      { type: "morale", raisonsociale: "ACME", niu: "N2", regimefiscal: "igs", ville: "Yaoundé" },
    ]);
    const { clients, errors } = parseJSON(json);
    expect(errors).toHaveLength(0);
    expect(clients).toHaveLength(2);
    expect(clients[1].raisonsociale).toBe("ACME");
  });

  it("accepte un objet unique (non encapsulé dans un tableau)", () => {
    const json = JSON.stringify({ type: "physique", niu: "N1", regimefiscal: "reel" });
    const { clients } = parseJSON(json);
    expect(clients).toHaveLength(1);
  });

  it("réimporte le JSON exporté (clés/valeurs en libellés)", () => {
    const exported = JSON.stringify([
      {
        Type: "Personne physique",
        Nom: "Jean",
        NIU: "N1",
        regimefiscal: "reel",
        Ville: "Douala",
        Telephone: "690",
      },
    ]);
    const { clients, errors } = parseJSON(exported);
    expect(errors).toHaveLength(0);
    expect(clients[0]).toMatchObject({ type: "physique", niu: "N1" });
  });

  it("renvoie une erreur sur un JSON mal formé", () => {
    const { clients, errors } = parseJSON("{ pas du json ");
    expect(clients).toHaveLength(0);
    expect(errors[0]).toContain("invalide");
  });

  it("signale un élément non-objet", () => {
    const { errors } = parseJSON(JSON.stringify(["chaine"]));
    expect(errors[0]).toContain("objet attendu");
  });
});

describe("parseText", () => {
  it("parse des blocs « champ: valeur » séparés par des tirets", () => {
    const text = [
      "type: physique",
      "nom: Jean",
      "niu: N1",
      "regimefiscal: reel",
      "ville: Douala",
      "----------------------------------------",
      "type: morale",
      "raisonsociale: ACME",
      "niu: N2",
      "regimefiscal: igs",
    ].join("\n");
    const { clients, errors } = parseText(text);
    expect(errors).toHaveLength(0);
    expect(clients).toHaveLength(2);
    expect(clients[0].nom).toBe("Jean");
    expect(clients[1].raisonsociale).toBe("ACME");
  });

  it("sépare aussi les blocs par une ligne vide", () => {
    const text = "type: physique\nniu: N1\nregimefiscal: reel\n\ntype: morale\nniu: N2\nregimefiscal: igs";
    const { clients } = parseText(text);
    expect(clients).toHaveLength(2);
  });

  it("gère les valeurs contenant un « : » (ex. horaires)", () => {
    const text = "type: physique\nniu: N1\nregimefiscal: reel\nsecteuractivite: Transport 8:00";
    const { clients } = parseText(text);
    expect(clients[0].secteuractivite).toBe("Transport 8:00");
  });

  it("propage les erreurs de validation par bloc", () => {
    const text = "type: physique\nregimefiscal: reel"; // NIU manquant
    const { clients, errors } = parseText(text);
    expect(clients).toHaveLength(0);
    expect(errors[0]).toContain("NIU");
  });
});

describe("getFormat / parseByFormat", () => {
  it("détecte le format selon l'extension", () => {
    expect(getFormat("clients.csv")).toBe("csv");
    expect(getFormat("CLIENTS.JSON")).toBe("json");
    expect(getFormat("export.txt")).toBe("txt");
    expect(getFormat("fichier.pdf")).toBeNull();
  });

  it("délègue au bon parseur", () => {
    const csv = parseByFormat("csv", `${CSV_HEADER}\n${VALID_CSV_ROW}`);
    expect(csv.clients).toHaveLength(1);
  });
});

describe("buildTemplate (round-trip)", () => {
  it("le modèle CSV se reparse sans erreur", () => {
    const { content, fileName, bom } = buildTemplate("csv");
    expect(fileName).toBe("modele_import_clients.csv");
    expect(bom).toBe(true);
    const { clients, errors } = parseCSV(content);
    expect(errors).toHaveLength(0);
    expect(clients).toHaveLength(2);
  });

  it("le modèle JSON se reparse sans erreur", () => {
    const { content } = buildTemplate("json");
    const { clients, errors } = parseJSON(content);
    expect(errors).toHaveLength(0);
    expect(clients).toHaveLength(2);
  });

  it("le modèle texte se reparse sans erreur", () => {
    const { content, fileName } = buildTemplate("txt");
    expect(fileName).toBe("modele_import_clients.txt");
    const { clients, errors } = parseText(content);
    expect(errors).toHaveLength(0);
    expect(clients).toHaveLength(2);
  });
});
