
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getExistingCredentials } from "@/services/userService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { Collaborateur } from "@/types/collaborateur";

export const useUserAdminData = () => {
  const [credentials, setCredentials] = useState<{email: string, role: string}[]>([]);
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const credentialsData = await getExistingCredentials();
      setCredentials(credentialsData);
      
      const collaborateursData = await getCollaborateurs();
      setCollaborateurs(collaborateursData);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les données nécessaires.",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { credentials, collaborateurs, fetchData };
};
