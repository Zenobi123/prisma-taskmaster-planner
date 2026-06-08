
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Upload, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  ImportColumnSpec,
  ImportRow,
  downloadImportTemplate,
  getFileExtension,
  parseImportContent,
} from "@/utils/dataTransfer/dataImport";

export interface ImportResult {
  success: number;
  errors: string[];
}

interface DataImportButtonProps {
  /** Libellé de l'entité au pluriel, ex. « collaborateurs ». */
  entityLabel: string;
  /** Nom de base utilisé pour le modèle d'import. */
  fileBaseName: string;
  /** Spécification des colonnes (pour le modèle et l'aperçu). */
  columns: ImportColumnSpec[];
  /** Effectue l'import réel et renvoie un résumé. */
  onImport: (rows: ImportRow[]) => Promise<ImportResult>;
  isMobile?: boolean;
  size?: "default" | "sm";
  label?: string;
}

const PREVIEW_LIMIT = 8;

/**
 * Bouton générique d'import (CSV, JSON, TXT) avec aperçu et modèle.
 */
export function DataImportButton({
  entityLabel,
  fileBaseName,
  columns,
  onImport,
  isMobile,
  size = "default",
  label = "Importer",
}: DataImportButtonProps) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewColumns = columns.slice(0, 6);

  const reset = () => {
    setRows([]);
    setParseError(null);
    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = getFileExtension(file.name);
    if (!["csv", "json", "txt"].includes(extension)) {
      toast.error("Veuillez sélectionner un fichier CSV, JSON ou TXT.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseImportContent(text, extension);
        if (parsed.length === 0) {
          setParseError("Le fichier ne contient aucune ligne de données.");
          setRows([]);
          return;
        }
        // Vérifie la présence des colonnes obligatoires.
        const missing = columns
          .filter((col) => col.required)
          .filter((col) => !(col.key in parsed[0]))
          .map((col) => col.key);
        if (missing.length > 0) {
          setParseError(
            `Colonnes obligatoires manquantes : ${missing.join(", ")}.`
          );
          setRows([]);
          return;
        }
        setParseError(null);
        setRows(parsed);
      } catch (err) {
        setParseError(
          err instanceof Error ? err.message : "Erreur lors de l'analyse du fichier."
        );
        setRows([]);
      }
    };
    reader.onerror = () => toast.error("Erreur lors de la lecture du fichier.");
    reader.readAsText(file, "UTF-8");
  };

  const handleImport = async () => {
    if (rows.length === 0) {
      toast.error("Aucune donnée valide à importer.");
      return;
    }
    setIsImporting(true);
    try {
      const result = await onImport(rows);
      if (result.success > 0) {
        toast.success(`${result.success} ${entityLabel} importé(s) avec succès.`);
      }
      if (result.errors.length > 0) {
        result.errors.slice(0, 5).forEach((msg) => toast.error(msg));
        if (result.success === 0) {
          toast.error(`Aucun ${entityLabel} importé.`);
        }
      }
      handleClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de l'import."
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size={size}
        className={`flex items-center gap-2 ${isMobile ? "w-full justify-center" : ""}`}
        onClick={() => setOpen(true)}
      >
        <Upload className="h-4 w-4" />
        {label}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) handleClose();
          else setOpen(true);
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-4xl overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              Importer des {entityLabel}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Importez vos {entityLabel} depuis un fichier CSV, JSON ou TXT.
              Téléchargez le modèle pour respecter le format attendu.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 sm:py-4">
            <div>
              <Button
                variant="link"
                className="flex items-center gap-2 p-0 h-auto text-xs sm:text-sm"
                onClick={() => downloadImportTemplate(columns, fileBaseName)}
              >
                <Download className="h-4 w-4" />
                Télécharger le modèle (CSV)
              </Button>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">
                Sélectionner un fichier (CSV, JSON ou TXT)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>

            {parseError && (
              <div className="rounded-md bg-destructive/10 p-3 text-xs sm:text-sm text-destructive">
                {parseError}
              </div>
            )}

            {rows.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-medium mb-2">
                  Aperçu ({rows.length} ligne{rows.length > 1 ? "s" : ""})
                </p>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {previewColumns.map((col) => (
                          <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.slice(0, PREVIEW_LIMIT).map((row, index) => (
                        <TableRow key={index}>
                          {previewColumns.map((col) => (
                            <TableCell key={col.key}>
                              {row[col.key] || "-"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {rows.length > PREVIEW_LIMIT && (
                  <p className="text-xs text-muted-foreground mt-1">
                    … et {rows.length - PREVIEW_LIMIT} ligne(s) supplémentaire(s).
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Annuler
            </Button>
            <Button
              onClick={handleImport}
              disabled={rows.length === 0 || isImporting}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting
                ? "Import en cours…"
                : `Importer ${rows.length > 0 ? `(${rows.length})` : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
