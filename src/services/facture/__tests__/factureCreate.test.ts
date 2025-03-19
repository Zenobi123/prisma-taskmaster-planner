
import { createFactureInDB } from '../factureCreate';
import { supabaseMock, mockSupabaseInsert, resetSupabaseMock } from '../../../tests/mocks/supabaseMock';

// Mock du module supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: supabaseMock,
}));

describe('factureCreate', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe('createFactureInDB', () => {
    it('doit créer une facture dans la base de données', async () => {
      // Données de test
      const newFacture = {
        id: 'F2023-001',
        client_id: 'client-1',
        client_nom: 'Client Test',
        montant: 1000
      };

      // Configuration du mock
      mockSupabaseInsert.mockReturnValue({
        data: [newFacture],
        error: null,
        select: jest.fn().mockReturnValue({
          data: [newFacture],
          error: null
        })
      });

      // Exécution
      const result = await createFactureInDB(newFacture);

      // Vérifications
      expect(supabaseMock.from).toHaveBeenCalledWith('factures');
      expect(mockSupabaseInsert).toHaveBeenCalledWith(newFacture);
      expect(result).toEqual([newFacture]);
    });

    it('doit gérer les erreurs lors de la création', async () => {
      // Données de test
      const newFacture = {
        id: 'F2023-001',
        client_id: 'client-1',
        client_nom: 'Client Test',
        montant: 1000
      };

      // Configuration du mock pour simuler une erreur
      mockSupabaseInsert.mockReturnValue({
        data: null,
        error: new Error('Erreur lors de la création'),
        select: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Erreur lors de la création')
        })
      });

      // Vérifier que l'erreur est bien propagée
      await expect(createFactureInDB(newFacture)).rejects.toThrow();
    });
  });
});
