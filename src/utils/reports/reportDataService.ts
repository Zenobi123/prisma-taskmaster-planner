import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import type { Tables } from "@/integrations/supabase/types";
import { getClientsWithUnpaidIgs, getClientsWithUnpaidPatente, getClientsWithUnfiledDsf, getClientsWithUnfiledDarp } from "@/services/fiscalObligationsService";

type EmbeddedClient = { nom?: string | null; raisonsociale?: string | null; niu?: string | null } | null;
type WithClient<T> = T & { clients?: EmbeddedClient };

export interface ReportData {
  clients: Client[];
  factures: WithClient<Tables<'factures'>>[];
  paiements: WithClient<Tables<'paiements'>>[];
  fiscalObligations: WithClient<Tables<'fiscal_obligations'>>[];
  employes: WithClient<Tables<'employes'>>[];
  paie: Tables<'paie'>[];
  tasks: (Tables<'tasks'> & {
    clients?: EmbeddedClient;
    collaborateurs?: { nom?: string | null; prenom?: string | null } | null;
  })[];
}

export interface BillingDossierReportData {
  devis: unknown[];
  propositions: unknown[];
  recus: unknown[];
}

export class ReportDataService {
  
  static async getAllReportData(): Promise<ReportData> {
    try {
      // Récupérer tous les clients actifs
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('statut', 'actif');

      if (clientsError) throw clientsError;

      // Mapper les données clients au bon type
      const clients: Client[] = (clientsData || []).map((client) => ({
        ...client,
        type: client.type as 'physique' | 'morale'
      })) as unknown as Client[];

      // Récupérer toutes les factures avec les informations clients
      const { data: facturesData, error: facturesError } = await supabase
        .from('factures')
        .select(`
          *,
          clients(nom, raisonsociale, niu)
        `);

      if (facturesError) throw facturesError;

      // Récupérer tous les paiements avec les informations clients
      const { data: paiementsData, error: paiementsError } = await supabase
        .from('paiements')
        .select(`
          *,
          clients(nom, raisonsociale, niu)
        `);

      if (paiementsError) throw paiementsError;

      // Récupérer les obligations fiscales
      const { data: obligationsData, error: obligationsError } = await supabase
        .from('fiscal_obligations')
        .select(`
          *,
          clients(nom, raisonsociale, niu)
        `);

      if (obligationsError) throw obligationsError;

      // Récupérer les employés
      const { data: employesData, error: employesError } = await supabase
        .from('employes')
        .select(`
          *,
          clients(nom, raisonsociale)
        `);

      if (employesError) throw employesError;

      // Récupérer les données de paie
      const { data: paieData, error: paieError } = await supabase
        .from('paie')
        .select(`
          *,
          employes(nom, prenom, client_id, clients(nom, raisonsociale))
        `);

      if (paieError) throw paieError;

      // Récupérer les tâches - Correction de la relation ambiguë
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          clients!fk_tasks_client(nom, raisonsociale)
        `);

      if (tasksError) {
        // Fallback : récupérer les tâches sans les collaborateurs ni les clients
        const { data: tasksDataFallback, error: tasksErrorFallback } = await supabase
          .from('tasks')
          .select('*');
        
        return {
          clients,
          factures: facturesData || [],
          paiements: paiementsData || [],
          fiscalObligations: obligationsData || [],
          employes: employesData || [],
          paie: paieData || [],
          tasks: tasksDataFallback || []
        };
      }

      return {
        clients,
        factures: facturesData || [],
        paiements: paiementsData || [],
        fiscalObligations: obligationsData || [],
        employes: employesData || [],
        paie: paieData || [],
        tasks: tasksData || []
      };
    } catch (error) {
      return {
        clients: [],
        factures: [],
        paiements: [],
        fiscalObligations: [],
        employes: [],
        paie: [],
        tasks: []
      };
    }
  }


  static async getBillingDossierData(): Promise<BillingDossierReportData> {
    try {
      const [devisResult, propositionsResult, recusResult] = await Promise.all([
        supabase
          .from('devis')
          .select(`
            *,
            clients(nom, raisonsociale, niu)
          `)
          .order('date', { ascending: false }),
        supabase
          .from('propositions')
          .select(`
            *,
            clients(nom, raisonsociale, niu)
          `)
          .order('date', { ascending: false }),
        supabase
          .from('paiements')
          .select(`
            *,
            clients(nom, raisonsociale, niu)
          `)
          .order('date', { ascending: false }),
      ]);

      if (devisResult.error) throw devisResult.error;
      if (propositionsResult.error) throw propositionsResult.error;
      if (recusResult.error) throw recusResult.error;

      return {
        devis: devisResult.data || [],
        propositions: propositionsResult.data || [],
        recus: recusResult.data || [],
      };
    } catch (error) {
      return { devis: [], propositions: [], recus: [] };
    }
  }

  static async getFiscalObligationsData() {
    try {
      const [unpaidIgs, unpaidPatente, unfiledDsf, unfiledDarp] = await Promise.all([
        getClientsWithUnpaidIgs(),
        getClientsWithUnpaidPatente(),
        getClientsWithUnfiledDsf(),
        getClientsWithUnfiledDarp()
      ]);

      return {
        unpaidIgs,
        unpaidPatente,
        unfiledDsf,
        unfiledDarp
      };
    } catch (error) {
      return {
        unpaidIgs: [],
        unpaidPatente: [],
        unfiledDsf: [],
        unfiledDarp: []
      };
    }
  }

  static calculateFinancialStats(
    factures: { montant?: number | string | null; status_paiement?: string | null; echeance?: string | null }[],
    paiements: { montant?: number | string | null }[],
  ) {
    const totalFactures = factures.reduce((sum, f) => sum + (Number(f.montant) || 0), 0);
    const totalPaiements = paiements.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
    const facuresPayees = factures.filter(f => f.status_paiement === 'payée').length;
    const facturesEnRetard = factures.filter(f => 
      f.status_paiement === 'non_payée' && 
      new Date(f.echeance) < new Date()
    ).length;

    return {
      totalFactures,
      totalPaiements,
      facuresPayees,
      facturesEnRetard,
      tauxRecouvrement: totalFactures > 0 ? (totalPaiements / totalFactures) * 100 : 0
    };
  }

  static calculateClientStats(clients: { type?: string | null; gestionexternalisee?: boolean | null }[]) {
    const total = clients.length;
    const personnesPhysiques = clients.filter(c => c.type === 'physique').length;
    const personnesMorales = clients.filter(c => c.type === 'morale').length;
    const gestionExternalisee = clients.filter(c => c.gestionexternalisee).length;

    return {
      total,
      personnesPhysiques,
      personnesMorales,
      gestionExternalisee
    };
  }

  static calculatePayrollStats(
    paieData: { annee?: number | null; salaire_brut?: number | string | null; salaire_net?: number | string | null; total_retenues?: number | string | null }[],
  ) {
    const currentYear = new Date().getFullYear();
    const currentYearData = paieData.filter(p => p.annee === currentYear);
    
    const totalSalaireBrut = currentYearData.reduce((sum, p) => sum + (Number(p.salaire_brut) || 0), 0);
    const totalSalaireNet = currentYearData.reduce((sum, p) => sum + (Number(p.salaire_net) || 0), 0);
    const totalRetenues = currentYearData.reduce((sum, p) => sum + (Number(p.total_retenues) || 0), 0);

    return {
      totalSalaireBrut,
      totalSalaireNet,
      totalRetenues,
      nombreBulletins: currentYearData.length
    };
  }
}
