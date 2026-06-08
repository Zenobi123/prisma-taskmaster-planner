
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataExportButton } from "@/components/shared/DataExportButton";
import { DataImportButton, ImportResult } from "@/components/shared/DataImportButton";
import { DataColumn } from "@/utils/dataTransfer/dataExport";
import { ImportColumnSpec, ImportRow } from "@/utils/dataTransfer/dataImport";
import { parseDateInput } from "@/utils/dataTransfer/parseDateInput";
import { createTask, Task } from "@/services/taskService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { getClients } from "@/services/clientService";

/** Vue mission telle que produite par la page Missions. */
export interface MissionView {
  id: string;
  title: string;
  client: string;
  assignedTo: string;
  status: string;
  rawStartDate: string | null;
  rawEndDate: string | null;
}

const VALID_STATUSES: Task["status"][] = [
  "en_attente",
  "en_cours",
  "termine",
  "en_retard",
];

const EXPORT_COLUMNS: DataColumn<MissionView>[] = [
  { key: "titre", label: "Titre", accessor: (m) => m.title },
  { key: "client", label: "Client", accessor: (m) => m.client },
  { key: "collaborateur", label: "Collaborateur", accessor: (m) => m.assignedTo },
  { key: "statut", label: "Statut", accessor: (m) => m.status },
  {
    key: "date_debut",
    label: "Date de début",
    accessor: (m) => (m.rawStartDate ? m.rawStartDate.split("T")[0] : ""),
  },
  {
    key: "date_fin",
    label: "Date de fin",
    accessor: (m) => (m.rawEndDate ? m.rawEndDate.split("T")[0] : ""),
  },
];

const IMPORT_COLUMNS: ImportColumnSpec[] = [
  { key: "titre", label: "Titre", required: true, example: "Déclaration TVA mensuelle" },
  {
    key: "collaborateur",
    label: "Collaborateur",
    required: true,
    example: "Jean Dupont",
  },
  { key: "client", label: "Client", example: "Entreprise SARL" },
  { key: "statut", label: "Statut", example: "en_attente" },
  { key: "date_debut", label: "Date de début", example: "2024-06-01" },
  { key: "date_fin", label: "Date de fin", example: "2024-06-15" },
];

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

interface MissionImportExportProps {
  missions: MissionView[];
  isMobile?: boolean;
}

export function MissionImportExport({ missions, isMobile }: MissionImportExportProps) {
  const queryClient = useQueryClient();

  const { data: collaborateurs = [] } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });
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
      const title = (row.titre || "").trim();
      const collabRef = (row.collaborateur || "").trim();

      if (!title) {
        errors.push(`Ligne ${lineNum} : le titre est obligatoire.`);
        continue;
      }
      if (!collabRef) {
        errors.push(`Ligne ${lineNum} : le collaborateur est obligatoire.`);
        continue;
      }

      const target = normalize(collabRef);
      const collaborateur = collaborateurs.find((c) => {
        const fullName = normalize(`${c.prenom} ${c.nom}`);
        const reversed = normalize(`${c.nom} ${c.prenom}`);
        return (
          fullName === target ||
          reversed === target ||
          normalize(c.email) === target
        );
      });
      if (!collaborateur) {
        errors.push(
          `Ligne ${lineNum} : collaborateur "${collabRef}" introuvable.`
        );
        continue;
      }

      let clientId: string | undefined;
      const clientRef = (row.client || "").trim();
      if (clientRef) {
        const clientTarget = normalize(clientRef);
        const client = clients.find(
          (c) =>
            normalize(c.raisonsociale || "") === clientTarget ||
            normalize(c.nom || "") === clientTarget
        );
        clientId = client?.id;
      }

      const rawStatus = (row.statut || "").trim().toLowerCase() as Task["status"];
      const status = VALID_STATUSES.includes(rawStatus) ? rawStatus : "en_attente";

      try {
        await createTask({
          title,
          collaborateur_id: collaborateur.id,
          client_id: clientId,
          status,
          start_date: parseDateInput(row.date_debut),
          end_date: parseDateInput(row.date_fin),
        });
        success++;
      } catch {
        errors.push(`Ligne ${lineNum} : échec de l'enregistrement de la mission.`);
      }
    }

    if (success > 0) {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
    }
    return { success, errors };
  };

  return (
    <div className={`flex gap-2 ${isMobile ? "flex-col w-full" : ""}`}>
      <DataImportButton
        entityLabel="missions"
        fileBaseName="missions"
        columns={IMPORT_COLUMNS}
        onImport={handleImport}
        isMobile={isMobile}
        size="sm"
      />
      <DataExportButton
        data={missions}
        columns={EXPORT_COLUMNS}
        fileBaseName="missions"
        isMobile={isMobile}
        size="sm"
      />
    </div>
  );
}
