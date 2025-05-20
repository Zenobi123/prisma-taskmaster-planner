import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input"
import { storageService } from '@/services/storageService';
import { useToast } from "@/components/ui/use-toast"
import { X } from 'lucide-react';

interface AttachmentSectionProps {
  obligationName: string;
  existingAttachments?: Record<string, string>;
  onAttachmentUpload: (obligationName: string, attachmentType: string, filePath: string) => void;
  onAttachmentDelete: (obligationName: string, attachmentType: string) => void;
}

type AttachmentType = "receipt" | "document" | "form";

const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  obligationName,
  existingAttachments,
  onAttachmentUpload,
  onAttachmentDelete
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast()

  const attachmentTypes: { [key: string]: string } = {
    receipt: "Reçu de paiement",
    document: "Justificatif",
    form: "Formulaire"
  };

  const handleUpload = useCallback(async (file: File | null, attachmentType: AttachmentType) => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier.",
      })
      return;
    }

    setUploading(true);
    try {
      const filePath = await storageService.uploadFile(file, `attachments/${obligationName}/${attachmentType}`);
      onAttachmentUpload(obligationName, "document", filePath);
      toast({
        title: "Succès",
        description: "Fichier envoyé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi du fichier. Veuillez réessayer.",
        variant: "destructive"
      })
    } finally {
      setUploading(false);
    }
  }, [obligationName, onAttachmentUpload, toast]);

  const handleDelete = useCallback((attachmentType: string) => {
    onAttachmentDelete(obligationName, attachmentType);
  }, [obligationName, onAttachmentDelete]);

  return (
    <div className="space-y-4">
      {Object.entries(attachmentTypes).map(([type, label]) => (
        <div key={type} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label htmlFor={`attachment-${type}`} className="text-sm font-medium text-gray-700">{label}:</label>
            <FileInput
              id={`attachment-${type}`}
              accept=".pdf,.jpg,.jpeg,.png"
              onUpload={(file) => handleUpload(file, type as AttachmentType)}
              uploading={uploading}
            />
          </div>
          {existingAttachments && existingAttachments[type] ? (
            <div className="flex items-center space-x-2">
              <a href={existingAttachments[type]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                Voir
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(type)}
                className="hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Aucun fichier</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttachmentSection;
