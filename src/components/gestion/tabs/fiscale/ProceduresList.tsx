
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Link } from "lucide-react";

// Mock procedures
const fiscalProcedures = [
  {
    id: "demande-acf",
    name: "Demande d'attestation de conformité fiscale",
    description: "Procédure et documents requis",
  },
  {
    id: "reclamation",
    name: "Réclamation contentieuse",
    description: "Contestation d'un redressement fiscal",
  },
  {
    id: "redressement",
    name: "Procédure de redressement",
    description: "Étapes et recours disponibles",
  }
];

interface ProceduresListProps {
  onItemClick: (item: any) => void;
}

export function ProceduresList({ onItemClick }: ProceduresListProps) {
  return (
    <div className="space-y-3">
      {fiscalProcedures.map((proc) => (
        <Button 
          key={proc.id}
          variant="ghost" 
          className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
          onClick={() => onItemClick(proc)}
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
  );
}
