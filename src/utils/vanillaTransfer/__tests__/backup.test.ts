import { describe, expect, it } from "vitest";
import { buildVanillaBackup, parseVanillaTransferFile } from "../backup";
import { buildVanillaEnvelope } from "../envelope";

const client = { id: 1, name: "CABINET TEST", niu: "M123" };

describe("sauvegarde globale vanilla", () => {
  it("convertit une sauvegarde PRISMA GESTION en enveloppe avec historique", () => {
    const parsed = parseVanillaTransferFile(JSON.stringify({
      application: "PRISMA GESTION",
      version: "2.0",
      exportDate: "2026-06-12T00:00:00.000Z",
      clients: [client],
      factures: [{ number: "F-1", client: "CABINET TEST" }],
      missions: [{ id: 3 }],
    }));

    expect(parsed.source).toBe("backup");
    expect(parsed.envelope?.clients).toEqual([client]);
    expect(parsed.envelope?.historique?.factures).toHaveLength(1);
    expect(parsed.ignoredCollections).toEqual([{ key: "missions", count: 1 }]);
  });

  it("accepte également un export PRISMA-CLIENTS", () => {
    const envelope = buildVanillaEnvelope([client], { devis: [] });
    const parsed = parseVanillaTransferFile(JSON.stringify(envelope));

    expect(parsed.source).toBe("clients");
    expect(parsed.envelope).toEqual(envelope);
  });

  it("produit une sauvegarde globale restaurable par l'application vanilla", () => {
    const backup = buildVanillaBackup(buildVanillaEnvelope([client], {
      recus: [{ number: "RECU-1", client: "CABINET TEST" }],
    }));

    expect(backup.application).toBe("PRISMA GESTION");
    expect(backup.clients).toEqual([client]);
    expect(backup.recus).toHaveLength(1);
    expect(parseVanillaTransferFile(JSON.stringify(backup)).envelope?.historique?.recus).toHaveLength(1);
  });

  it("rejette les fichiers non reconnus", () => {
    expect(parseVanillaTransferFile("not json").error).toMatch(/invalide/);
    expect(parseVanillaTransferFile(JSON.stringify({ clients: [client] })).error).toMatch(/ni une sauvegarde/);
  });
});
