
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export type AttachmentType = "declaration" | "receipt" | "payment" | "additional" | "document" | "form";

export interface Attachment {
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

export const uploadAttachment = async (
  file: File,
  clientId: string,
  year: string,
  obligationType: string,
  attachmentType: AttachmentType
): Promise<string | null> => {
  try {
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

    return filePath;
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Erreur lors du téléchargement du fichier");
    return null;
  }
};

export const getAttachmentUrl = async (filePath: string): Promise<string | null> => {
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

export const deleteAttachment = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('fiscal_attachments')
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      toast.error(`Erreur lors de la suppression: ${error.message}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Erreur lors de la suppression du fichier");
    return false;
  }
};
