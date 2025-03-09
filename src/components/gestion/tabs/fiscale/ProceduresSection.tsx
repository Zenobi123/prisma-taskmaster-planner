
import React from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileText, Link } from "lucide-react";
import { FiscalProcedure } from "./types";
import { toast } from "@/hooks/use-toast";

interface ProceduresSectionProps {
  procedures: FiscalProcedure[];
}

export const ProceduresSection: React.FC<ProceduresSectionProps> = ({ procedures }) => {
  const handleItemClick = (proc: FiscalProcedure) => {
    console.log("Procedure clicked:", proc);
    toast({
      title: "Procédure sélectionnée",
      description: `Vous avez sélectionné: ${proc.name}`,
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
        <ClipboardList size={20} className="text-primary" />
        Procédures courantes
      </h3>
      <div className="space-y-3">
        {procedures.map((proc) => (
          <Button 
            key={proc.id}
            variant="ghost" 
            className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
            onClick={() => handleItemClick(proc)}
          >
            <FileText size={20} className="text-primary mt-0.5" />
            <div className="text-left">
              <div className="font-medium flex items-center gap-1">
                {proc.name}
                <Link size={14} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{proc.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
