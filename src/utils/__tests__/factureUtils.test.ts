
import { describe, it, expect } from 'vitest';
import { 
  applySearchFilter, 
  applyStatusFilter, 
  applyClientFilter,
  applyDateFilter,
  sortFactures,
  getPaginatedFactures,
  calculateTotalPages
} from '@/utils/factureUtils';
import { Facture } from '@/types/facture';

// Mock data for testing
const mockFactures: Facture[] = [
  {
    id: 'F-2023-001',
    client_id: 'client1',
    client: {
      id: 'client1',
      nom: 'Entreprise ABC',
      adresse: 'Douala',
      telephone: '123456789',
      email: 'contact@abc.com'
    },
    date: '01/01/2023',
    echeance: '31/01/2023',
    montant: 100000,
    montant_paye: 0,
    status: 'en_attente',
    prestations: [
      { description: 'Service 1', montant: 100000, quantite: 1 }
    ]
  },
  {
    id: 'F-2023-002',
    client_id: 'client2',
    client: {
      id: 'client2',
      nom: 'John Doe',
      adresse: 'Yaoundé',
      telephone: '987654321',
      email: 'john@example.com'
    },
    date: '15/02/2023',
    echeance: '15/03/2023',
    montant: 50000,
    montant_paye: 50000,
    status: 'payée',
    prestations: [
      { description: 'Service 2', montant: 50000, quantite: 1 }
    ]
  },
  {
    id: 'F-2023-003',
    client_id: 'client1',
    client: {
      id: 'client1',
      nom: 'Entreprise ABC',
      adresse: 'Douala',
      telephone: '123456789',
      email: 'contact@abc.com'
    },
    date: '10/03/2023',
    echeance: '10/04/2023',
    montant: 75000,
    montant_paye: 25000,
    status: 'partiellement_payée',
    prestations: [
      { description: 'Service 3', montant: 75000, quantite: 1 }
    ]
  }
];

describe('factureUtils', () => {
  // Test search filter
  describe('applySearchFilter', () => {
    it('should return all factures when search term is empty', () => {
      const result = applySearchFilter(mockFactures, '');
      expect(result).toEqual(mockFactures);
    });

    it('should filter factures by client name', () => {
      const result = applySearchFilter(mockFactures, 'ABC');
      expect(result).toHaveLength(2);
      expect(result[0].client.nom).toContain('ABC');
      expect(result[1].client.nom).toContain('ABC');
    });

    it('should filter factures by invoice ID', () => {
      const result = applySearchFilter(mockFactures, 'F-2023-001');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('F-2023-001');
    });

    it('should be case insensitive', () => {
      const result = applySearchFilter(mockFactures, 'abc');
      expect(result).toHaveLength(2);
    });
  });

  // Test status filter
  describe('applyStatusFilter', () => {
    it('should return all factures when status filter is null', () => {
      const result = applyStatusFilter(mockFactures, null);
      expect(result).toEqual(mockFactures);
    });

    it('should filter factures by status', () => {
      const result = applyStatusFilter(mockFactures, 'payée');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('payée');
    });
  });

  // Test client filter
  describe('applyClientFilter', () => {
    it('should return all factures when client filter is null', () => {
      const result = applyClientFilter(mockFactures, null);
      expect(result).toEqual(mockFactures);
    });

    it('should filter factures by client ID', () => {
      const result = applyClientFilter(mockFactures, 'client1');
      expect(result).toHaveLength(2);
      expect(result[0].client_id).toBe('client1');
      expect(result[1].client_id).toBe('client1');
    });
  });

  // Test date filter
  describe('applyDateFilter', () => {
    it('should return all factures when date filter is null', () => {
      const result = applyDateFilter(mockFactures, null);
      expect(result).toEqual(mockFactures);
    });

    it('should filter factures by date', () => {
      const dateFilter = new Date('2023-01-01');
      const result = applyDateFilter(mockFactures, dateFilter);
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('01/01/2023');
    });
  });

  // Test sorting
  describe('sortFactures', () => {
    it('should sort factures by date ascending', () => {
      const result = sortFactures(mockFactures, 'date', 'asc');
      expect(result[0].date).toBe('01/01/2023');
      expect(result[1].date).toBe('15/02/2023');
      expect(result[2].date).toBe('10/03/2023');
    });

    it('should sort factures by date descending', () => {
      const result = sortFactures(mockFactures, 'date', 'desc');
      expect(result[0].date).toBe('10/03/2023');
      expect(result[1].date).toBe('15/02/2023');
      expect(result[2].date).toBe('01/01/2023');
    });

    it('should sort factures by montant ascending', () => {
      const result = sortFactures(mockFactures, 'montant', 'asc');
      expect(result[0].montant).toBe(50000);
      expect(result[1].montant).toBe(75000);
      expect(result[2].montant).toBe(100000);
    });

    it('should sort factures by montant descending', () => {
      const result = sortFactures(mockFactures, 'montant', 'desc');
      expect(result[0].montant).toBe(100000);
      expect(result[1].montant).toBe(75000);
      expect(result[2].montant).toBe(50000);
    });
  });

  // Test pagination
  describe('getPaginatedFactures', () => {
    it('should return first page with correct number of items', () => {
      const result = getPaginatedFactures(mockFactures, 1, 2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('F-2023-001');
      expect(result[1].id).toBe('F-2023-002');
    });

    it('should return second page with remaining items', () => {
      const result = getPaginatedFactures(mockFactures, 2, 2);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('F-2023-003');
    });

    it('should return empty array for page beyond total items', () => {
      const result = getPaginatedFactures(mockFactures, 3, 2);
      expect(result).toHaveLength(0);
    });
  });

  // Test total pages calculation
  describe('calculateTotalPages', () => {
    it('should calculate correct number of pages', () => {
      expect(calculateTotalPages(10, 3)).toBe(4);
      expect(calculateTotalPages(10, 5)).toBe(2);
      expect(calculateTotalPages(10, 10)).toBe(1);
      expect(calculateTotalPages(0, 5)).toBe(0);
    });
  });
});
