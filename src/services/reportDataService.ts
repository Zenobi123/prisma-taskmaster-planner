
import { supabase } from "@/integrations/supabase/client";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  clientId?: string;
  collaborateurId?: string;
  status?: string;
}

export class ReportDataService {
  
  static async getFacturesWithClients(filters?: ReportFilters) {
    let query = supabase
      .from('factures')
      .select(`
        *,
        clients(nom, raisonsociale, niu, contact)
      `);

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getFiscalObligationsWithClients(filters?: ReportFilters) {
    let query = supabase
      .from('fiscal_obligations')
      .select(`
        *,
        clients(nom, raisonsociale, niu, contact)
      `);

    if (filters?.startDate) {
      query = query.gte('date_echeance', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('date_echeance', filters.endDate);
    }
    
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getEmployeesWithPayroll(filters?: ReportFilters) {
    const currentYear = new Date().getFullYear();
    
    let query = supabase
      .from('paie')
      .select(`
        *,
        employes(nom, prenom, poste, client_id),
        employes!inner(clients(nom, raisonsociale))
      `)
      .eq('annee', currentYear);

    if (filters?.clientId) {
      query = query.eq('employes.client_id', filters.clientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getTasksWithDetails(filters?: ReportFilters) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        collaborateurs(nom, prenom, poste),
        clients(nom, raisonsociale)
      `);

    if (filters?.startDate) {
      query = query.gte('start_date', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('end_date', filters.endDate);
    }
    
    if (filters?.collaborateurId) {
      query = query.eq('collaborateur_id', filters.collaborateurId);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getClientsStats() {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*');

    if (error) throw error;

    return {
      total: clients.length,
      actifs: clients.filter(c => c.statut === 'actif').length,
      personnesPhysiques: clients.filter(c => c.type === 'physique').length,
      personnesMorales: clients.filter(c => c.type === 'morale').length,
      gestionExternalisee: clients.filter(c => c.gestionexternalisee).length
    };
  }
}
