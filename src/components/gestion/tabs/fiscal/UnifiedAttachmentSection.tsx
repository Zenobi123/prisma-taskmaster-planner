
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { X, FileIcon, Upload, Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  uploadFiscalAttachment, 
  getFiscalAttachmentUrl, 
  deleteFiscalAttachment,
  AttachmentType
} from "@/services/fiscalAttachmentService";
import { toast } from "sonner";

interface AttachmentConfig {
  type: AttachmentType;
  label: string;
  required?: boolean;
}

interface UnifiedAttachmentSectionProps {
  obligationName: string;
  obligationType: 'tax' | 'declaration';
  existingAttachments?: Record<string, string>;
  onAttachmentUpload: (obligationName: string, attachmentType: string, filePath: string) => void;
  onAttachmentDelete: (obligationName: string, attachmentType: string) => void;
  clientId: string;
  selectedYear: string;
  maxFileSizeMB?: number;
}

// Configuration des types d'attachements selon le type d'obligation
const getAttachmentConfigs = (obligationType: 'tax' | 'declaration'): AttachmentConfig[] => {
  if (obligationType === 'tax') {
    return [
      { type: "declaration", label: "Déclaration ou Avis d'imposition" },
      { type: "receipt", label: "Reçu de paiement" },
      { type: "payment", label: "Quittance de paiement" },
      { type: "additional", label: "Pièces complémentaires" }
    ];
  } else {
    return [
      { type: "receipt", label: "Reçu de paiement" },
      { type: "additional", label: "Justificatif" },
      { type: "declaration", label: "Formulaire" }
    ];
  }
};

export const UnifiedAttachmentSection: React.FC<UnifiedAttachmentSectionProps> = ({
  obligationName,
  obligationType,
  existingAttachments = {},
  onAttachmentUpload,
  onAttachmentDelete,
  clientId,
  selectedYear,
  maxFileSizeMB = 5
}) => {
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});
  const [downloadingStates, setDownloadingStates] = useState<Record<string, boolean>>({});
  const [deletingStates, setDeletingStates] = useState<Record<string, boolean>>({});
  
  const attachmentConfigs = getAttachmentConfigs(obligationType);
  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

  const handleFileUpload = useCallback(async (attachmentType: AttachmentType, file: File) => {
    if (!file) return;
    
    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`La taille du fichier dépasse la limite de ${maxFileSizeMB}MB`);
      return;
    }
    
    setUploadingStates(prev => ({ ...prev, [attachmentType]: true }));
    
    try {
      const filePath = await uploadFiscalAttachment(
        file,
        clientId,
        selectedYear,
        obligationName,
        attachmentType
      );
      
      if (filePath) {
        onAttachmentUpload(obligationName, attachmentType, filePath);
        toast.success("Fichier téléchargé avec succès");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    } finally {
      setUploadingStates(prev => ({ ...prev, [attachmentType]: false }));
    }
  }, [clientId, selectedYear, obligationName, onAttachmentUpload, maxSizeBytes, maxFileSizeMB]);

  const handleFileDownload = useCallback(async (attachmentType: string, filePath: string) => {
    setDownloadingStates(prev => ({ ...prev, [attachmentType]: true }));
    
    try {
      const url = await getFiscalAttachmentUrl(filePath);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast.error("Impossible d'accéder au fichier");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    } finally {
      setDownloadingStates(prev => ({ ...prev, [attachmentType]: false }));
    }
  }, []);

  const handleFileDelete = useCallback(async (attachmentType: string, filePath: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      return;
    }
    
    setDeletingStates(prev => ({ ...prev, [attachmentType]: true }));
    
    try {
      const success = await deleteFiscalAttachment(filePath);
      if (success) {
        onAttachmentDelete(obligationName, attachmentType);
        toast.success("Fichier supprimé avec succès");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Erreur lors de la suppression du fichier");
    } finally {
      setDeletingStates(prev => ({ ...prev, [attachmentType]: false }));
    }
  }, [obligationName, onAttachmentDelete]);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm mb-3">Pièces justificatives</h4>
      
      {attachmentConfigs.map(({ type, label }) => {
        const filePath = existingAttachments[type];
        const isUploading = uploadingStates[type];
        const isDownloading = downloadingStates[type];
        const isDeleting = deletingStates[type];
        
        return (
          <div key={type} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{label}</Label>
            
            {filePath ? (
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <FileIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-700 truncate flex-1">
                  {filePath.split('/').pop() || "Fichier"}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleFileDownload(type, filePath)}
                    disabled={isDownloading}
                    className="h-8 w-8 p-0"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">Télécharger</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleFileDelete(type, filePath)}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(type, file);
                      // Reset input
                      e.target.value = '';
                    }
                  }}
                  disabled={isUploading}
                  className="max-w-xs"
                />
                {isUploading && (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Téléchargement...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      <p className="text-xs text-muted-foreground">
        Formats acceptés: PDF, Word, Images. Taille max: {maxFileSizeMB}MB
      </p>
    </div>
  );
};
