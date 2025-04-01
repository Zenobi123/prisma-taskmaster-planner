
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type AuthorizedModule = "collaborateurs" | "parametres";

interface UseAuthorizationOptions {
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Hook pour gérer les autorisations d'accès aux modules protégés
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
  const userRole = localStorage.getItem("userRole");

  const isAuthorized = authorizedRoles.includes(userRole || "");

  useEffect(() => {
    if (!isAuthorized) {
      if (showToast) {
        const moduleNames = {
          collaborateurs: "la gestion des collaborateurs",
          parametres: "la gestion des paramètres du système"
        };
        
        toast({
          variant: "destructive",
          title: "Accès non autorisé",
          description: `Seuls les administrateurs peuvent accéder à ${moduleNames[module]}.`
        });
      }
      
      navigate(redirectTo);
    }
  }, [isAuthorized, navigate, toast, showToast, module, redirectTo]);

  return { isAuthorized, userRole };
};
