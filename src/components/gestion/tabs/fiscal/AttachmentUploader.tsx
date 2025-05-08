
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fiscalAttachmentService } from "@/services/fiscalAttachmentService";

interface AttachmentUploaderProps {
  clientId: string;
  year: string;
  obligationType: string;
  attachmentType: string;
  attachmentLabel: string;
  filePath: string | undefined;
  onFileUploaded: (filePath: string | null) => void;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  clientId,
  year,
  obligationType,
  attachmentType,
  attachmentLabel,
  filePath,
  onFileUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract and set the filename when the component mounts or filePath changes
  useEffect(() => {
    if (filePath) {
      setFileName(fiscalAttachmentService.getFileName(filePath));
    } else {
      setFileName("");
    }
  }, [filePath]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { path, error } = await fiscalAttachmentService.uploadFile(
        clientId,
        year,
        obligationType,
        attachmentType,
        file
      );

      if (error) {
        toast.error(`Erreur lors du téléversement: ${error.message}`);
        return;
      }

      onFileUploaded(path);
      setFileName(fiscalAttachmentService.getFileName(path));
      toast.success(`Pièce jointe "${attachmentLabel}" téléversée avec succès`);
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Erreur lors du téléversement du fichier");
    } finally {
      setIsUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async () => {
    if (!filePath) return;

    setIsDownloading(true);
    try {
      const { url, error } = await fiscalAttachmentService.getFileUrl(filePath);

      if (error) {
        toast.error(`Erreur lors du téléchargement: ${error.message}`);
        return;
      }

      // Create a temporary link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "document";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Téléchargement de "${attachmentLabel}" en cours`);
    } catch (err) {
      console.error("Error downloading file:", err);
      toast.error("Erreur lors du téléchargement du fichier");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!filePath) return;

    try {
      const { success, error } = await fiscalAttachmentService.deleteFile(filePath);

      if (error) {
        toast.error(`Erreur lors de la suppression: ${error.message}`);
        return;
      }

      if (success) {
        onFileUploaded(null);
        setFileName("");
        toast.success(`Pièce jointe "${attachmentLabel}" supprimée avec succès`);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Erreur lors de la suppression du fichier");
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{attachmentLabel}</Label>
      
      <div className="flex items-center gap-2">
        {fileName ? (
          <>
            <div className="text-sm border rounded py-1 px-2 flex-1 truncate">
              {fileName}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id={`file-${obligationType}-${attachmentType}`}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Téléversement...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Téléverser {attachmentLabel}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
