
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@/types/client";
import { exportClientsToPDF, exportClientsToExcel } from "@/utils/clientExportUtils";
import { FileText, Download, FileSpreadsheet, Printer } from "lucide-react";

interface ExportClientsButtonProps {
  clients: Client[];
  showArchived: boolean;
}

export function ExportClientsButton({ clients, showArchived }: ExportClientsButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-2 gap-2">
          <Printer className="h-4 w-4" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportClientsToPDF(clients, showArchived)}>
          <FileText className="mr-2 h-4 w-4" />
          Exporter en PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportClientsToExcel(clients, showArchived)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exporter en Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
