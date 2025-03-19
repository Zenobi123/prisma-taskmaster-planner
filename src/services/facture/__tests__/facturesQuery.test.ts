
import { fetchFacturesFromDB, mapFacturesFromDB } from '../facturesQuery';
import { supabaseMock, mockSupabaseSelect, resetSupabaseMock } from '../../../tests/mocks/supabaseMock';

// Mock du module supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: supabaseMock,
}));

describe('facturesQuery', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe('fetchFacturesFromDB', () => {
    it('doit récupérer les factures et les mapper', async () => {
      // Configuration du mock
      mockSupabaseSelect.mockReturnValue({
        data: [
          {
            id: 'F2023-001',
            client_id: 'client-1',
            client_nom: 'Client Test',
            client_adresse: 'Adresse Test',
            client_telephone: '123456789',
            client_email: 'test@example.com',
            date: '2023-01-01',
            echeance: '2023-01-31',
            montant: 1000,
            status: 'en_attente',
            prestations: JSON.stringify([{ description: 'Prestation 1', montant: 1000 }]),
            notes: 'Test note',
            mode_reglement: 'comptant',
            moyen_paiement: 'especes'
          }
        ],
        error: null
      });

      // Exécution
      const result = await fetchFacturesFromDB();

      // Vérifications
      expect(supabaseMock.from).toHaveBeenCalledWith('factures');
      expect(mockSupabaseSelect).toHaveBeenCalledWith('*');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('F2023-001');
      expect(result[0].client.nom).toBe('Client Test');
    });

    it('doit gérer les erreurs', async () => {
      // Configuration du mock pour simuler une erreur
      mockSupabaseSelect.mockReturnValue({
        data: null,
        error: new Error('Erreur de base de données')
      });

      // Vérifier que l'erreur est bien propagée
      await expect(fetchFacturesFromDB()).rejects.toThrow();
    });
  });

  describe('mapFacturesFromDB', () => {
    it('doit mapper les données brutes en objets Facture', () => {
      const rawData = [
        {
          id: 'F2023-001',
          client_id: 'client-1',
          client_nom: 'Client Test',
          client_adresse: 'Adresse Test',
          client_telephone: '123456789',
          client_email: 'test@example.com',
          date: '2023-01-01',
          echeance: '2023-01-31',
          montant: 1000,
          status: 'en_attente',
          prestations: JSON.stringify([{ description: 'Prestation 1', montant: 1000 }]),
          notes: 'Test note',
          mode_reglement: 'comptant',
          moyen_paiement: 'especes'
        }
      ];

      const result = mapFacturesFromDB(rawData);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('F2023-001');
      expect(result[0].client.nom).toBe('Client Test');
      expect(result[0].prestations).toEqual([{ description: 'Prestation 1', montant: 1000 }]);
    });

    it('doit gérer les prestations déjà sous forme de tableau', () => {
      const rawData = [
        {
          id: 'F2023-001',
          client_id: 'client-1',
          client_nom: 'Client Test',
          client_adresse: 'Adresse Test',
          client_telephone: '123456789',
          client_email: 'test@example.com',
          date: '2023-01-01',
          echeance: '2023-01-31',
          montant: 1000,
          status: 'en_attente',
          prestations: [{ description: 'Prestation 1', montant: 1000 }],
          notes: 'Test note',
          mode_reglement: 'comptant',
          moyen_paiement: 'especes'
        }
      ];

      const result = mapFacturesFromDB(rawData);

      expect(result[0].prestations).toEqual([{ description: 'Prestation 1', montant: 1000 }]);
    });
  });
});
