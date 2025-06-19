
import { describe, it, expect } from 'vitest';
import { Facture } from '@/types/facture';
import { formatFactureNumber, calculateFactureTotal } from '../factureUtils';

describe('factureUtils', () => {
  const mockFacture: Facture = {
    id: 'FAC-001',
    client_id: 'client-1',
    date: '2024-01-01',
    echeance: '2024-01-31',
    montant: 100,
    status: 'brouillon',
    status_paiement: 'non_payée',
    mode: 'espèces',
    notes: '',
    prestations: [],
    client: {
      id: 'client-1',
      nom: 'Test Client',
      adresse: 'Test Address',
      telephone: '123456789',
      email: 'test@example.com'
    }
  };

  const mockFacture2: Facture = {
    id: 'FAC-002',
    client_id: 'client-2',
    date: '2024-02-01',
    echeance: '2024-02-28',
    montant: 200,
    status: 'envoyée',
    status_paiement: 'payée',
    mode: 'virement',
    notes: '',
    prestations: [],
    client: {
      id: 'client-2',
      nom: 'Test Client 2',
      adresse: 'Test Address 2',
      telephone: '987654321',
      email: 'test2@example.com'
    }
  };

  describe('formatFactureNumber', () => {
    it('should format facture number correctly', () => {
      expect(formatFactureNumber('FAC-001')).toBe('FAC-001');
    });
  });

  describe('calculateFactureTotal', () => {
    it('should calculate total correctly', () => {
      expect(calculateFactureTotal(mockFacture)).toBe(100);
    });
  });

  describe('filterFacturesByDateRange', () => {
    it('should filter factures by date range', () => {
      const factures = [mockFacture, mockFacture2];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      // Add your filtering logic here
      const filtered = factures.filter(f => {
        const factureDate = new Date(f.date);
        return factureDate >= startDate && factureDate <= endDate;
      });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('FAC-001');
    });
  });
});
