
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataExportButton } from "@/components/shared/DataExportButton";
import { DataImportButton, ImportResult } from "@/components/shared/DataImportButton";
import { DataColumn } from "@/utils/dataTransfer/dataExport";
import { ImportColumnSpec, ImportRow } from "@/utils/dataTransfer/dataImport";
import { supabase } from "@/integrations/supabase/client";
import { getClients } from "@/services/clientService";
import {
  CourrierModeEnvoi,
  CourrierRecord,
  CourrierStatus,
} from "@/types/courrier";

const VALID_STATUSES: CourrierStatus[] = [
  "brouillon",
  "envoye",
  "accuse",
  "classe",
];
const VALID_MODES: CourrierModeEnvoi[] = [
  "remise_en_main_propre",
  "courrier_postal",
  "email",
  "fax",
];

const EXPORT_COLUMNS: DataColumn<CourrierRecord>[] = [
  { key: "reference", label: "Référence", accessor: (r) => r.reference },
  { key: "client_nom", label: "Client", accessor: (r) => r.client_nom || "" },
  { key: "template_id", label: "Modèle (id)", accessor: (r) => r.template_id },
  { key: "template_titre", label: "Modèle", accessor: (r) => r.template_titre },
  { key: "sujet", label: "Sujet", accessor: (r) => r.sujet },
  { key: "contenu", label: "Contenu", accessor: (r) => r.contenu },
  { key: "statut", label: "Statut", accessor: (r) => r.statut },
  { key: "mode_envoi", label: "Mode d'envoi", accessor: (r) => r.mode_envoi || "" },
  { key: "date_creation", label: "Date de création", accessor: (r) => r.date_creation },
  { key: "date_envoi", label: "Date d'envoi", accessor: (r) => r.date_envoi || "" },
  { key: "notes", label: "Notes", accessor: (r) => r.notes || "" },
];

const IMPORT_COLUMNS: ImportColumnSpec[] = [
  { key: "client_nom", label: "Client", required: true, example: "Entreprise SARL" },
  { key: "sujet", label: "Sujet", required: true, example: "Relance déclaration IGS 2024" },
  { key: "template_id", label: "Modèle (id)", example: "relance_igs" },
  { key: "template_titre", label: "Modèle", example: "Relance IGS" },
  { key: "contenu", label: "Contenu", example: "Madame, Monsieur, ..." },
  { key: "statut", label: "Statut", example: "brouillon" },
  { key: "mode_envoi", label: "Mode d'envoi", example: "email" },
  { key: "reference", label: "Référence", example: "CORR-AB12/2024/06" },
  { key: "notes", label: "Notes", example: "" },
];

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const generateReference = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `CORR-${ts}/${year}/${month}`;
};

interface CourrierImportExportProps {
  records: CourrierRecord[];
  isMobile?: boolean;
}

export function CourrierImportExport({ records, isMobile }: CourrierImportExportProps) {
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(),
  });

  const handleImport = async (rows: ImportRow[]): Promise<ImportResult> => {
    const errors: string[] = [];
    let success = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2;
      const clientNom = (row.client_nom || "").trim();
      const sujet = (row.sujet || "").trim();

      if (!clientNom || !sujet) {
        errors.push(`Ligne ${lineNum} : le client et le sujet sont obligatoires.`);
        continue;
      }

      const clientTarget = normalize(clientNom);
      const client = clients.find(
        (c) =>
          normalize(c.raisonsociale || "") === clientTarget ||
          normalize(c.nom || "") === clientTarget
      );

      const rawStatut = (row.statut || "").trim().toLowerCase() as CourrierStatus;
      const statut = VALID_STATUSES.includes(rawStatut) ? rawStatut : "brouillon";

      const rawMode = (row.mode_envoi || "").trim().toLowerCase() as CourrierModeEnvoi;
      const mode_envoi = VALID_MODES.includes(rawMode)
        ? rawMode
        : "remise_en_main_propre";

      const nowIso = new Date().toISOString();
      const payload = {
        reference: (row.reference || "").trim() || generateReference(),
        client_id: client?.id ?? null,
        client_nom: clientNom,
        template_id: (row.template_id || "").trim() || "import",
        template_titre: (row.template_titre || "").trim() || sujet,
        sujet,
        contenu: (row.contenu || "").trim(),
        message_personnalise: null,
        statut,
        mode_envoi,
        date_creation: nowIso,
        date_envoi: statut === "envoye" || statut === "accuse" ? nowIso : null,
        notes: (row.notes || "").trim() || null,
      };

      try {
        const { error } = await supabase.from("courriers").insert(payload);
        if (error) throw error;
        success++;
      } catch {
        errors.push(`Ligne ${lineNum} : échec de l'enregistrement du courrier.`);
      }
    }

    if (success > 0) {
      queryClient.invalidateQueries({ queryKey: ["courriers"] });
    }
    return { success, errors };
  };

  return (
    <div className={`flex gap-2 ${isMobile ? "flex-col w-full" : ""}`}>
      <DataImportButton
        entityLabel="courriers"
        fileBaseName="courriers"
        columns={IMPORT_COLUMNS}
        onImport={handleImport}
        isMobile={isMobile}
        size="sm"
      />
      <DataExportButton
        data={records}
        columns={EXPORT_COLUMNS}
        fileBaseName="courriers"
        isMobile={isMobile}
        size="sm"
      />
    </div>
  );
}
