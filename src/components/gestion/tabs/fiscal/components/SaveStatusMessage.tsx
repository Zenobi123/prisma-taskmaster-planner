
import React from 'react';
import { CheckCircle, AlertTriangle } from "lucide-react";

interface SaveStatusMessageProps {
  saveAttempts: number;
  lastSaveSuccess: boolean;
}

export const SaveStatusMessage: React.FC<SaveStatusMessageProps> = ({
  saveAttempts,
  lastSaveSuccess
}) => {
  if (saveAttempts === 0) {
    return null;
  }

  return (
    <div className={`mt-4 p-4 rounded-md flex items-center ${lastSaveSuccess ? 'bg-green-50' : 'bg-amber-50'}`}>
      {lastSaveSuccess ? (
        <>
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-sm text-green-700">
            Les modifications ont été enregistrées avec succès à {new Date().toLocaleString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}.
          </p>
        </>
      ) : (
        <>
          <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
          <p className="text-sm text-amber-700">
            Erreur lors de l'enregistrement des modifications. Veuillez réessayer.
          </p>
        </>
      )}
    </div>
  );
};
