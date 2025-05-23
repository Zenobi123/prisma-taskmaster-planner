
import React, { useEffect, useState, useCallback } from "react";
import { DeclarationObligationStatus, DeclarationPeriodicity } from "@/hooks/fiscal/types";
import { DeclarationHeader } from "./declaration/DeclarationHeader";
import { DeposeSection } from "./declaration/DeposeSection";
import { ObservationsSection } from "./declaration/ObservationsSection";
import AttachmentSection from "./declaration/AttachmentSection";
import { Card, CardContent } from "@/components/ui/card";

interface DeclarationObligationItemProps {
  title: string;
  keyName: string;
  status: DeclarationObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
  periodicity?: DeclarationPeriodicity;
}

export const DeclarationObligationItem: React.FC<DeclarationObligationItemProps> = ({
  title,
  keyName,
  status,
  onStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear,
  periodicity = "annuelle"
}) => {
  const [expanded, setExpanded] = useState(false);

  // Update periodicity when component mounts or when periodicity changes
  useEffect(() => {
    if (status?.periodicity !== periodicity) {
      onStatusChange(keyName, "periodicity", periodicity);
    }
  }, [keyName, status, periodicity, onStatusChange]);

  // Fonctions optimisées avec useCallback
  const handleAssujettiChange = useCallback((checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} assujetti change:`, checked);
      onStatusChange(keyName, "assujetti", checked);
      
      // If turning off assujetti, also turn off depose
      if (!checked && status?.depose) {
        onStatusChange(keyName, "depose", false);
      }
      
      // Si on active, développer automatiquement
      if (checked && !expanded) {
        setExpanded(true);
      }
    }
  }, [keyName, status?.depose, expanded, onStatusChange]);

  const handleDeposeChange = useCallback((checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} depose change:`, checked);
      onStatusChange(keyName, "depose", checked);
      
      // Si on coche "déposé", ouvrir automatiquement le panel d'options
      if (checked && !expanded) {
        setExpanded(true);
      }
    }
  }, [keyName, expanded, onStatusChange]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(keyName, "dateDepot", e.target.value);
  }, [keyName, onStatusChange]);

  const handleObservationsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStatusChange(keyName, "observations", e.target.value);
  }, [keyName, onStatusChange]);

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Arrêter la propagation des événements
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card 
      className="border p-4 rounded-md bg-background hover:bg-background" 
      onClick={stopPropagation}
    >
      <DeclarationHeader
        title={title}
        keyName={keyName}
        isAssujetti={Boolean(status?.assujetti)}
        expanded={expanded}
        periodicity={periodicity}
        onAssujettiChange={handleAssujettiChange}
        onToggleExpand={handleToggleExpand}
      />
      
      {status?.assujetti && (
        <CardContent className="mt-4 pl-6 space-y-3 pt-4">
          <DeposeSection
            keyName={keyName}
            isDepose={Boolean(status?.depose)}
            dateDepot={status?.dateDepot}
            onDeposeChange={handleDeposeChange}
            onDateChange={handleDateChange}
          />
          
          {(expanded || status?.depose) && (
            <>
              <ObservationsSection
                keyName={keyName}
                observations={status?.observations}
                onObservationsChange={handleObservationsChange}
              />

              <AttachmentSection
                obligationName={keyName}
                clientId={clientId}
                selectedYear={selectedYear}
                existingAttachments={status?.attachements}
                onAttachmentUpload={(obligation, attachmentType, filePath) => {
                  onAttachmentChange(obligation, attachmentType, filePath);
                }}
                onAttachmentDelete={(obligation, attachmentType) => {
                  onAttachmentChange(obligation, attachmentType, null);
                }}
              />
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};
