
import { Client, FormeJuridique, Sexe, EtatCivil, RegimeFiscal, SituationImmobiliere } from "@/types/client";
import { Database } from "@/integrations/supabase/types";

type ClientRow = Database['public']['Tables']['clients']['Row'];

/**
 * Formats a client row from the database into a Client object
 */
export const formatClientFromDatabase = (client: ClientRow): Client => {
  // Handle IGS data - either from fiscal_data.igs or directly in igs field
  const igsData = client.fiscal_data && typeof client.fiscal_data === 'object' 
    ? (client.fiscal_data as any).igs || { soumisIGS: false, adherentCGA: false }
    : { soumisIGS: false, adherentCGA: false };

  return {
    id: client.id,
    type: client.type as "physique" | "morale",
    nom: client.nom || null,
    raisonsociale: client.raisonsociale || null,
    sigle: client.sigle || null,
    datecreation: client.datecreation || null,
    lieucreation: client.lieucreation || null,
    nomdirigeant: client.nomdirigeant || null,
    formejuridique: client.formejuridique as FormeJuridique || null,
    niu: client.niu,
    centrerattachement: client.centrerattachement,
    sexe: client.sexe as Sexe || undefined,
    etatcivil: client.etatcivil as EtatCivil || undefined,
    regimefiscal: client.regimefiscal as RegimeFiscal || undefined,
    situationimmobiliere: client.situationimmobiliere as { 
      type: SituationImmobiliere; 
      valeur?: number; 
      loyer?: number; 
    } || { type: "locataire" },
    adresse: {
      ville: (client.adresse as any)?.ville || "",
      quartier: (client.adresse as any)?.quartier || "",
      lieuDit: (client.adresse as any)?.lieuDit || ""
    },
    contact: {
      telephone: (client.contact as any)?.telephone || "",
      email: (client.contact as any)?.email || ""
    },
    secteuractivite: client.secteuractivite,
    numerocnps: client.numerocnps || null,
    interactions: (Array.isArray(client.interactions) ? client.interactions : []).map((interaction: any) => ({
      id: interaction.id || crypto.randomUUID(),
      date: interaction.date || new Date().toISOString(),
      description: interaction.description || ""
    })),
    statut: client.statut as "actif" | "inactif" | "archive",
    gestionexternalisee: client.gestionexternalisee || false,
    created_at: client.created_at,
    fiscal_data: client.fiscal_data,
    igs: igsData
  };
};
