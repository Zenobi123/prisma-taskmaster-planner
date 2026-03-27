
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { CourrierRecord, CourrierStatus, CourrierModeEnvoi } from "@/types/courrier";
import { courrierTemplates, generateCourrierContent } from "@/utils/courrierTemplates";
import { exportToPdf } from "@/utils/exports/pdfExporter";

// ─────────────────────────────────────────────
// Reference generation
// ─────────────────────────────────────────────
const getNextCourrierReference = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `CORR-${ts}/${year}/${month}`;
};

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────

export const getCourrierRecords = async (filters?: {
  statut?: CourrierStatus | "";
  search?: string;
}): Promise<CourrierRecord[]> => {
  try {
    let query = (supabase as any)
      .from("courriers")
      .select("*")
      .order("date_creation", { ascending: false });

    if (filters?.statut) {
      query = query.eq("statut", filters.statut);
    }

    const { data, error } = await query;
    if (error) {
      // Table may not exist yet – return empty array gracefully
      console.warn("courriers table not accessible:", error.message);
      return [];
    }

    let records: CourrierRecord[] = (data || []) as CourrierRecord[];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        r =>
          r.client_nom?.toLowerCase().includes(q) ||
          r.template_titre?.toLowerCase().includes(q) ||
          r.reference?.toLowerCase().includes(q)
      );
    }

    return records;
  } catch {
    return [];
  }
};

export const updateCourrierStatus = async (
  id: string,
  statut: CourrierStatus,
  extra?: { date_envoi?: string; date_accuse?: string; notes?: string }
): Promise<void> => {
  const payload: any = { statut, ...extra };
  const { error } = await (supabase as any)
    .from("courriers")
    .update(payload)
    .eq("id", id);
  if (error) throw error;
};

export const deleteCourrierRecord = async (id: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from("courriers")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// ─────────────────────────────────────────────
// Main send function (saves record + generates PDF)
// ─────────────────────────────────────────────

export const sendCourrierWithStorage = async (
  clientIds: string[],
  templateId: string,
  customMessage: string,
  modeEnvoi?: CourrierModeEnvoi
): Promise<void> => {
  // Fetch clients
  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .in("id", clientIds);

  if (clientsError || !clients?.length) {
    throw new Error("Aucun client trouvé");
  }

  const template = courrierTemplates.find(t => t.id === templateId);
  if (!template) throw new Error("Template non trouvé");

  for (const client of clients) {
    const clientName =
      client.type === "morale" ? client.raisonsociale : client.nom;
    const content = generateCourrierContent(
      client as unknown as Client,
      template,
      customMessage
    );

    // Build reference
    const reference = await getNextCourrierReference();

    // Save to courriers table (best-effort — table may not exist yet)
    try {
      await (supabase as any).from("courriers").insert({
        reference,
        client_id: client.id,
        client_nom: clientName,
        template_id: templateId,
        template_titre: template.title,
        sujet: template.subject
          .replace(/{{annee}}/g, String(new Date().getFullYear())),
        contenu: content,
        message_personnalise: customMessage || null,
        statut: "envoye",
        mode_envoi: modeEnvoi || "remise_en_main_propre",
        date_creation: new Date().toISOString(),
        date_envoi: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Could not persist courrier record:", e);
    }

    // Generate PDF
    const pdfData = [
      {
        destinataire: clientName,
        niu: client.niu || "N/A",
        centre: client.centrerattachement || "N/A",
        template: template.title,
        contenu: content,
      },
    ];
    const filename = `courrier-${(clientName as string).replace(/\s+/g, "-")}-${
      new Date().toISOString().split("T")[0]
    }`;
    exportToPdf(`Courrier - ${template.title}`, pdfData, filename);
  }
};

// ─────────────────────────────────────────────
// Keep legacy export for backward compatibility
// ─────────────────────────────────────────────
export const getClientsForCourrier = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("statut", "actif")
    .order("nom", { ascending: true });

  if (error) throw error;

  return (data || []).map(client => ({
    ...client,
    type: client.type as "physique" | "morale",
    contact:
      typeof client.contact === "object" && client.contact !== null
        ? {
            telephone: (client.contact as any)?.telephone || "",
            email: (client.contact as any)?.email || "",
          }
        : { telephone: "", email: "" },
    adresse:
      typeof client.adresse === "object" &&
      client.adresse !== null &&
      "ville" in client.adresse
        ? (client.adresse as { ville: string; quartier: string; lieuDit: string })
        : { ville: "", quartier: "", lieuDit: "" },
    fiscal_data:
      typeof client.fiscal_data === "object" && client.fiscal_data !== null
        ? client.fiscal_data
        : {},
  })) as unknown as Client[];
};
