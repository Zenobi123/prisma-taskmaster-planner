
import { Client } from "@/types/client";
import { ObligationStatuses, TaxObligationStatus } from "@/hooks/fiscal/types";

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

// Add the missing function that's being imported by other modules
export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  // This is a mock implementation - in a real app, this might fetch data from an API
  // For now, we'll return an empty array to fix the TypeScript errors
  const currentYear = new Date().getFullYear().toString();
  const unpaidPatentes = unpaidPatenteService.getUnpaidPatentes(currentYear);
  
  // Convert UnpaidPatente objects to Client objects
  // In a real implementation, you would fetch the full client data
  return unpaidPatentes.map(patente => {
    return {
      id: patente.id,
      nom: patente.nom,
      niu: "",
      raisonsociale: "",
      type: "morale", // Default type
      contact: { telephone: "" }, // Default contact
      centrerattachement: "",
      gestionexternalisee: true
    } as Client;
  });
};
