
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonsProps {
  onExportPdf: () => void;
  onExportExcel: () => void;
}

export const ExportButtons = ({ onExportPdf, onExportExcel }: ExportButtonsProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExportPdf}
        className="flex items-center gap-1"
      >
        <Download className="w-4 h-4 mr-1" />
        Exporter en PDF
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExportExcel}
        className="flex items-center gap-1"
      >
        <Download className="w-4 h-4 mr-1" />
        Exporter en Excel
      </Button>
    </div>
  );
};
