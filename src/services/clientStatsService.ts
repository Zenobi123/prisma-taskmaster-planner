
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, defaultClientFiscalData } from "@/hooks/fiscal/types";

export interface ClientStats {
  total: number;
  active: number;
  archived: number;
  withExpiringAttestation: number;
  withUnfiledDsf: number;
  withUnpaidPatente: number;
  managedClients: number;
  unpaidPatenteClients: number;
  unfiledDsfClients: number;
}

export const getClientStats = async (): Promise<ClientStats> => {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*, fiscal_data');

    if (error) {
      console.error("Erreur lors de la récupération des statistiques clients:", error);
      return {
        total: 0,
        active: 0,
        archived: 0,
        withExpiringAttestation: 0,
        withUnfiledDsf: 0,
        withUnpaidPatente: 0,
        managedClients: 0,
        unpaidPatenteClients: 0,
        unfiledDsfClients: 0
      };
    }

    const currentDate = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    const stats = {
      total: clients.length,
      active: clients.filter(client => client.statut === 'actif').length,
      archived: clients.filter(client => client.statut === 'archive').length,
      withExpiringAttestation: 0,
      withUnfiledDsf: 0,
      withUnpaidPatente: 0,
      managedClients: clients.filter(client => client.statut === 'actif' && client.gestionexternalisee).length,
      unpaidPatenteClients: 0,
      unfiledDsfClients: 0
    };

    clients.forEach(client => {
      if (client.statut !== 'actif') return;
      
      const fiscalData = client.fiscal_data ? 
        (typeof client.fiscal_data === 'string' 
          ? JSON.parse(client.fiscal_data) 
          : client.fiscal_data as unknown as ClientFiscalData) 
        : defaultClientFiscalData;
        
      if (fiscalData.hiddenFromDashboard) {
        return;
      }

      if (fiscalData.attestation && fiscalData.attestation.validityEndDate) {
        const endDate = new Date(fiscalData.attestation.validityEndDate);
        if (endDate <= thirtyDaysFromNow && endDate >= currentDate) {
          stats.withExpiringAttestation++;
        }
      }

      if (fiscalData.obligations && 
          fiscalData.obligations.dsf && 
          fiscalData.obligations.dsf.assujetti && 
          !fiscalData.obligations.dsf.depose) {
        stats.withUnfiledDsf++;
        stats.unfiledDsfClients++;
      }

      if (fiscalData.obligations && 
          fiscalData.obligations.patente && 
          fiscalData.obligations.patente.assujetti && 
          !fiscalData.obligations.patente.paye) {
        stats.withUnpaidPatente++;
        stats.unpaidPatenteClients++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques clients:", error);
    return {
      total: 0,
      active: 0,
      archived: 0,
      withExpiringAttestation: 0,
      withUnfiledDsf: 0,
      withUnpaidPatente: 0,
      managedClients: 0,
      unpaidPatenteClients: 0,
      unfiledDsfClients: 0
    };
  }
};
