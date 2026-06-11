
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Client } from "@/types/client";
import { exportClientsToCSV, exportClientsToJSON, exportClientsToXLS, exportClientsToText } from "@/utils/exports";
import { exportClientsVanilla } from "@/services/vanillaTransferService";
import { slugifyClientName } from "@/utils/vanillaTransfer/envelope";
import { VanillaEnvelope } from "@/utils/vanillaTransfer/types";

interface ClientExportButtonProps {
  clients: Client[];
  isMobile?: boolean;
}

function downloadEnvelope(envelope: VanillaEnvelope, fileName: string) {
  const blob = new Blob([JSON.stringify(envelope, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function ClientExportButton({ clients, isMobile }: ClientExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Fonction qui détermine le nom du fichier avec la date actuelle
  const getFileName = () => {
    const date = new Date().toISOString().split('T')[0];
    return `clients_${date}`;
  };

  // Export au format PRISMA-CLIENTS, réimportable dans l'application vanilla.
  const handleVanillaExport = async (withHistory: boolean) => {
    if (clients.length === 0) {
      toast.error("Aucun client à exporter.");
      return;
    }
    setIsExporting(true);
    try {
      const envelope = await exportClientsVanilla(clients, withHistory);
      const date = new Date().toISOString().split("T")[0];
      const fileName =
        withHistory && clients.length === 1
          ? `client_${slugifyClientName(clients[0].nom || clients[0].raisonsociale)}_${date}.json`
          : `clients_${withHistory ? "historique_" : ""}${date}.json`;
      downloadEnvelope(envelope, fileName);
      const total = withHistory
        ? Object.values(envelope.historique ?? {}).reduce(
            (s, arr) => s + (Array.isArray(arr) ? arr.length : 0),
            0,
          )
        : 0;
      toast.success(
        `${clients.length} client(s) exporté(s) au format PRISMA${withHistory ? ` avec ${total} opération(s) d'historique` : ""}.`,
      );
    } catch (error) {
      toast.error(
        `Échec de l'export : ${error instanceof Error ? error.message : "erreur inconnue"}`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center mt-2' : ''}`}
          disabled={isExporting}
        >
          {isExporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={() => exportClientsToCSV(clients, getFileName())}>
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportClientsToXLS(clients, getFileName())}>
          Exporter en Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportClientsToJSON(clients, getFileName())}>
          Exporter en JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportClientsToText(clients, getFileName())}>
          Exporter en texte
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Format PRISMA (application vanilla)
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleVanillaExport(false)}>
          Export PRISMA (fiches clients)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleVanillaExport(true)}>
          Export PRISMA + historique
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
