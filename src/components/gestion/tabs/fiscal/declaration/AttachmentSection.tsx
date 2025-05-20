
import React from "react";
import { DeclarationObligationStatus } from "@/hooks/fiscal/types";
import { AttachmentUploader } from "../AttachmentUploader";

interface AttachmentSectionProps {
  status: DeclarationObligationStatus;
  keyName: string;
  clientId: string;
  selectedYear: string;
  onAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
}

export const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  status,
  keyName,
  clientId,
  selectedYear,
  onAttachmentChange
}) => {
  // Handle file upload for declarations
  const handleAttachmentChange = (attachmentType: string, filePath: string | null) => {
    onAttachmentChange(keyName, attachmentType, filePath);
  };

  return (
    <div className="pt-2 border-t mt-4">
      <h4 className="text-sm font-medium mb-3">Pièces jointes</h4>
      <div className="space-y-4">
        {/* Declaration document */}
        <AttachmentUploader
          clientId={clientId}
          year={selectedYear}
          obligationType={keyName}
          attachmentType="declaration"
          attachmentLabel="Déclaration déposée"
          filePath={status.attachements?.declaration}
          onFileUploaded={(filePath) => 
            handleAttachmentChange("declaration", filePath)
          }
        />

        {/* Receipt document */}
        <AttachmentUploader
          clientId={clientId}
          year={selectedYear}
          obligationType={keyName}
          attachmentType="receipt"
          attachmentLabel="Reçu de dépôt"
          filePath={status.attachements?.receipt}
          onFileUploaded={(filePath) => 
            handleAttachmentChange("receipt", filePath)
          }
        />

        {/* Proof document */}
        <AttachmentUploader
          clientId={clientId}
          year={selectedYear}
          obligationType={keyName}
          attachmentType="proof"
          attachmentLabel="Attestation de non-redevance"
          filePath={status.attachements?.proof}
          onFileUploaded={(filePath) => 
            handleAttachmentChange("proof", filePath)
          }
        />

        {/* Additional document */}
        <AttachmentUploader
          clientId={clientId}
          year={selectedYear}
          obligationType={keyName}
          attachmentType="additional"
          attachmentLabel="Document supplémentaire"
          filePath={status.attachements?.additional}
          onFileUploaded={(filePath) => 
            handleAttachmentChange("additional", filePath)
          }
        />
      </div>
    </div>
  );
};
