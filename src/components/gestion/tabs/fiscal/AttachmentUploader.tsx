
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileUp, FileDown, Loader2, X, Check, FileIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  uploadFiscalAttachment, 
  getFiscalAttachmentUrl, 
  deleteFiscalAttachment,
  AttachmentType
} from "@/services/fiscalAttachmentService";
import { toast } from "sonner";

export interface AttachmentUploaderProps {
  clientId: string;
  year: string;
  obligationType: string;
  attachmentType: AttachmentType;
  attachmentLabel: string;
  filePath: string | undefined;
  onFileUploaded: (filePath: string | null) => void;
  maxFileSizeMB?: number;
}

export function AttachmentUploader({
  clientId,
  year,
  obligationType,
  attachmentType,
  attachmentLabel,
  filePath,
  onFileUploaded,
  maxFileSizeMB = 5
}: AttachmentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`La taille du fichier dépasse la limite de ${maxFileSizeMB}MB`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    // Upload file
    setIsUploading(true);
    try {
      const path = await uploadFiscalAttachment(
        file, 
        clientId,
        year,
        obligationType,
        attachmentType
      );
      
      if (path) {
        onFileUploaded(path);
        toast.success("Fichier téléchargé avec succès");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  // Handle file download
  const handleDownload = async () => {
    if (!filePath) return;
    
    setIsDownloading(true);
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
      setIsDownloading(false);
    }
  };
  
  // Handle file deletion
  const handleDelete = async () => {
    if (!filePath) return;
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const success = await deleteFiscalAttachment(filePath);
      if (success) {
        onFileUploaded(null);
        toast.success("Fichier supprimé avec succès");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Erreur lors de la suppression du fichier");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>{attachmentLabel}</Label>
      
      {/* Show file info or upload button */}
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
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-8 w-8 p-0"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              <span className="sr-only">Télécharger</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
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
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
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
      
      <p className="text-xs text-muted-foreground">
        Formats acceptés: PDF, Word, Images. Taille max: {maxFileSizeMB}MB
      </p>
    </div>
  );
}
