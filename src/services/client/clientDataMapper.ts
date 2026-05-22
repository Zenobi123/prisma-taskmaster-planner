
import { Client } from "@/types/client";
import { Database } from "@/integrations/supabase/types";

type ClientRow = Database['public']['Tables']['clients']['Row'];

// Certaines colonnes (champs JSON et colonnes ajoutées hors types générés) ne
// sont pas typées finement sur la Row : on décrit ici leur forme attendue.
type AdresseJson = { ville?: string; quartier?: string; lieuDit?: string };
type ContactJson = { telephone?: string; email?: string; contact_principal?: string };
type InteractionJson = { id?: string; date?: string; description?: string };
type ClientExtraColumns = {
  civilite?: Client["civilite"];
  chiffreaffaires?: number;
  iscga?: boolean;
  isvendeurboissons?: boolean;
  modepaiementigs?: Client["modepaiementigs"];
  modepaiementpsl?: Client["modepaiementpsl"];
};

export const mapClientRowToClient = (client: ClientRow): Client => {
  const adresse = (client.adresse ?? {}) as AdresseJson;
  const contact = (client.contact ?? {}) as ContactJson;
  const interactionsRaw = Array.isArray(client.interactions)
    ? (client.interactions as InteractionJson[])
    : [];
  const extra = client as ClientRow & ClientExtraColumns;

  return {
    id: client.id,
    type: client.type as "physique" | "morale",
    nom: client.nom || null,
    raisonsociale: client.raisonsociale || null,
    sigle: client.sigle || null,
    datecreation: client.datecreation || null,
    lieucreation: client.lieucreation || null,
    nomdirigeant: client.nomdirigeant || null,
    formejuridique: client.formejuridique as "sa" | "sarl" | "sas" | "snc" | "association" | "gie" | "autre" | null,
    niu: client.niu,
    centrerattachement: client.centrerattachement,
    sexe: client.sexe as "homme" | "femme" | undefined,
    etatcivil: client.etatcivil as "celibataire" | "marie" | "divorce" | "veuf" | undefined,
    situationimmobiliere: (client.situationimmobiliere as Client["situationimmobiliere"]) || { type: "locataire" },
    adresse: {
      ville: adresse.ville || "",
      quartier: adresse.quartier || "",
      lieuDit: adresse.lieuDit || ""
    },
    contact: {
      telephone: contact.telephone || "",
      email: contact.email || "",
      contact_principal: contact.contact_principal || ""
    },
    secteuractivite: client.secteuractivite,
    numerocnps: client.numerocnps || null,
    regimefiscal: client.regimefiscal as "reel" | "igs" | "non_professionnel" | "obnl", // Now guaranteed to be valid
    interactions: interactionsRaw.map((interaction) => ({
      id: interaction.id || crypto.randomUUID(),
      date: interaction.date || new Date().toISOString(),
      description: interaction.description || ""
    })),
    statut: client.statut as "actif" | "inactif" | "archive",
    gestionexternalisee: client.gestionexternalisee || false,
    created_at: client.created_at,
    civilite: extra.civilite || undefined,
    chiffreaffaires: extra.chiffreaffaires || undefined,
    iscga: extra.iscga || false,
    isvendeurboissons: extra.isvendeurboissons || false,
    modepaiementigs: extra.modepaiementigs || undefined,
    modepaiementpsl: extra.modepaiementpsl || undefined,
    fiscal_data: client.fiscal_data
  };
};
