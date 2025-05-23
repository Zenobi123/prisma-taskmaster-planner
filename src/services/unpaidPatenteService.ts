
import { Client } from "@/types/client";
import { ObligationStatuses, TaxObligationStatus } from "@/hooks/fiscal/types";
import { supabase } from "@/integrations/supabase/client";

export interface UnpaidPatente {
  id: string;
  nom: string;
  fiscalYear: string;
  dueDate?: string;
  amount?: number;
}

interface FiscalDataWithYear {
  clientId: string;
  year: string;
  obligations: Record<string, ObligationStatuses>;
}

class UnpaidPatenteService {
  private clients: Client[] = [];
  private fiscalData: Record<string, FiscalDataWithYear> = {};
  
  public setClients(clients: Client[]): void {
    this.clients = clients;
  }
  
  public setFiscalData(fiscalData: Record<string, FiscalDataWithYear>): void {
    this.fiscalData = fiscalData;
  }
  
  private getClientNameById(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.nom || client.raisonsociale || "Client sans nom" : "Client inconnu";
  }
  
  private filterUnpaidForYear(
    fiscalData: FiscalDataWithYear | undefined,
    year: string
  ): UnpaidPatente | null {
    if (!fiscalData?.obligations?.[year]?.patente) return null;
    
    const patenteStatus: TaxObligationStatus = fiscalData.obligations[year].patente;
    
    // Only include if marked as subject to patente but not paid
    if (patenteStatus.assujetti && !patenteStatus.payee) {
      return {
        id: fiscalData.clientId,
        nom: this.getClientNameById(fiscalData.clientId),
        fiscalYear: year,
        dueDate: patenteStatus.dateEcheance,
        amount: patenteStatus.montant
      };
    }
    
    return null;
  }
  
  public getUnpaidPatentes(year: string): UnpaidPatente[] {
    if (!this.clients.length || !Object.keys(this.fiscalData).length) {
      return [];
    }
    
    const results: UnpaidPatente[] = [];
    
    Object.values(this.fiscalData).forEach(data => {
      if (data.obligations && data.obligations[year]) {
        const unpaid = this.filterUnpaidForYear(data, year);
        if (unpaid) {
          results.push(unpaid);
        }
      }
    });
    
    return results;
  }
}

export const unpaidPatenteService = new UnpaidPatenteService();

// Add the implementation for the missing function
export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  try {
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .not('fiscal_data', 'is', null);

    if (error) throw error;

    // Convertir les données en Client[] et filtrer
    const clients = clientsData.map(client => client as unknown as Client);
    
    // Filter clients with unpaid Patente
    return clients.filter(client => {
      const fiscalData = client.fiscal_data;
      if (!fiscalData) return false;
      
      // Get current year
      const currentYear = new Date().getFullYear().toString();
      
      // Vérifier que fiscal_data est un objet et contient obligations
      if (typeof fiscalData !== 'object' || !fiscalData.obligations) return false;
      
      // Vérifier que l'année courante existe dans obligations
      if (!fiscalData.obligations[currentYear]) return false;
      
      // Get Patente obligation status
      const patenteStatus = fiscalData.obligations[currentYear]?.patente;
      
      // Return true if Patente is required but not paid
      return patenteStatus && patenteStatus.assujetti === true && patenteStatus.paye === false;
    });
  } catch (error) {
    console.error('Error fetching clients with unpaid Patente:', error);
    return [];
  }
};
