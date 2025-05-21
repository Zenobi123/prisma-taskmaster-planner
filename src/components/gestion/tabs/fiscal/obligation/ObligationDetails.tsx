
import React from "react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { QuarterlyPaymentsSection } from "../components/QuarterlyPaymentsSection";
import { ObservationsSection } from "../components/ObservationsSection";
import AttachmentSection from "../declaration/AttachmentSection";

interface ObligationDetailsProps {
  keyName: string;
  status: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
}

export const ObligationDetails: React.FC<ObligationDetailsProps> = ({
  keyName,
  status,
  onStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear
}) => {
  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStatusChange(keyName, "observations", e.target.value);
  };

  return (
    <div className="space-y-3">
      {keyName === "igs" && (
        <QuarterlyPaymentsSection
          status={status}
          onStatusChange={onStatusChange}
          keyName={keyName}
        />
      )}
      
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
    </div>
  );
};
