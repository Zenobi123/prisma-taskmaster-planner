
import React from "react";
import { AttachmentUploader } from "../AttachmentUploader";
import { DeclarationObligationStatus } from "@/hooks/fiscal/types";

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
  // Handle file upload for declaration items
  const handleFileUpload = (attachmentType: string, filePath: string | null) => {
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
          attachmentLabel="Déclaration"
          filePath={status.attachments?.declaration}
          onFileUploaded={(filePath) => handleFileUpload("declaration", filePath)}
        />
        
        {/* Receipt document */}
        <AttachmentUploader
          clientId={clientId}
          year={selectedYear}
          obligationType={keyName}
          attachmentType="receipt"
          attachmentLabel="Accusé de réception"
          filePath={status.attachments?.receipt}
          onFileUploaded={(filePath) => handleFileUpload("receipt", filePath)}
        />
        
        {/* Payment document */}
        <AttachmentUploader
          clientId={clientId}
          year={selectedYear}
          obligationType={keyName}
          attachmentType="payment"
          attachmentLabel="Justificatif de paiement"
          filePath={status.attachments?.payment}
          onFileUploaded={(filePath) => handleFileUpload("payment", filePath)}
        />
        
        {/* Additional document */}
        <AttachmentUploader
          clientId={clientId}
          year={selectedYear}
          obligationType={keyName}
          attachmentType="additional"
          attachmentLabel="Document supplémentaire"
          filePath={status.attachments?.additional}
          onFileUploaded={(filePath) => handleFileUpload("additional", filePath)}
        />
      </div>
    </div>
  );
};
