
import React from 'react';
import { UnifiedAttachmentSection } from '../UnifiedAttachmentSection';

interface AttachmentSectionProps {
  obligationName: string;
  existingAttachments?: Record<string, string>;
  onAttachmentUpload: (obligationName: string, attachmentType: string, filePath: string) => void;
  onAttachmentDelete: (obligationName: string, attachmentType: string) => void;
  clientId?: string;
  selectedYear?: string;
  status?: any;
}

const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  obligationName,
  existingAttachments,
  onAttachmentUpload,
  onAttachmentDelete,
  clientId = '',
  selectedYear = new Date().getFullYear().toString(),
  status
}) => {
  // Determine if this is a tax or declaration obligation
  const obligationType = ['igs', 'patente', 'licence', 'bailCommercial', 'precompteLoyer', 'tpf'].includes(obligationName) 
    ? 'tax' as const 
    : 'declaration' as const;

  return (
    <UnifiedAttachmentSection
      obligationName={obligationName}
      obligationType={obligationType}
      existingAttachments={existingAttachments}
      onAttachmentUpload={onAttachmentUpload}
      onAttachmentDelete={onAttachmentDelete}
      clientId={clientId}
      selectedYear={selectedYear}
    />
  );
};

export default AttachmentSection;
