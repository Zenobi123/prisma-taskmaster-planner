
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Define types for attachment management
export type AttachmentType = "declaration" | "receipt" | "payment" | "additional";

export interface FiscalAttachment {
  path: string;
  fileName: string;
  type: AttachmentType;
  uploadedAt: string;
  size?: number;
  url?: string;
}

// Helper to generate structured file paths
const generateFilePath = (
  clientId: string,
  year: string,
  obligationType: string,
  attachmentType: AttachmentType,
  originalFileName: string
) => {
  const fileExt = originalFileName.split('.').pop();
  const uniqueId = uuidv4().substring(0, 8);
  return `${clientId}/${year}/${obligationType}/${attachmentType}_${uniqueId}.${fileExt}`;
};

export const uploadFiscalAttachment = async (
  file: File,
  clientId: string,
  year: string,
  obligationType: string,
  attachmentType: AttachmentType
): Promise<string | null> => {
  try {
    console.log(`Uploading fiscal attachment: ${file.name} for ${obligationType}/${attachmentType}`);
    
    const filePath = generateFilePath(
      clientId,
      year,
      obligationType,
      attachmentType,
      file.name
    );

    const { error } = await supabase.storage
      .from('fiscal_attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      toast.error(`Erreur lors du téléchargement: ${error.message}`);
      return null;
    }

    console.log(`File uploaded successfully to: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Erreur lors du téléchargement du fichier");
    return null;
  }
};

export const getFiscalAttachmentUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('fiscal_attachments')
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data?.signedUrl || null;
  } catch (error) {
    console.error("Error getting file URL:", error);
    return null;
  }
};

export const deleteFiscalAttachment = async (filePath: string): Promise<boolean> => {
  try {
    console.log(`Deleting fiscal attachment: ${filePath}`);
    
    const { error } = await supabase.storage
      .from('fiscal_attachments')
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      toast.error(`Erreur lors de la suppression: ${error.message}`);
      return false;
    }

    console.log(`File deleted successfully: ${filePath}`);
    toast.success("Fichier supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Erreur lors de la suppression du fichier");
    return false;
  }
};

export const getAttachmentMetadata = async (filePath: string): Promise<FiscalAttachment | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('fiscal_attachments')
      .list(filePath.substring(0, filePath.lastIndexOf('/')), {
        limit: 100,
        offset: 0,
        search: filePath.substring(filePath.lastIndexOf('/') + 1)
      });

    if (error || !data || data.length === 0) {
      console.error("Metadata error:", error);
      return null;
    }

    const file = data[0];
    const url = await getFiscalAttachmentUrl(filePath);
    
    const pathParts = filePath.split('/');
    const typeInfo = pathParts[pathParts.length - 1].split('_')[0];
    
    return {
      path: filePath,
      fileName: file.name,
      type: typeInfo as AttachmentType,
      uploadedAt: file.created_at || new Date().toISOString(),
      size: file.metadata?.size,
      url
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return null;
  }
};

// Helper function to validate file type and size
export const validateFile = (file: File, maxSizeMB: number = 5): boolean => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    toast.error("Type de fichier non autorisé. Utilisez PDF, Word ou images.");
    return false;
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    toast.error(`La taille du fichier dépasse la limite de ${maxSizeMB}MB`);
    return false;
  }
  
  return true;
};
