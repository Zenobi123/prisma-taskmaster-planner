
import { useQueryClient } from "@tanstack/react-query";
import { DataExportButton } from "@/components/shared/DataExportButton";
import { DataImportButton, ImportResult } from "@/components/shared/DataImportButton";
import { DataColumn } from "@/utils/dataTransfer/dataExport";
import { ImportColumnSpec, ImportRow } from "@/utils/dataTransfer/dataImport";
import { Collaborateur, CollaborateurRole } from "@/types/collaborateur";
import { createCollaborateur } from "@/services/collaborateurService";

const VALID_ROLES: CollaborateurRole[] = [
  "expert-comptable",
  "assistant",
  "fiscaliste",
  "gestionnaire",
  "comptable",
];

const EXPORT_COLUMNS: DataColumn<Collaborateur>[] = [
  { key: "nom", label: "Nom", accessor: (c) => c.nom },
  { key: "prenom", label: "Prénom", accessor: (c) => c.prenom },
  { key: "email", label: "Email", accessor: (c) => c.email },
  { key: "poste", label: "Poste", accessor: (c) => c.poste },
  { key: "telephone", label: "Téléphone", accessor: (c) => c.telephone },
  { key: "niveauetude", label: "Niveau d'étude", accessor: (c) => c.niveauetude },
  { key: "dateentree", label: "Date d'entrée", accessor: (c) => c.dateentree },
  { key: "datenaissance", label: "Date de naissance", accessor: (c) => c.datenaissance },
  { key: "ville", label: "Ville", accessor: (c) => c.ville },
  { key: "quartier", label: "Quartier", accessor: (c) => c.quartier },
  { key: "statut", label: "Statut", accessor: (c) => c.statut },
];

const IMPORT_COLUMNS: ImportColumnSpec[] = [
  { key: "nom", label: "Nom", required: true, example: "Dupont" },
  { key: "prenom", label: "Prénom", required: true, example: "Jean" },
  { key: "email", label: "Email", required: true, example: "jean.dupont@example.com" },
  { key: "poste", label: "Poste", example: "comptable" },
  { key: "telephone", label: "Téléphone", example: "+237600000000" },
  { key: "niveauetude", label: "Niveau d'étude", example: "BAC+3" },
  { key: "dateentree", label: "Date d'entrée", example: "2024-01-15" },
  { key: "datenaissance", label: "Date de naissance", example: "1990-05-20" },
  { key: "ville", label: "Ville", example: "Douala" },
  { key: "quartier", label: "Quartier", example: "Akwa" },
  { key: "statut", label: "Statut", example: "actif" },
];

interface CollaborateurImportExportProps {
  collaborateurs: Collaborateur[];
  isMobile?: boolean;
}

export function CollaborateurImportExport({
  collaborateurs,
  isMobile,
}: CollaborateurImportExportProps) {
  const queryClient = useQueryClient();

  const handleImport = async (rows: ImportRow[]): Promise<ImportResult> => {
    const errors: string[] = [];
    let success = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2; // +1 en-tête, +1 base 1
      const nom = (row.nom || "").trim();
      const prenom = (row.prenom || "").trim();
      const email = (row.email || "").trim();

      if (!nom || !prenom || !email) {
        errors.push(`Ligne ${lineNum} : nom, prénom et email sont obligatoires.`);
        continue;
      }

      const rawPoste = (row.poste || "").trim().toLowerCase();
      let poste: CollaborateurRole = "comptable";
      if (rawPoste) {
        if (!VALID_ROLES.includes(rawPoste as CollaborateurRole)) {
          errors.push(
            `Ligne ${lineNum} : poste "${row.poste}" invalide (attendu : ${VALID_ROLES.join(", ")}).`
          );
          continue;
        }
        poste = rawPoste as CollaborateurRole;
      }

      const statut = (row.statut || "").trim().toLowerCase() === "inactif"
        ? "inactif"
        : "actif";

      try {
        await createCollaborateur({
          nom,
          prenom,
          email,
          poste,
          telephone: (row.telephone || "").trim(),
          niveauetude: (row.niveauetude || "").trim(),
          dateentree: (row.dateentree || "").trim(),
          datenaissance: (row.datenaissance || "").trim(),
          ville: (row.ville || "").trim(),
          quartier: (row.quartier || "").trim(),
          statut,
          permissions: [],
          tachesencours: 0,
        });
        success++;
      } catch {
        errors.push(`Ligne ${lineNum} : échec de l'enregistrement (${email}).`);
      }
    }

    if (success > 0) {
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
    }
    return { success, errors };
  };

  return (
    <div className={`flex gap-2 ${isMobile ? "flex-col w-full" : ""}`}>
      <DataImportButton
        entityLabel="collaborateurs"
        fileBaseName="collaborateurs"
        columns={IMPORT_COLUMNS}
        onImport={handleImport}
        isMobile={isMobile}
      />
      <DataExportButton
        data={collaborateurs}
        columns={EXPORT_COLUMNS}
        fileBaseName="collaborateurs"
        isMobile={isMobile}
      />
    </div>
  );
}
