
import React from "react";

interface SaveButtonProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  hasUnsavedChanges,
  isSaving,
  onSave
}) => {
  return (
    <div className="flex justify-end">
      <button 
        className={`px-4 py-2 rounded-md font-medium ${hasUnsavedChanges 
          ? 'bg-primary text-white hover:bg-primary-hover' 
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        disabled={!hasUnsavedChanges || isSaving}
        onClick={onSave}
      >
        {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </div>
  );
};
