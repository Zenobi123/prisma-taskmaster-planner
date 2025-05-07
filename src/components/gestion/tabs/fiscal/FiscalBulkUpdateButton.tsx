
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FiscalBulkUpdateButtonProps {
  isLoading: boolean;
  onUpdate: () => Promise<void>;
}

export const FiscalBulkUpdateButton: React.FC<FiscalBulkUpdateButtonProps> = ({
  isLoading,
  onUpdate
}) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onUpdate} 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Mise à jour...
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          Mise à jour en masse
        </>
      )}
    </Button>
  );
};
