
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { DataColumn, ExportFormat, exportData } from "@/utils/dataTransfer/dataExport";

interface DataExportButtonProps<T> {
  data: T[];
  columns: DataColumn<T>[];
  /** Nom de base du fichier (la date du jour et l'extension sont ajoutées). */
  fileBaseName: string;
  isMobile?: boolean;
  label?: string;
  size?: "default" | "sm";
}

/**
 * Bouton générique d'export proposant les formats CSV, JSON et TXT.
 */
export function DataExportButton<T>({
  data,
  columns,
  fileBaseName,
  isMobile,
  label = "Exporter",
  size = "default",
}: DataExportButtonProps<T>) {
  const handleExport = (format: ExportFormat) => {
    if (!data.length) {
      toast.error("Aucune donnée à exporter.");
      return;
    }
    exportData(data, columns, format, fileBaseName);
    toast.success(`${data.length} élément(s) exporté(s) en ${format.toUpperCase()}.`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`flex items-center gap-2 ${isMobile ? "w-full justify-center" : ""}`}
        >
          <Download className="h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          Exporter en JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("txt")}>
          Exporter en TXT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
