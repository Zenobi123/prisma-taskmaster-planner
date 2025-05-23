
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { Client } from "@/types/client";
import { exportClientsToCSV, exportClientsToJSON, exportClientsToXLS } from "@/utils/exports";

interface ClientExportButtonProps {
  clients: Client[];
  isMobile?: boolean;
}

export function ClientExportButton({ clients, isMobile }: ClientExportButtonProps) {
  // Fonction qui détermine le nom du fichier avec la date actuelle
  const getFileName = () => {
    const date = new Date().toISOString().split('T')[0];
    return `clients_${date}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center mt-2' : ''}`}
        >
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => exportClientsToCSV(clients, getFileName())}>
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportClientsToXLS(clients, getFileName())}>
          Exporter en Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportClientsToJSON(clients, getFileName())}>
          Exporter en JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
