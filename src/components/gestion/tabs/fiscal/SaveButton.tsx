
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface SaveButtonProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => Promise<boolean>;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  hasUnsavedChanges,
  isSaving,
  onSave
}) => {
  const handleSave = async () => {
    if (!hasUnsavedChanges || isSaving) return;
    await onSave();
  };

  return (
    <div className="flex justify-end">
      <Button
        onClick={handleSave}
        disabled={!hasUnsavedChanges || isSaving}
        className="flex items-center space-x-2"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span>
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </span>
      </Button>
    </div>
  );
};
