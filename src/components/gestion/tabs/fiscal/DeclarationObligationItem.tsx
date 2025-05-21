
import React, { useEffect } from "react";
import { DeclarationObligationStatus, DeclarationPeriodicity } from "@/hooks/fiscal/types";
import { DeclarationHeader } from "./declaration/DeclarationHeader";
import { DeposeSection } from "./declaration/DeposeSection";
import { ObservationsSection } from "./declaration/ObservationsSection";
import AttachmentSection from "./declaration/AttachmentSection";

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
  const [expanded, setExpanded] = React.useState(false);

  // Update periodicity when component mounts or when periodicity changes
  useEffect(() => {
    if (status?.periodicity !== periodicity) {
      onStatusChange(keyName, "periodicity", periodicity);
    }
  }, [keyName, status, periodicity, onStatusChange]);

  const handleAssujettiChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} assujetti change:`, checked);
      onStatusChange(keyName, "assujetti", checked);
      
      // If turning off assujetti, also turn off depose
      if (!checked && status?.depose) {
        onStatusChange(keyName, "depose", false);
      }
    }
  };

  const handleDeposeChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} depose change:`, checked);
      onStatusChange(keyName, "depose", checked);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(keyName, "dateDepot", e.target.value);
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStatusChange(keyName, "observations", e.target.value);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="border p-4 rounded-md bg-background">
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
        <div className="mt-4 pl-6 space-y-3">
          <DeposeSection
            keyName={keyName}
            isDepose={Boolean(status?.depose)}
            dateDepot={status?.dateDepot}
            onDeposeChange={handleDeposeChange}
            onDateChange={handleDateChange}
          />
          
          {expanded && (
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
                onAttachmentUpload={(obligation, attachmentType, filePath) => onAttachmentChange(obligation, attachmentType, filePath)}
                onAttachmentDelete={(obligation, attachmentType) => onAttachmentChange(obligation, attachmentType, null)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
