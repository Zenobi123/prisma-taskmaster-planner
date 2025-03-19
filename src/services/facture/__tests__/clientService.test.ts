
import { getClientData } from '../clientService';
import { 
  supabaseMock, 
  mockSupabaseSelect, 
  mockSupabaseEq, 
  mockSupabaseSingle,
  resetSupabaseMock 
} from '../../../tests/mocks/supabaseMock';

// Mock du module supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: supabaseMock,
}));

describe('clientService', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe('getClientData', () => {
    it('doit récupérer les données d\'un client existant', async () => {
      // Données de test
      const clientId = 'client-1';
      const clientData = {
        id: clientId,
        nom: 'Client Test',
        adresse: {
          ville: 'Ville Test'
        },
        contact: {
          telephone: '123456789',
          email: 'test@example.com'
        }
      };
      
      // Configuration du mock
      mockSupabaseSingle.mockReturnValue({
        data: clientData,
        error: null
      });

      // Exécution
      const result = await getClientData(clientId);

      // Vérifications
      expect(supabaseMock.from).toHaveBeenCalledWith('clients');
      expect(mockSupabaseSelect).toHaveBeenCalledWith('*');
      expect(mockSupabaseEq).toHaveBeenCalledWith('id', clientId);
      expect(result).toEqual(clientData);
    });

    it('doit gérer les erreurs lorsque le client n\'existe pas', async () => {
      // Données de test
      const clientId = 'client-999';
      
      // Configuration du mock pour simuler une erreur
      mockSupabaseSingle.mockReturnValue({
        data: null,
        error: new Error('Client non trouvé')
      });

      // Vérifier que l'erreur est bien propagée
      await expect(getClientData(clientId)).rejects.toThrow();
    });
  });
});
