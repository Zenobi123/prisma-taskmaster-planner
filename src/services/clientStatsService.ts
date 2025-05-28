
import { supabase } from "@/integrations/supabase/client";

export interface ClientStats {
  totalClients: number;
  actifs: number;
  inactifs: number;
  archives: number;
  withUnfiledObligations: number;
  managedClients: number;
  unpaidPatenteClients: number;
  unfiledDsfClients: number;
  unpaidIgsClients: number;
  unfiledDarpClients: number;
}

export const getClientsStats = async (): Promise<ClientStats> => {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }

    const stats: ClientStats = {
      totalClients: clients.length,
      actifs: clients.filter(c => c.statut === 'actif').length,
      inactifs: clients.filter(c => c.statut === 'inactif').length,
      archives: clients.filter(c => c.statut === 'archive').length,
      withUnfiledObligations: 0,
      managedClients: clients.filter(c => c.gestionexternalisee === true).length,
      unpaidPatenteClients: 0,
      unfiledDsfClients: 0,
      unpaidIgsClients: 0,
      unfiledDarpClients: 0
    };

    // Récupérer les obligations fiscales pour calculer les statistiques
    const { data: obligations, error: obligationsError } = await supabase
      .from('fiscal_obligations')
      .select('client_id, type_obligation, depose, paye');

    if (obligationsError) {
      console.error('Erreur lors de la récupération des obligations fiscales:', obligationsError);
      // Continue avec les stats de base même si les obligations ne sont pas disponibles
      return stats;
    }

    if (obligations && obligations.length > 0) {
      const clientsWithUnfiledObligations = new Set<string>();
      const unpaidPatenteClients = new Set<string>();
      const unfiledDsfClients = new Set<string>();
      const unpaidIgsClients = new Set<string>();
      const unfiledDarpClients = new Set<string>();
      
      obligations.forEach(obligation => {
        if (obligation && obligation.client_id) {
          // Obligations non déposées
          if (!obligation.depose) {
            clientsWithUnfiledObligations.add(obligation.client_id);
            
            // Spécifique par type d'obligation
            if (obligation.type_obligation === 'dsf') {
              unfiledDsfClients.add(obligation.client_id);
            } else if (obligation.type_obligation === 'darp') {
              unfiledDarpClients.add(obligation.client_id);
            }
          }
          
          // Obligations non payées
          if (!obligation.paye) {
            if (obligation.type_obligation === 'patente') {
              unpaidPatenteClients.add(obligation.client_id);
            } else if (obligation.type_obligation === 'igs') {
              unpaidIgsClients.add(obligation.client_id);
            }
          }
        }
      });
      
      stats.withUnfiledObligations = clientsWithUnfiledObligations.size;
      stats.unpaidPatenteClients = unpaidPatenteClients.size;
      stats.unfiledDsfClients = unfiledDsfClients.size;
      stats.unpaidIgsClients = unpaidIgsClients.size;
      stats.unfiledDarpClients = unfiledDarpClients.size;
    }

    return stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques clients:', error);
    throw error;
  }
};
