
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataExportButton } from "@/components/shared/DataExportButton";
import { DataImportButton, ImportResult } from "@/components/shared/DataImportButton";
import { DataColumn } from "@/utils/dataTransfer/dataExport";
import { ImportColumnSpec, ImportRow } from "@/utils/dataTransfer/dataImport";
import { parseDateInput } from "@/utils/dataTransfer/parseDateInput";
import { createTask, getTasks, Task } from "@/services/taskService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { getClients } from "@/services/clientService";

const EXPORT_COLUMNS: DataColumn<Task>[] = [
  { key: "titre", label: "Titre", accessor: (t) => t.title },
  {
    key: "client",
    label: "Client",
    accessor: (t) =>
      t.clients
        ? t.clients.type === "physique"
          ? t.clients.nom
          : t.clients.raisonsociale
        : "",
  },
  {
    key: "collaborateur",
    label: "Collaborateur",
    accessor: (t) =>
      t.collaborateurs ? `${t.collaborateurs.prenom} ${t.collaborateurs.nom}` : "",
  },
  {
    key: "date",
    label: "Date",
    accessor: (t) => (t.start_date ? t.start_date.split("T")[0] : ""),
  },
  { key: "heure_debut", label: "Heure de début", accessor: (t) => t.start_time || "" },
  { key: "heure_fin", label: "Heure de fin", accessor: (t) => t.end_time || "" },
  {
    key: "type",
    label: "Type",
    accessor: (t) => (t.title.toLowerCase().includes("réunion") ? "reunion" : "mission"),
  },
];

const IMPORT_COLUMNS: ImportColumnSpec[] = [
  { key: "titre", label: "Titre", required: true, example: "Réunion de suivi" },
  {
    key: "collaborateur",
    label: "Collaborateur",
    required: true,
    example: "Jean Dupont",
  },
  { key: "client", label: "Client", example: "Entreprise SARL" },
  { key: "date", label: "Date", required: true, example: "2024-06-10" },
  { key: "heure_debut", label: "Heure de début", example: "09:00" },
  { key: "heure_fin", label: "Heure de fin", example: "10:30" },
];

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

interface PlanningImportExportProps {
  isMobile?: boolean;
}

export function PlanningImportExport({ isMobile }: PlanningImportExportProps) {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
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
      const dateValue = parseDateInput(row.date);

      if (!title) {
        errors.push(`Ligne ${lineNum} : le titre est obligatoire.`);
        continue;
      }
      if (!collabRef) {
        errors.push(`Ligne ${lineNum} : le collaborateur est obligatoire.`);
        continue;
      }
      if (!dateValue) {
        errors.push(`Ligne ${lineNum} : la date est obligatoire ou invalide.`);
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
        errors.push(`Ligne ${lineNum} : collaborateur "${collabRef}" introuvable.`);
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

      try {
        await createTask({
          title,
          collaborateur_id: collaborateur.id,
          client_id: clientId,
          status: "en_attente",
          start_date: dateValue,
          end_date: dateValue,
          start_time: (row.heure_debut || "").trim() || undefined,
          end_time: (row.heure_fin || "").trim() || undefined,
        });
        success++;
      } catch {
        errors.push(`Ligne ${lineNum} : échec de l'enregistrement de l'événement.`);
      }
    }

    if (success > 0) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
    }
    return { success, errors };
  };

  return (
    <div className={`flex gap-2 ${isMobile ? "flex-col w-full" : ""}`}>
      <DataImportButton
        entityLabel="événements"
        fileBaseName="planning"
        columns={IMPORT_COLUMNS}
        onImport={handleImport}
        isMobile={isMobile}
        size="sm"
      />
      <DataExportButton
        data={tasks}
        columns={EXPORT_COLUMNS}
        fileBaseName="planning"
        isMobile={isMobile}
        size="sm"
      />
    </div>
  );
}
