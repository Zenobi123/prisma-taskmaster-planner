
import React, { useState, useCallback } from "react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { Card, CardContent } from "@/components/ui/card";
import { ObligationHeader } from "./obligation/ObligationHeader";
import { ObligationFields } from "./obligation/ObligationFields";
import { ObligationDetails } from "./obligation/ObligationDetails";

interface TaxObligationItemProps {
  title: string;
  keyName: string;
  status: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
}

export const TaxObligationItem: React.FC<TaxObligationItemProps> = ({
  title,
  keyName,
  status,
  onStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear
}) => {
  const [expanded, setExpanded] = useState(false);

  // Gestionnaires d'événements optimisés
  const handleAssujettiChange = useCallback((checked: boolean) => {
    console.log(`${keyName} assujetti change:`, checked);
    onStatusChange(keyName, "assujetti", checked);
    
    // Si on active, développer automatiquement
    if (checked && !expanded) {
      setExpanded(true);
    }
    
    // Si on désactive, désactiver aussi "payée"
    if (!checked && status?.payee) {
      onStatusChange(keyName, "payee", false);
    }
  }, [keyName, status?.payee, expanded, onStatusChange]);

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Arrêter la propagation des événements
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card className="border p-4 rounded-md bg-background" onClick={stopPropagation}>
      <ObligationHeader 
        title={title}
        keyName={keyName}
        isAssujetti={Boolean(status?.assujetti)}
        expanded={expanded}
        onAssujettiChange={handleAssujettiChange}
        toggleExpand={toggleExpand}
      />

      {status?.assujetti && (
        <CardContent className="mt-4 pl-6 space-y-3 pt-4">
          <ObligationFields
            keyName={keyName}
            status={status}
            onStatusChange={onStatusChange}
          />

          {(expanded || status?.payee) && (
            <ObligationDetails
              keyName={keyName}
              status={status}
              onStatusChange={onStatusChange}
              onAttachmentChange={onAttachmentChange}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};
