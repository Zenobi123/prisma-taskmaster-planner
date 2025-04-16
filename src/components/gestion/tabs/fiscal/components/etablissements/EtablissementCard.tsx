
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Etablissement } from "@/types/client";
import { EtablissementForm } from "./EtablissementForm";

interface EtablissementCardProps {
  etablissement: Etablissement;
  index: number;
  canDelete: boolean;
  updateEtablissement: (index: number, field: keyof Etablissement, value: string | number) => void;
  removeEtablissement: (index: number) => void;
}

export function EtablissementCard({ 
  etablissement, 
  index, 
  canDelete, 
  updateEtablissement, 
  removeEtablissement 
}: EtablissementCardProps) {
  return (
    <div className="p-4 border rounded-lg space-y-4 relative">
      {canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeEtablissement(index)}
          className="absolute top-2 right-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      <EtablissementForm
        etablissement={etablissement}
        index={index}
        updateEtablissement={updateEtablissement}
      />
    </div>
  );
}
