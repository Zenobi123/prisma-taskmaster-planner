import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface DocumentAdministratif {
  id: string;
  client_id: string;
  nom: string;
  type: string;
  statut: string;
  fichier_url?: string;
  date_creation: string;
  date_expiration?: string;
}

export function useDocumentMutations(clientId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .select("*")
        .eq("client_id", clientId);

      if (error) {
        throw error;
      }
      return data as DocumentAdministratif[];
    },
  });

  const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const uploadFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Type de fichier non autorisé. Utilisez PDF, Word ou images.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("La taille du fichier dépasse la limite de 10 MB.");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${clientId}/${fileName}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: signedData, error: signError } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 3600);

    if (signError || !signedData?.signedUrl) {
      throw new Error("Impossible de générer l'URL du document.");
    }

    return signedData.signedUrl;
  };

  const saveDocument = useMutation({
    mutationFn: async ({ nom, type, statut, file }: { nom: string, type: string, statut: string, file?: File }) => {
      let fichier_url = "";
      if (file) {
        fichier_url = await uploadFile(file);
      }

      const { data, error } = await supabase
        .from("documents_administratifs")
        .insert([{
          client_id: clientId,
          nom,
          type,
          statut,
          fichier_url: fichier_url || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", clientId] });
      toast({
        title: "Document ajouté",
        description: "Le document a été enregistré avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document.",
        variant: "destructive",
      });
    },
  });

  const updateDocumentStatus = useMutation({
    mutationFn: async ({ id, statut }: { id: string, statut: string }) => {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .update({ statut })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", clientId] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du document a été mis à jour.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    },
  });

  const updateDocumentFile = useMutation({
    mutationFn: async ({ id, file }: { id: string, file: File }) => {
      const fichier_url = await uploadFile(file);

      const { data, error } = await supabase
        .from("documents_administratifs")
        .update({ fichier_url })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", clientId] });
      toast({
        title: "Document mis à jour",
        description: "Le fichier a été enregistré avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le document.",
        variant: "destructive",
      });
    },
  });

  return { documents, isLoading, saveDocument, updateDocumentStatus, updateDocumentFile };
}
