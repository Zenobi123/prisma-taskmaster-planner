
import { Client } from "@/types/client";
import { Database } from "@/integrations/supabase/types";

type ClientRow = Database['public']['Tables']['clients']['Row'];

export const mapClientRowToClient = (client: ClientRow): Client => {
  return {
    id: client.id,
    type: client.type as "physique" | "morale",
    nom: client.nom || null,
    raisonsociale: client.raisonsociale || null,
    sigle: client.sigle || null,
    datecreation: client.datecreation || null,
    lieucreation: client.lieucreation || null,
    nomdirigeant: client.nomdirigeant || null,
    formejuridique: client.formejuridique || null,
    niu: client.niu,
    centrerattachement: client.centrerattachement,
    sexe: client.sexe || undefined,
    etatcivil: client.etatcivil || undefined,
    situationimmobiliere: client.situationimmobiliere || { type: "locataire" },
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
    regimefiscal: client.regimefiscal as "reel" | "igs" | "non_professionnel", // Now guaranteed to be valid
    inscriptionfanrharmony2: client.inscriptionfanrharmony2 || false,
    interactions: (Array.isArray(client.interactions) ? client.interactions : []).map((interaction: any) => ({
      id: interaction.id || crypto.randomUUID(),
      date: interaction.date || new Date().toISOString(),
      description: interaction.description || ""
    })),
    statut: client.statut as "actif" | "inactif" | "archive",
    gestionexternalisee: client.gestionexternalisee || false,
    created_at: client.created_at,
    fiscal_data: client.fiscal_data
  };
};
