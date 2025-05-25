
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { uploadAttachment, getAttachmentUrl, deleteAttachment, AttachmentType } from '@/services/attachmentService';
import { useToast } from "@/components/ui/use-toast";
import { X } from 'lucide-react';

interface UnifiedAttachmentSectionProps {
  obligationName: string;
  existingAttachments?: Record<string, string>;
  onAttachmentUpload: (obligationName: string, attachmentType: string, filePath: string) => void;
  onAttachmentDelete: (obligationName: string, attachmentType: string) => void;
  clientId: string;
  selectedYear: string;
}

const UnifiedAttachmentSection: React.FC<UnifiedAttachmentSectionProps> = ({
  obligationName,
  existingAttachments,
  onAttachmentUpload,
  onAttachmentDelete,
  clientId,
  selectedYear
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const attachmentTypes: { [key: string]: string } = {
    receipt: "Reçu de paiement",
    document: "Justificatif",
    form: "Formulaire",
    declaration: "Déclaration",
    payment: "Preuve de paiement"
  };

  const handleUpload = useCallback(async (file: File | null, attachmentType: AttachmentType) => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier.",
      });
      return;
    }

    setUploading(true);
    try {
      const filePath = await uploadAttachment(file, clientId, selectedYear, obligationName, attachmentType);
      if (filePath) {
        onAttachmentUpload(obligationName, attachmentType, filePath);
        toast({
          title: "Succès",
          description: "Fichier envoyé avec succès.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi du fichier. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [obligationName, onAttachmentUpload, toast, clientId, selectedYear]);

  const handleDelete = useCallback(async (attachmentType: string) => {
    const filePath = existingAttachments?.[attachmentType];
    if (filePath) {
      const success = await deleteAttachment(filePath);
      if (success) {
        onAttachmentDelete(obligationName, attachmentType);
        toast({
          title: "Succès",
          description: "Fichier supprimé avec succès.",
        });
      }
    }
  }, [obligationName, onAttachmentDelete, existingAttachments, toast]);

  const handleView = useCallback(async (attachmentType: string) => {
    const filePath = existingAttachments?.[attachmentType];
    if (filePath) {
      const url = await getAttachmentUrl(filePath);
      if (url) {
        window.open(url, '_blank');
      }
    }
  }, [existingAttachments]);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm mb-2">Pièces justificatives</h4>
      {Object.entries(attachmentTypes).map(([type, label]) => (
        <div key={type} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label htmlFor={`attachment-${type}`} className="text-sm font-medium text-gray-700">{label}:</label>
            <div className="flex items-center">
              <input 
                id={`attachment-${type}`}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => handleUpload(e.target.files?.[0] || null, type as AttachmentType)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                disabled={uploading}
              />
              {uploading && <span className="ml-2 text-xs text-muted-foreground">Envoi en cours...</span>}
            </div>
          </div>
          {existingAttachments && existingAttachments[type] ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleView(type)}
                className="text-blue-500 hover:underline text-sm"
              >
                Voir
              </button>
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

export default UnifiedAttachmentSection;
