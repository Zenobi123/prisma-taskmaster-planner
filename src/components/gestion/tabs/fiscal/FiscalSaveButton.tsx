
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface FiscalSaveButtonProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => Promise<boolean>;
}

export const FiscalSaveButton: React.FC<FiscalSaveButtonProps> = ({
  hasUnsavedChanges,
  isSaving,
  onSave
}) => {
  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleSave}
        disabled={!hasUnsavedChanges || isSaving}
        className={`${hasUnsavedChanges && !isSaving
          ? 'bg-primary text-white hover:bg-primary/90' 
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </>
        )}
      </Button>
    </div>
  );
};
