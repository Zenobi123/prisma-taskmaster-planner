
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface UnsavedChangesAlertProps {
  hasUnsavedChanges: boolean;
  lastSaveTime?: Date | null;
}

export const UnsavedChangesAlert: React.FC<UnsavedChangesAlertProps> = ({ 
  hasUnsavedChanges, 
  lastSaveTime 
}) => {
  if (!hasUnsavedChanges && !lastSaveTime) return null;

  if (hasUnsavedChanges) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
        <AlertDescription className="text-yellow-800 text-xs sm:text-sm">
          <strong>Non sauvegardé</strong> <span className="hidden sm:inline">-</span> <span className="hidden sm:inline">N'oubliez pas d'enregistrer vos modifications avant de quitter.</span>
        </AlertDescription>
      </Alert>
    );
  }

  if (lastSaveTime) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
        <AlertDescription className="text-green-800 flex items-center gap-2 text-xs sm:text-sm">
          <span><strong>Sauvegardé</strong></span>
          <Clock className="h-3 w-3 shrink-0" />
          <span>
            {formatDistanceToNow(lastSaveTime, {
              addSuffix: true,
              locale: fr
            })}
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
