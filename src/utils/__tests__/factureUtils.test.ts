
import { prepareNewInvoice } from '../factureUtils';
import { getClientData } from '@/services/facture/clientService';

// Mock du service clientService
jest.mock('@/services/facture/clientService');

describe('factureUtils', () => {
  describe('prepareNewInvoice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('doit préparer une nouvelle facture à partir des données de formulaire', async () => {
      // Mock des données de client
      const mockClientData = {
        id: 'client-1',
        type: 'physique',
        nom: 'Client Test',
        adresse: {
          ville: 'Ville Test'
        },
        contact: {
          telephone: '123456789',
          email: 'test@example.com'
        }
      };

      // Mock des données de formulaire
      const formData = {
        clientId: 'client-1',
        dateEmission: '2023-01-01',
        dateEcheance: '2023-01-31',
        prestations: [
          { description: 'Prestation 1', montant: 1000 }
        ],
        notes: 'Test note',
        modeReglement: 'comptant',
        moyenPaiement: 'especes'
      };

      // Factures existantes
      const factures = [
        { id: 'F2023-001', client: { id: 'client-2', nom: 'Autre Client' }, montant: 2000 } as any
      ];

      // Configuration du mock
      (getClientData as jest.Mock).mockResolvedValue(mockClientData);

      // Exécution
      const result = await prepareNewInvoice(formData, factures);

      // Vérifications
      expect(getClientData).toHaveBeenCalledWith('client-1');
      
      // Vérification de la facture pour la DB
      expect(result.newFactureDB).toMatchObject({
        id: expect.stringMatching(/^F\d{4}-002$/),
        client_id: 'client-1',
        client_nom: 'Client Test',
        client_adresse: 'Ville Test',
        client_telephone: '123456789',
        client_email: 'test@example.com',
        date: '2023-01-01',
        echeance: '2023-01-31',
        montant: 1000,
        status: 'payée',
        prestations: expect.any(String),
        notes: 'Test note',
        mode_reglement: 'comptant',
        moyen_paiement: 'especes'
      });
      
      // Vérification de la facture pour l'état
      expect(result.newFactureState).toMatchObject({
        id: expect.stringMatching(/^F\d{4}-002$/),
        client: {
          id: 'client-1',
          nom: 'Client Test',
          adresse: 'Ville Test',
          telephone: '123456789',
          email: 'test@example.com'
        },
        date: '2023-01-01',
        echeance: '2023-01-31',
        montant: 1000,
        status: 'payée',
        prestations: [
          { description: 'Prestation 1', montant: 1000 }
        ],
        notes: 'Test note',
        modeReglement: 'comptant',
        moyenPaiement: 'especes'
      });
    });

    it('doit gérer les clients de type entreprise', async () => {
      // Mock des données de client entreprise
      const mockClientData = {
        id: 'client-2',
        type: 'morale',
        raisonsociale: 'Entreprise Test',
        adresse: {
          ville: 'Ville Entreprise'
        },
        contact: {
          telephone: '987654321',
          email: 'entreprise@example.com'
        }
      };

      // Mock des données de formulaire
      const formData = {
        clientId: 'client-2',
        dateEmission: '2023-02-01',
        dateEcheance: '2023-02-28',
        prestations: [
          { description: 'Service 1', montant: 2000 }
        ],
        notes: 'Facture entreprise',
        modeReglement: 'credit',
        moyenPaiement: 'virement'
      };

      // Factures existantes
      const factures = [] as any[];

      // Configuration du mock
      (getClientData as jest.Mock).mockResolvedValue(mockClientData);

      // Exécution
      const result = await prepareNewInvoice(formData, factures);

      // Vérifications
      expect(result.newFactureDB.client_nom).toBe('Entreprise Test');
      expect(result.newFactureState.client.nom).toBe('Entreprise Test');
      expect(result.newFactureDB.status).toBe('en_attente'); // car modeReglement est credit
      expect(result.newFactureState.status).toBe('en_attente');
    });

    it('doit gérer le cas où les données de client sont incomplètes', async () => {
      // Mock des données de client incomplètes
      const mockClientData = {
        id: 'client-3',
        type: 'physique'
        // Pas de nom, adresse, etc.
      };

      // Mock des données de formulaire
      const formData = {
        clientId: 'client-3',
        dateEmission: '2023-03-01',
        dateEcheance: '2023-03-31',
        prestations: [
          { description: 'Produit 1', montant: 500 }
        ],
        modeReglement: 'comptant'
      };

      // Factures existantes
      const factures = [] as any[];

      // Configuration du mock
      (getClientData as jest.Mock).mockResolvedValue(mockClientData);

      // Exécution
      const result = await prepareNewInvoice(formData, factures);

      // Vérifications
      expect(result.newFactureDB.client_nom).toBe('Client sans nom');
      expect(result.newFactureDB.client_adresse).toBe('Adresse non spécifiée');
      expect(result.newFactureDB.client_telephone).toBe('Téléphone non spécifié');
      expect(result.newFactureDB.client_email).toBe('Email non spécifié');
    });
  });
});
