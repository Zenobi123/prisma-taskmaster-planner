import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";

export type AuthorizedModule = "collaborateurs" | "parametres" | "facturation";

interface UseAuthorizationOptions {
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Hook pour gérer les autorisations d'accès aux modules protégés
 * Uses server-side role validation from Supabase instead of localStorage
 * @param authorizedRoles Les rôles autorisés à accéder au module
 * @param module Le nom du module pour les messages d'erreur
 * @param options Options de configuration (redirection, toast)
 * @returns Un objet contenant l'état d'autorisation
 */
export const useAuthorization = (
  authorizedRoles: string[],
  module: AuthorizedModule,
  options: UseAuthorizationOptions = {}
) => {
  const { redirectTo = "/", showToast = true } = options;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, isLoading } = useAuthContext();

  const isAuthorized = !isLoading && authorizedRoles.includes(userRole || "");

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      if (showToast) {
        const moduleNames = {
          collaborateurs: "la gestion des collaborateurs",
          parametres: "la gestion des paramètres du système",
          facturation: "la gestion de la facturation"
        };
        
        toast({
          variant: "destructive",
          title: "Accès non autorisé",
          description: `Seuls les administrateurs peuvent accéder à ${moduleNames[module]}.`
        });
      }
      
      navigate(redirectTo);
    }
  }, [isAuthorized, isLoading, navigate, toast, showToast, module, redirectTo]);

  return { isAuthorized, userRole, isLoading };
};
