
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Save } from "lucide-react";
import { FiscalBulkUpdateButton } from '@/components/gestion/tabs/fiscal/FiscalBulkUpdateButton';

interface ObligationToolbarProps {
  onSave: () => Promise<void>;
  onRefresh: () => void;
  onBulkUpdate: () => Promise<void>;
  isUpdating: boolean;
  isSaving: boolean;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

export const ObligationToolbar: React.FC<ObligationToolbarProps> = ({
  onSave, 
  onRefresh, 
  onBulkUpdate,
  isUpdating,
  isSaving,
  isLoading,
  hasUnsavedChanges
}) => {
  return (
    <div className="flex items-center gap-2">
      <FiscalBulkUpdateButton 
        isLoading={isUpdating} 
        onUpdate={onBulkUpdate} 
      />
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Actualiser
      </Button>
      <Button 
        onClick={onSave} 
        disabled={isSaving || isLoading || !hasUnsavedChanges}
      >
        <Save className="mr-2 h-4 w-4" />
        Enregistrer
      </Button>
    </div>
  );
};
