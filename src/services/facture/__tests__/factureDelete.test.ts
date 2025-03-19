
import { deleteFactureFromDB } from '../factureDelete';
import { 
  supabaseMock, 
  mockSupabaseDelete, 
  mockSupabaseEq, 
  mockSupabaseMaybeSingle,
  resetSupabaseMock 
} from '../../../tests/mocks/supabaseMock';

// Mock du module supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: supabaseMock,
}));

describe('factureDelete', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe('deleteFactureFromDB', () => {
    it('doit supprimer une facture existante', async () => {
      // ID de la facture à supprimer
      const factureId = 'F2023-001';
      
      // Configuration du mock pour la vérification d'existence
      mockSupabaseMaybeSingle.mockReturnValue({
        data: { id: factureId },
        error: null
      });
      
      // Configuration du mock pour la suppression
      mockSupabaseDelete.mockReturnValue({
        data: [{ id: factureId }],
        error: null,
        select: jest.fn().mockReturnValue({
          data: [{ id: factureId }],
          error: null
        })
      });

      // Exécution
      const result = await deleteFactureFromDB(factureId);

      // Vérifications
      expect(supabaseMock.from).toHaveBeenCalledWith('factures');
      expect(mockSupabaseEq).toHaveBeenCalledWith('id', factureId);
      expect(mockSupabaseDelete).toHaveBeenCalled();
      expect(result).toEqual([{ id: factureId }]);
    });

    it('doit lever une erreur si la facture n\'existe pas', async () => {
      // ID de la facture à supprimer
      const factureId = 'F2023-999';
      
      // Configuration du mock pour la vérification d'existence
      mockSupabaseMaybeSingle.mockReturnValue({
        data: null,
        error: null
      });

      // Vérifier que l'erreur est bien propagée
      await expect(deleteFactureFromDB(factureId)).rejects.toThrow(`Facture ${factureId} not found`);
    });

    it('doit gérer les erreurs lors de la suppression', async () => {
      // ID de la facture à supprimer
      const factureId = 'F2023-001';
      
      // Configuration du mock pour la vérification d'existence
      mockSupabaseMaybeSingle.mockReturnValue({
        data: { id: factureId },
        error: null
      });
      
      // Configuration du mock pour simuler une erreur lors de la suppression
      mockSupabaseDelete.mockReturnValue({
        data: null,
        error: new Error('Erreur lors de la suppression'),
        select: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Erreur lors de la suppression')
        })
      });

      // Vérifier que l'erreur est bien propagée
      await expect(deleteFactureFromDB(factureId)).rejects.toThrow();
    });
  });
});
