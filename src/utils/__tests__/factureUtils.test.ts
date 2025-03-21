
import { describe, it, expect } from 'vitest';
import {
  applySearchFilter,
  applyStatusFilter,
  applyClientFilter,
  applyDateFilter,
  sortFactures,
  getPaginatedFactures,
  calculateTotalPages
} from '../factureUtils';
import { Facture } from '@/types/facture';

// Sample facture data for testing
const sampleFactures: Facture[] = [
  {
    id: 'F-2023-001',
    client_id: 'client1',
    client: {
      id: 'client1',
      nom: 'Client One',
      adresse: 'City A',
      telephone: '123456789',
      email: 'client1@example.com'
    },
    date: '01/01/2023',
    echeance: '01/02/2023',
    montant: 1000,
    montant_paye: 0,
    status: 'brouillon',
    status_paiement: 'non_payée',
    mode_paiement: 'espèces',
    prestations: [],
    paiements: []
  },
  {
    id: 'F-2023-002',
    client_id: 'client2',
    client: {
      id: 'client2',
      nom: 'Client Two',
      adresse: 'City B',
      telephone: '987654321',
      email: 'client2@example.com'
    },
    date: '15/01/2023',
    echeance: '15/02/2023',
    montant: 2000,
    montant_paye: 2000,
    status: 'envoyée',
    status_paiement: 'payée',
    mode_paiement: 'virement',
    prestations: [],
    paiements: []
  }
];

// Tests
describe('factureUtils', () => {
  describe('applySearchFilter', () => {
    it('should filter factures by client name', () => {
      const result = applySearchFilter(sampleFactures, 'One');
      expect(result).toHaveLength(1);
      expect(result[0].client.nom).toBe('Client One');
    });

    it('should filter factures by facture ID', () => {
      const result = applySearchFilter(sampleFactures, 'F-2023-002');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('F-2023-002');
    });

    it('should return all factures when search term is empty', () => {
      const result = applySearchFilter(sampleFactures, '');
      expect(result).toHaveLength(2);
    });
  });

  describe('applyStatusFilter', () => {
    it('should filter factures by status', () => {
      const result = applyStatusFilter(sampleFactures, 'envoyée');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('envoyée');
    });

    it('should return all factures when status filter is null', () => {
      const result = applyStatusFilter(sampleFactures, null);
      expect(result).toHaveLength(2);
    });
  });

  describe('applyClientFilter', () => {
    it('should filter factures by client ID', () => {
      const result = applyClientFilter(sampleFactures, 'client1');
      expect(result).toHaveLength(1);
      expect(result[0].client_id).toBe('client1');
    });

    it('should return all factures when client filter is null', () => {
      const result = applyClientFilter(sampleFactures, null);
      expect(result).toHaveLength(2);
    });
  });

  describe('applyDateFilter', () => {
    it('should filter factures by date', () => {
      const dateFilter = new Date('2023-01-15');
      const result = applyDateFilter(sampleFactures, dateFilter);
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('15/01/2023');
    });

    it('should return all factures when date filter is null', () => {
      const result = applyDateFilter(sampleFactures, null);
      expect(result).toHaveLength(2);
    });
  });

  describe('sortFactures', () => {
    it('should sort factures by date ascending', () => {
      const result = sortFactures(sampleFactures, 'date', 'asc');
      expect(result[0].date).toBe('01/01/2023');
      expect(result[1].date).toBe('15/01/2023');
    });

    it('should sort factures by date descending', () => {
      const result = sortFactures(sampleFactures, 'date', 'desc');
      expect(result[0].date).toBe('15/01/2023');
      expect(result[1].date).toBe('01/01/2023');
    });

    it('should sort factures by montant ascending', () => {
      const result = sortFactures(sampleFactures, 'montant', 'asc');
      expect(result[0].montant).toBe(1000);
      expect(result[1].montant).toBe(2000);
    });

    it('should sort factures by montant descending', () => {
      const result = sortFactures(sampleFactures, 'montant', 'desc');
      expect(result[0].montant).toBe(2000);
      expect(result[1].montant).toBe(1000);
    });
  });

  describe('getPaginatedFactures', () => {
    it('should return the correct page of factures', () => {
      const result = getPaginatedFactures(sampleFactures, 1, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('F-2023-001');
    });

    it('should return the second page of factures', () => {
      const result = getPaginatedFactures(sampleFactures, 2, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('F-2023-002');
    });

    it('should return all factures when page size is larger than total', () => {
      const result = getPaginatedFactures(sampleFactures, 1, 5);
      expect(result).toHaveLength(2);
    });
  });

  describe('calculateTotalPages', () => {
    it('should calculate total pages correctly', () => {
      expect(calculateTotalPages(5, 2)).toBe(3);
      expect(calculateTotalPages(6, 3)).toBe(2);
      expect(calculateTotalPages(0, 2)).toBe(0);
    });
  });
});
