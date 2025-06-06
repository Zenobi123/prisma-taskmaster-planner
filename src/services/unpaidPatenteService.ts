
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

// Export the function from fiscalObligationsService
export { getClientsWithUnpaidPatente } from "./fiscalObligationsService";
