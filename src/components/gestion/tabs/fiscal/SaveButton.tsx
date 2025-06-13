
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface SaveButtonProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  lastSaveTime?: Date | null;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  hasUnsavedChanges,
  isSaving,
  onSave,
  lastSaveTime
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {lastSaveTime && (
          <>
            <Clock className="h-4 w-4" />
            <span>
              Dernière sauvegarde : {formatDistanceToNow(lastSaveTime, { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </>
        )}
      </div>
      
      <Button 
        onClick={onSave}
        disabled={!hasUnsavedChanges || isSaving}
        className={`min-w-[200px] ${hasUnsavedChanges 
          ? 'bg-primary hover:bg-primary/90' 
          : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </Button>
    </div>
  );
};
