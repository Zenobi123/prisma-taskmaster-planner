
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, ClientStatus, FormeJuridique, RegimeFiscal, Interaction, Sexe, EtatCivil, SituationImmobiliere } from "@/types/client";

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  console.log("Service: Récupération des clients avec patentes impayées...");
  
  try {
    // Récupérer tous les clients
    const { data: allClients, error: clientsError } = await supabase
      .from("clients")
      .select("*");
    
    if (clientsError) {
      console.error("Erreur lors de la récupération des clients:", clientsError);
      throw clientsError;
    }

    console.log("Service: Nombre total de clients récupérés:", allClients.length);

    // Filtrer les clients qui ont une patente impayée
    const clientsWithUnpaidPatente = allClients.filter(client => {
      // On vérifie si le client a des données fiscales
      if (client.fiscal_data && typeof client.fiscal_data === 'object' && client.fiscal_data !== null) {
        // Vérifier si obligations existe dans les données fiscales
        const fiscalData = client.fiscal_data as { obligations?: any };
        if (fiscalData.obligations) {
          // On cherche une obligation de type patente qui est assujetti mais non payée
          const isAssujetti = fiscalData.obligations.patente && 
                fiscalData.obligations.patente.assujetti === true;
          const isNotPaid = fiscalData.obligations.patente && 
                fiscalData.obligations.patente.paye === false;
          
          return isAssujetti && isNotPaid;
        }
      }
      return false;
    });
    
    console.log("Service: Clients avec patentes impayées:", clientsWithUnpaidPatente.length);
    console.log("Service: Premier client avec patente impayée:", clientsWithUnpaidPatente[0] || "Aucun");
    
    // Convertir les données brutes en objets Client typés avec des conversions explicites
    const typedClients: Client[] = clientsWithUnpaidPatente.map(client => {
      // Transformer adresse JSON en structure typée
      const adresseTyped = {
        ville: typeof client.adresse === 'object' && client.adresse !== null ? 
          (client.adresse as any).ville || "" : "",
        quartier: typeof client.adresse === 'object' && client.adresse !== null ? 
          (client.adresse as any).quartier || "" : "",
        lieuDit: typeof client.adresse === 'object' && client.adresse !== null ? 
          (client.adresse as any).lieuDit || "" : ""
      };
      
      // Transformer contact JSON en structure typée
      const contactTyped = {
        telephone: typeof client.contact === 'object' && client.contact !== null ? 
          (client.contact as any).telephone || "" : "",
        email: typeof client.contact === 'object' && client.contact !== null ? 
          (client.contact as any).email || "" : ""
      };
      
      // Transformer interactions JSON en array typé avec le bon format Interaction[]
      const interactionsTyped: Interaction[] = Array.isArray(client.interactions) ? 
        client.interactions.map((interaction: any) => ({
          id: interaction.id || "",
          date: interaction.date || "",
          description: interaction.description || ""
        })) : [];
      
      // Handle the 'sexe' field properly, ensuring it's cast to the Sexe type
      const sexeTyped: Sexe | undefined = client.sexe as Sexe | undefined;
      
      // Handle the 'etatcivil' field properly, ensuring it's cast to the EtatCivil type
      const etatcivilTyped: EtatCivil | undefined = client.etatcivil as EtatCivil | undefined;
      
      // Handle the situationimmobiliere field properly, transforming from JSON to typed object
      let situationimmobiliereTyped: { type: SituationImmobiliere; valeur?: number; loyer?: number } | undefined;
      
      if (client.situationimmobiliere && typeof client.situationimmobiliere === 'object') {
        situationimmobiliereTyped = {
          type: (client.situationimmobiliere as any).type as SituationImmobiliere || "locataire",
          valeur: (client.situationimmobiliere as any).valeur as number | undefined,
          loyer: (client.situationimmobiliere as any).loyer as number | undefined,
        };
      }
      
      return {
        ...client,
        type: client.type as ClientType,
        adresse: adresseTyped,
        contact: contactTyped,
        interactions: interactionsTyped,
        statut: client.statut as ClientStatus,
        formejuridique: client.formejuridique as FormeJuridique || undefined,
        regimefiscal: client.regimefiscal as RegimeFiscal || undefined,
        datecreation: client.datecreation || undefined,
        lieucreation: client.lieucreation || undefined,
        nomdirigeant: client.nomdirigeant || undefined,
        sigle: client.sigle || undefined,
        nom: client.nom || undefined,
        raisonsociale: client.raisonsociale || undefined,
        situationimmobiliere: situationimmobiliereTyped,
        sexe: sexeTyped,
        etatcivil: etatcivilTyped
      };
    });
    
    return typedClients;
  } catch (error) {
    console.error("Erreur dans getClientsWithUnpaidPatente:", error);
    return [];
  }
};
