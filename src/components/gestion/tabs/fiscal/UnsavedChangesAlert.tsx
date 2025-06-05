
import React from "react";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesAlertProps {
  hasUnsavedChanges: boolean;
}

export const UnsavedChangesAlert: React.FC<UnsavedChangesAlertProps> = ({
  hasUnsavedChanges
}) => {
  if (!hasUnsavedChanges) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-center space-x-2">
      <AlertTriangle className="h-5 w-5" />
      <span>
        Vous avez des modifications non enregistrées. Utilisez le bouton d'enregistrement ci-dessous pour les sauvegarder.
      </span>
    </div>
  );
};
