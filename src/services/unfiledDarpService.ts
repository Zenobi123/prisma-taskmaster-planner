
import { supabase } from "@/integrations/supabase/client";
import { Client, Interaction } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";
import { Json } from "@/integrations/supabase/types";

export const getClientsWithUnfiledDarp = async (): Promise<Client[]> => {
  console.log("Service: Récupération des clients avec DARP non déposées...");
  
  try {
    const { data: allClients, error } = await supabase
      .from("clients")
      .select("*");
    
    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }

    const clientsWithUnfiledDarp = allClients.filter(client => {
      if (client.fiscal_data && typeof client.fiscal_data === 'object') {
        const fiscalData = client.fiscal_data as ClientFiscalData;
        
        if (fiscalData.hiddenFromDashboard === true) {
          return false;
        }
        
        if (fiscalData.obligations?.darp) {
          return fiscalData.obligations.darp.assujetti === true && 
                 fiscalData.obligations.darp.depose === false;
        }
      }
      return false;
    });

    // Transform the raw data to match the Client interface with correct typing
    const typedClients: Client[] = clientsWithUnfiledDarp.map(client => {
      // Create properly typed interactions array
      const interactions: Interaction[] = Array.isArray(client.interactions) 
        ? client.interactions.map((interaction: any) => ({
            id: interaction.id || '',
            date: interaction.date || '',
            description: interaction.description || ''
          }))
        : [];

      return {
        id: client.id,
        type: client.type as "physique" | "morale",
        nom: client.nom || undefined,
        raisonsociale: client.raisonsociale || undefined,
        sigle: client.sigle || undefined,
        datecreation: client.datecreation || undefined,
        lieucreation: client.lieucreation || undefined,
        nomdirigeant: client.nomdirigeant || undefined,
        formejuridique: client.formejuridique as any || undefined,
        niu: client.niu,
        centrerattachement: client.centrerattachement,
        adresse: {
          ville: typeof client.adresse === 'object' ? (client.adresse as any)?.ville || "" : "",
          quartier: typeof client.adresse === 'object' ? (client.adresse as any)?.quartier || "" : "",
          lieuDit: typeof client.adresse === 'object' ? (client.adresse as any)?.lieuDit || "" : ""
        },
        contact: {
          telephone: typeof client.contact === 'object' ? (client.contact as any)?.telephone || "" : "",
          email: typeof client.contact === 'object' ? (client.contact as any)?.email || "" : ""
        },
        secteuractivite: client.secteuractivite,
        numerocnps: client.numerocnps || undefined,
        interactions: interactions,
        statut: client.statut as "actif" | "inactif" | "archive",
        gestionexternalisee: client.gestionexternalisee || false,
        fiscal_data: client.fiscal_data,
        sexe: client.sexe as any || undefined,
        etatcivil: client.etatcivil as any || undefined,
        regimefiscal: client.regimefiscal as any || undefined,
        situationimmobiliere: client.situationimmobiliere as any || { type: "locataire" },
        created_at: client.created_at
      };
    });

    return typedClients;
  } catch (error) {
    console.error("Erreur critique lors de la récupération des clients DARP:", error);
    return [];
  }
};
