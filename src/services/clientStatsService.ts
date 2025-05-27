import { createClient } from "@/lib/supabase/server";

export interface ClientStats {
  totalClients: number;
  actifs: number;
  inactifs: number;
  archives: number;
  withUnfiledObligations: number;
}

export const getClientsStats = async (): Promise<ClientStats> => {
  try {
    const supabase = createClient();
    
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
      withUnfiledObligations: 0
    };

    // Récupérer les obligations fiscales pour calculer les obligations non déposées
    const { data: obligations } = await supabase
      .from('fiscal_obligations')
      .select('client_id, depose');

    if (obligations) {
      const clientsWithUnfiledObligations = new Set();
      
      obligations.forEach(obligation => {
        if (typeof obligation === 'object' && obligation !== null && 'depose' in obligation && 'client_id' in obligation) {
          if (!obligation.depose) {
            clientsWithUnfiledObligations.add(obligation.client_id);
          }
        }
      });
      
      stats.withUnfiledObligations = clientsWithUnfiledObligations.size;
    }

    return stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques clients:', error);
    throw error;
  }
};
