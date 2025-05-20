
import React from "react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { exportToCSV, exportToPdf } from "@/utils/exports";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Printer } from "lucide-react";

interface ExportOptionsProps {
  events: Event[];
  date: Date | undefined;
}

export const ExportOptions = ({ events, date }: ExportOptionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => exportToCSV(events, date)}
          className="cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2" />
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => exportToPdf("Planning d'événements", events, `planning-${date?.toISOString().split('T')[0] || 'complet'}`)}
          className="cursor-pointer"
        >
          <Printer className="w-4 h-4 mr-2" />
          Exporter en PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
