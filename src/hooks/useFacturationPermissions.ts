
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCollaborateur } from "@/services/collaborateurService";

export const useFacturationPermissions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(false);
  
  // Vérifier les permissions du collaborateur connecté
  const collaborateurId = localStorage.getItem("collaborateurId");
  
  const { data: collaborateur, isLoading } = useQuery({
    queryKey: ["collaborateur", collaborateurId],
    queryFn: () => collaborateurId ? getCollaborateur(collaborateurId) : null,
  });

  // Vérification des permissions et redirection si nécessaire
  useEffect(() => {
    if (!isLoading && collaborateur) {
      const permissionExists = collaborateur.permissions?.some(
        p => p.module === "facturation" && ["ecriture", "administration"].includes(p.niveau)
      );
      
      setHasPermission(permissionExists);
      
      if (!permissionExists) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à la facturation."
        });
        navigate("/");
      }
    }
  }, [collaborateur, isLoading, toast, navigate]);

  return { collaborateur, hasPermission, isLoading };
};
