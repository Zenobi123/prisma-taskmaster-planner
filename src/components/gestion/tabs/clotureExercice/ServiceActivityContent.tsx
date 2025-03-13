
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceActivityTable } from "./serviceActivity/ServiceActivityTable";
import { useServiceActivity } from "./serviceActivity/useServiceActivity";
import { ServiceActivityContentProps } from "./serviceActivity/types";

export const ServiceActivityContent = ({ previousYear }: ServiceActivityContentProps) => {
  const { rows, addRow, removeRow, handleCellChange } = useServiceActivity();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Analyse du chiffre d'affaires pour l'activité de prestation de services
          {previousYear ? ` de l'exercice ${previousYear}` : ""}.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addRow}
          className="flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      <ServiceActivityTable 
        rows={rows}
        handleCellChange={handleCellChange}
        removeRow={removeRow}
      />
    </div>
  );
};
