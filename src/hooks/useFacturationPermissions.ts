
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCollaborateur } from "@/services/collaborateurService";

export const useFacturationPermissions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Vérifier les permissions du collaborateur connecté
  const collaborateurId = localStorage.getItem("collaborateurId");
  
  const { data: collaborateur } = useQuery({
    queryKey: ["collaborateur", collaborateurId],
    queryFn: () => collaborateurId ? getCollaborateur(collaborateurId) : null,
  });

  // Vérification des permissions et redirection si nécessaire
  useEffect(() => {
    if (collaborateur) {
      const hasPermission = collaborateur.permissions?.some(
        p => p.module === "facturation" && ["ecriture", "administration"].includes(p.niveau)
      );
      
      if (!hasPermission) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à la facturation."
        });
        navigate("/");
      }
    }
  }, [collaborateur, toast, navigate]);

  return { collaborateur, hasPermission: !!collaborateur };
};
