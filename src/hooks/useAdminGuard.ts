
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useAdminGuard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits pour accéder à cette page.",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  return null;
};
