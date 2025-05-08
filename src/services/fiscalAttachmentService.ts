
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = 'fiscal_attachments';

export const fiscalAttachmentService = {
  /**
   * Upload a file to the fiscal attachments bucket
   */
  uploadFile: async (
    clientId: string,
    year: string,
    obligationType: string,
    attachmentType: string,
    file: File
  ): Promise<{ path: string; error: Error | null }> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${clientId}/${year}/${obligationType}/${attachmentType}_${uuidv4()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error("Error uploading file:", error);
        return { path: '', error };
      }

      return { path: filePath, error: null };
    } catch (error) {
      console.error("Error in uploadFile:", error);
      return { path: '', error: error as Error };
    }
  },

  /**
   * Get a signed URL for downloading a file
   */
  getFileUrl: async (filePath: string): Promise<{ url: string; error: Error | null }> => {
    try {
      if (!filePath) {
        return { url: '', error: new Error("No file path provided") };
      }
      
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds

      if (error) {
        console.error("Error getting signed URL:", error);
        return { url: '', error };
      }

      return { url: data.signedUrl, error: null };
    } catch (error) {
      console.error("Error in getFileUrl:", error);
      return { url: '', error: error as Error };
    }
  },

  /**
   * Delete a file from storage
   */
  deleteFile: async (filePath: string): Promise<{ success: boolean; error: Error | null }> => {
    try {
      if (!filePath) {
        return { success: false, error: new Error("No file path provided") };
      }
      
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error("Error deleting file:", error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in deleteFile:", error);
      return { success: false, error: error as Error };
    }
  },

  /**
   * List files in a directory
   */
  listFiles: async (
    clientId: string,
    year: string,
    obligationType: string
  ): Promise<{ files: string[]; error: Error | null }> => {
    try {
      const path = `${clientId}/${year}/${obligationType}`;
      
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(path);

      if (error) {
        console.error("Error listing files:", error);
        return { files: [], error };
      }

      const files = data.map(file => `${path}/${file.name}`);
      return { files, error: null };
    } catch (error) {
      console.error("Error in listFiles:", error);
      return { files: [], error: error as Error };
    }
  },

  /**
   * Get filename from path
   */
  getFileName: (path: string): string => {
    if (!path) return "";
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
};

export default fiscalAttachmentService;
