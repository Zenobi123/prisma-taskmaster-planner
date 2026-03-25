
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type AuthorizedModule = "collaborateurs" | "parametres" | "facturation";

interface UseAuthorizationOptions {
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Hook pour gérer les autorisations d'accès aux modules protégés.
 * Vérifie le rôle côté serveur via Supabase (et non via localStorage).
 */
export const useAuthorization = (
  authorizedRoles: string[],
  module: AuthorizedModule,
  options: UseAuthorizationOptions = {}
) => {
  const { redirectTo = "/", showToast = true } = options;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          navigate("/login");
          return;
        }

        // Vérifier le rôle côté serveur
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || !userData) {
          navigate(redirectTo);
          return;
        }

        const role = userData.role;
        setUserRole(role);
        const authorized = authorizedRoles.includes(role);
        setIsAuthorized(authorized);

        if (!authorized) {
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [authorizedRoles, module, navigate, toast, showToast, redirectTo]);

  return { isAuthorized, userRole, isLoading };
};
