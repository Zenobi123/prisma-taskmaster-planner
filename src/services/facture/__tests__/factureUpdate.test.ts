
import { updateFactureStatus, enregistrerPaiementPartiel } from '../factureUpdate';
import { 
  supabaseMock, 
  mockSupabaseUpdate, 
  mockSupabaseEq, 
  mockSupabaseSelect,
  mockSupabaseSingle,
  resetSupabaseMock 
} from '../../../tests/mocks/supabaseMock';

// Mock du module supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: supabaseMock,
}));

describe('factureUpdate', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe('updateFactureStatus', () => {
    it('doit mettre à jour le statut d\'une facture', async () => {
      // Données de test
      const factureId = 'F2023-001';
      const newStatus = 'payée';
      
      // Configuration du mock
      mockSupabaseUpdate.mockReturnValue({
        data: { id: factureId, status: newStatus },
        error: null
      });

      // Exécution
      await updateFactureStatus(factureId, newStatus);

      // Vérifications
      expect(supabaseMock.from).toHaveBeenCalledWith('factures');
      expect(mockSupabaseUpdate).toHaveBeenCalledWith({ status: newStatus });
      expect(mockSupabaseEq).toHaveBeenCalledWith('id', factureId);
    });

    it('doit gérer les erreurs lors de la mise à jour du statut', async () => {
      // Données de test
      const factureId = 'F2023-001';
      const newStatus = 'payée';
      
      // Configuration du mock pour simuler une erreur
      mockSupabaseUpdate.mockReturnValue({
        data: null,
        error: new Error('Erreur lors de la mise à jour')
      });

      // Vérifier que l'erreur est bien propagée
      await expect(updateFactureStatus(factureId, newStatus)).rejects.toThrow();
    });
  });

  describe('enregistrerPaiementPartiel', () => {
    it('doit enregistrer un paiement partiel pour une facture', async () => {
      // Données de test
      const factureId = 'F2023-001';
      const paiement = {
        id: 'P1',
        date: '2023-02-01',
        montant: 500,
        moyenPaiement: 'especes' as 'especes' | 'orange_money' | 'mtn_mobile' | 'virement',
        prestationIds: ['prestation-1']
      };
      const prestationsPayees = ['prestation-1'];
      const nouveauMontantPaye = 500;
      
      // Configuration du mock pour la récupération de la facture
      mockSupabaseSingle.mockReturnValue({
        data: {
          montant: 1000,
          paiements: [],
          montant_paye: 0
        },
        error: null
      });
      
      // Configuration du mock pour la mise à jour
      mockSupabaseUpdate.mockReturnValue({
        data: { id: factureId },
        error: null
      });

      // Exécution
      await enregistrerPaiementPartiel(factureId, paiement, prestationsPayees, nouveauMontantPaye);

      // Vérifications
      expect(supabaseMock.from).toHaveBeenCalledWith('factures');
      expect(mockSupabaseSelect).toHaveBeenCalledWith('paiements, montant, montant_paye');
      expect(mockSupabaseEq).toHaveBeenCalledWith('id', factureId);
      expect(mockSupabaseUpdate).toHaveBeenCalledWith(expect.objectContaining({
        paiements: [expect.objectContaining({ id: 'P1' })],
        montant_paye: 500,
        status: 'partiellement_payée'
      }));
    });

    it('doit gérer les erreurs lors de la récupération de la facture', async () => {
      // Données de test
      const factureId = 'F2023-001';
      const paiement = {
        id: 'P1',
        date: '2023-02-01',
        montant: 500,
        moyenPaiement: 'especes' as 'especes' | 'orange_money' | 'mtn_mobile' | 'virement',
        prestationIds: ['prestation-1']
      };
      const prestationsPayees = ['prestation-1'];
      const nouveauMontantPaye = 500;
      
      // Configuration du mock pour simuler une erreur lors de la récupération
      mockSupabaseSingle.mockReturnValue({
        data: null,
        error: new Error('Erreur lors de la récupération')
      });

      // Vérifier que l'erreur est bien propagée
      await expect(enregistrerPaiementPartiel(factureId, paiement, prestationsPayees, nouveauMontantPaye)).rejects.toThrow();
    });

    it('doit gérer les erreurs lors de la mise à jour du paiement', async () => {
      // Données de test
      const factureId = 'F2023-001';
      const paiement = {
        id: 'P1',
        date: '2023-02-01',
        montant: 500,
        moyenPaiement: 'especes' as 'especes' | 'orange_money' | 'mtn_mobile' | 'virement',
        prestationIds: ['prestation-1']
      };
      const prestationsPayees = ['prestation-1'];
      const nouveauMontantPaye = 500;
      
      // Configuration du mock pour la récupération de la facture
      mockSupabaseSingle.mockReturnValue({
        data: {
          montant: 1000,
          paiements: [],
          montant_paye: 0
        },
        error: null
      });
      
      // Configuration du mock pour simuler une erreur lors de la mise à jour
      mockSupabaseUpdate.mockReturnValue({
        data: null,
        error: new Error('Erreur lors de la mise à jour')
      });

      // Vérifier que l'erreur est bien propagée
      await expect(enregistrerPaiementPartiel(factureId, paiement, prestationsPayees, nouveauMontantPaye)).rejects.toThrow();
    });
  });
});
