// Interopérabilité sauvegardes vanilla ↔ Prisma : tests des mappers purs.
import { describe, it, expect } from 'vitest';
import {
  parseVanillaBackup,
  vanillaClientToClientPayload,
  clientToVanillaClient,
  vanillaFactureToInsert,
  factureToVanillaFacture,
  vanillaRecuToPaiementInsert,
  paiementToVanillaRecu,
  vanillaDevisToInsert,
  vanillaPropositionToInsert,
  buildVanillaBackup,
  vanillaBackupFilename,
  type VanillaClient,
  type VanillaFacture,
} from '../vanillaBackup';
import type { Client } from '@/types/client';
import type { Facture } from '@/types/facture';
import type { Paiement } from '@/types/paiement';

const vanillaClient: VanillaClient = {
  id: 1718000000000,
  createdAt: '2026-01-15T12:00:00.000Z',
  type: 'Personne morale',
  name: 'ETS LA RÉFÉRENCE',
  niu: 'M052116042979Z',
  cdi: 'CIME YAOUNDÉ EST',
  ville: 'Yaoundé',
  quartier: 'Bastos',
  phone: '690112233',
  email: 'contact@reference.cm',
  contact: 'M. ESSOMBA Jean',
  civilite: 'M.',
  secteur: 'Commerce',
  externalise: 'Oui',
  statut: 'Actif',
  regimeFiscal: 'IGS',
  chiffreAffaires: 12_000_000,
  isCGA: true,
  statutImmo: 'Les deux',
  loyerMensuel: 150_000,
  loyerAnnuel: 1_800_000,
  valeurBien: 25_000_000,
  modePaiementIGS: 'trimestriel',
};

describe('parseVanillaBackup', () => {
  it('accepte la sauvegarde complète PrismaAutoBackup v2.0', () => {
    const text = JSON.stringify({
      version: '2.0',
      application: 'PRISMA GESTION',
      clients: [vanillaClient],
      factures: [],
    });
    const backup = parseVanillaBackup(text);
    expect(backup.clients).toHaveLength(1);
    expect(backup.version).toBe('2.0');
  });

  it('accepte un tableau brut de clients', () => {
    const backup = parseVanillaBackup(JSON.stringify([vanillaClient]));
    expect(backup.clients).toHaveLength(1);
  });

  it('rejette le JSON invalide et les formats inconnus', () => {
    expect(() => parseVanillaBackup('pas du json')).toThrow('Fichier JSON invalide.');
    expect(() => parseVanillaBackup('{"foo": 1}')).toThrow(/Sauvegarde non reconnue/);
    expect(() => parseVanillaBackup('[{"foo": 1}]')).toThrow(/liste de clients/);
  });
});

describe('Client : vanilla → Prisma → vanilla', () => {
  it('mappe type, régime, adresse, contact, externalisation', () => {
    const payload = vanillaClientToClientPayload(vanillaClient);
    expect(payload.type).toBe('morale');
    expect(payload.raisonsociale).toBe('ETS LA RÉFÉRENCE');
    expect(payload.regimefiscal).toBe('igs');
    expect(payload.niu).toBe('M052116042979Z');
    expect(payload.centrerattachement).toBe('CIME YAOUNDÉ EST');
    expect(payload.adresse).toEqual({ ville: 'Yaoundé', quartier: 'Bastos', lieuDit: '' });
    expect(payload.contact.telephone).toBe('690112233');
    expect(payload.contact.contact_principal).toBe('M. ESSOMBA Jean');
    expect(payload.gestionexternalisee).toBe(true);
    expect(payload.statut).toBe('actif');
    expect(payload.iscga).toBe(true);
    expect(payload.modepaiementigs).toBe('trimestriel');
    expect(payload.situationimmobiliere).toEqual({ type: 'les_deux', valeur: 25_000_000, loyer: 150_000 });
  });

  it('round-trip : les champs métier clés sont conservés', () => {
    const payload = vanillaClientToClientPayload(vanillaClient);
    const client: Client = { ...payload, id: 'uuid-1', created_at: '2026-02-01T00:00:00Z' } as Client;
    const back = clientToVanillaClient(client, 42);
    expect(back.id).toBe(42);
    expect(back.name).toBe('ETS LA RÉFÉRENCE');
    expect(back.type).toBe('Personne morale');
    expect(back.regimeFiscal).toBe('IGS');
    expect(back.niu).toBe('M052116042979Z');
    expect(back.ville).toBe('Yaoundé');
    expect(back.externalise).toBe('Oui');
    expect(back.statutImmo).toBe('Les deux');
    expect(back.loyerAnnuel).toBe(1_800_000);
    expect(back.modePaiementIGS).toBe('trimestriel');
  });
});

describe('Facture : vanilla → Prisma → vanilla', () => {
  const vanillaFacture: VanillaFacture = {
    id: 1718000001000,
    number: 'N° 0012/2026/06',
    client: 'ETS LA RÉFÉRENCE',
    clientData: vanillaClient,
    prestations: [
      { type: 'Impôt', designation: 'IGS - Classe 8', qty: 1, price: 250000, total: 250000 },
      { type: 'Honoraire', designation: 'Tenue de comptabilité mensuelle', qty: 2, price: 50000, total: 100000 },
    ],
    total: 350000,
    totalImpots: 250000,
    totalHonoraires: 100000,
    date: '2026-06-10T12:00:00.000Z',
    status: 'partiellement_payée',
  };

  it("l'import préserve le numéro (= id Supabase), les prestations et le statut", () => {
    const { facture, prestations } = vanillaFactureToInsert(vanillaFacture, 'client-uuid');
    expect(facture.id).toBe('N° 0012/2026/06');
    expect(facture.client_id).toBe('client-uuid');
    expect(facture.date).toBe('2026-06-10');
    expect(facture.echeance).toBe('2026-07-10'); // +30 jours
    expect(facture.montant).toBe(350000);
    expect(facture.status).toBe('envoyée');
    expect(facture.status_paiement).toBe('partiellement_payée');
    expect(prestations).toEqual([
      { description: 'IGS - Classe 8', type: 'impot', quantite: 1, prix_unitaire: 250000, montant: 250000 },
      { description: 'Tenue de comptabilité mensuelle', type: 'honoraire', quantite: 2, prix_unitaire: 50000, montant: 100000 },
    ]);
  });

  it('statuts : émise / payée / annulée', () => {
    expect(vanillaFactureToInsert({ ...vanillaFacture, status: 'émise' }, 'c').facture).toMatchObject({
      status: 'envoyée',
      status_paiement: 'non_payée',
    });
    expect(vanillaFactureToInsert({ ...vanillaFacture, status: 'payée' }, 'c').facture).toMatchObject({
      status: 'envoyée',
      status_paiement: 'payée',
    });
    expect(vanillaFactureToInsert({ ...vanillaFacture, status: 'annulée' }, 'c').facture).toMatchObject({
      status: 'annulée',
    });
  });

  it("l'export restitue le format vanilla (statut, prestations qty/price, date ISO midi)", () => {
    const facture: Facture = {
      id: 'N° 0012/2026/06',
      numero: 'N° 0012/2026/06',
      client_id: 'uuid-1',
      date: '2026-06-10',
      echeance: '2026-07-10',
      montant: 350000,
      montant_impots: 250000,
      montant_honoraires: 100000,
      status: 'envoyée',
      status_paiement: 'partiellement_payée',
      prestations: [
        { description: 'IGS - Classe 8', type: 'impot', quantite: 1, prix_unitaire: 250000, montant: 250000 },
      ],
    };
    const vc = clientToVanillaClient(
      { ...vanillaClientToClientPayload(vanillaClient), id: 'uuid-1' } as Client,
      7,
    );
    const back = factureToVanillaFacture(facture, vc, 99);
    expect(back.number).toBe('N° 0012/2026/06');
    expect(back.client).toBe('ETS LA RÉFÉRENCE');
    expect(back.status).toBe('partiellement_payée');
    expect(back.prestations?.[0]).toEqual({
      type: 'Impôt',
      designation: 'IGS - Classe 8',
      qty: 1,
      price: 250000,
      total: 250000,
    });
    expect(back.date).toBe(new Date('2026-06-10T12:00:00').toISOString());
    expect(back.clientData?.name).toBe('ETS LA RÉFÉRENCE');
  });
});

describe('Reçu ↔ paiement : modes et références', () => {
  it("l'import mappe les modes vanilla vers les modes Prisma", () => {
    const base = { number: 'RECU-0001/2026', client: 'X', montant: 1000, date: '2026-06-10T12:00:00Z' };
    expect(vanillaRecuToPaiementInsert({ ...base, paymentMode: 'Espèces' }, 'c', 'N° 1').mode).toBe('espèces');
    expect(vanillaRecuToPaiementInsert({ ...base, paymentMode: 'Virement bancaire' }, 'c', null).mode).toBe('virement');
    expect(vanillaRecuToPaiementInsert({ ...base, paymentMode: 'Mobile Money' }, 'c', null).mode).toBe('orange_money');
    expect(vanillaRecuToPaiementInsert({ ...base, paymentMode: 'Chèque' }, 'c', null).mode).toBe('cheque');
  });

  it('sans facture rattachée, le paiement devient un crédit ; la référence est conservée', () => {
    const row = vanillaRecuToPaiementInsert(
      { number: 'RECU-0002/2026', montant: 5000, motif: 'Avance', date: '2026-06-10T12:00:00Z' },
      'client-uuid',
      null,
    );
    expect(row.est_credit).toBe(true);
    expect(row.facture_id).toBeNull();
    expect(row.reference).toBe('RECU-0002/2026');
    expect(row.notes).toBe('Avance');
  });

  it("l'export restitue le paymentMode vanilla (round-trip Mobile Money)", () => {
    const p = {
      id: 'p1',
      reference: 'RECU-0003/2026',
      montant: 25000,
      mode: 'orange_money',
      date: '2026-06-10',
      notes: undefined,
    } as unknown as Paiement;
    const recu = paiementToVanillaRecu(p, 'ETS LA RÉFÉRENCE', 5, {
      montantImpots: 10000,
      montantHonoraires: 15000,
      factureNumericId: 99,
      factureNumber: 'N° 0012/2026/06',
    });
    expect(recu.paymentMode).toBe('Mobile Money');
    expect(recu.number).toBe('RECU-0003/2026');
    expect(recu.montantImpots).toBe(10000);
    expect(recu.motif).toBe('Règlement facture N° 0012/2026/06');
    expect(recu.factureIds).toEqual([99]);
    expect(recu.factureNumbers).toEqual(['N° 0012/2026/06']);
  });
});

describe('Devis et propositions', () => {
  it('devis : statut accentué normalisé + validité 30 jours', () => {
    const { devis, prestations } = vanillaDevisToInsert(
      {
        number: 'DEVIS-0001/2026/06',
        client: 'X',
        date: '2026-06-10T12:00:00Z',
        status: 'envoyé',
        prestations: [{ type: 'Honoraire', designation: 'Mission', qty: 1, price: 200000, total: 200000 }],
        total: 200000,
      },
      'client-uuid',
      'DEV-test',
    );
    expect(devis.numero).toBe('DEVIS-0001/2026/06');
    expect(devis.status).toBe('envoye');
    expect(devis.date).toBe('2026-06-10');
    expect(devis.date_validite).toBe('2026-07-10');
    expect(prestations[0]).toMatchObject({ type: 'honoraire', quantite: 1, prix_unitaire: 200000 });
  });

  it('proposition : lignes base/fraction/amount → base_annuelle/fraction/montant', () => {
    const row = vanillaPropositionToInsert(
      {
        id: 1718000002000,
        client: 'X',
        date: '2026-06-10T12:00:00Z',
        lignes: [{ type: 'Impôt', designation: 'IGS', base: 500000, fraction: 25, amount: 125000 }],
        total: 125000,
        note: 'T1',
      },
      'client-uuid',
      'PROP-test',
      'PROP-IMP-1718000002000',
    );
    expect(row.numero).toBe('PROP-IMP-1718000002000');
    expect(row.lignes[0]).toEqual({
      type: 'impot',
      designation: 'IGS',
      base_annuelle: 500000,
      fraction: 25,
      montant: 125000,
    });
    expect(row.total_impots).toBe(125000);
    expect(row.notes).toBe('T1');
  });
});

describe('Sauvegarde complète', () => {
  it('buildVanillaBackup produit le format PrismaAutoBackup v2.0', () => {
    const backup = buildVanillaBackup({ clients: [vanillaClient], factures: [], recus: [] });
    expect(backup.version).toBe('2.0');
    expect(backup.application).toBe('PRISMA GESTION');
    expect(backup.exportDate).toBeTruthy();
    expect(backup.clients).toHaveLength(1);
    // Les clés vides ne sont pas émises (comme performBackup vanilla).
    expect(backup.factures).toBeUndefined();
  });

  it('le nom de fichier suit le format vanilla', () => {
    const name = vanillaBackupFilename(new Date('2026-06-11T08:05:00'));
    expect(name).toBe('prisma-gestion-backup-2026-06-11_0805.json');
  });
});
