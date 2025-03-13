
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  isSidebarOpen?: boolean;
}

const LogoutButton = ({ isSidebarOpen = true }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      localStorage.removeItem("isAuthenticated");
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
      });
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={cn(
              "text-neutral-600 hover:text-neutral-900 transition-all group relative dark:text-neutral-400 dark:hover:text-neutral-200",
              !isSidebarOpen && "justify-center w-10 px-0"
            )}
          >
            <LogOut className="h-4 w-4" />
            <span
              className={cn(
                "ml-2 transition-opacity duration-300",
                !isSidebarOpen && "opacity-0 invisible absolute"
              )}
            >
              Déconnexion
            </span>
            {!isSidebarOpen && (
              <div className="absolute left-14 bg-neutral-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                Déconnexion
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {!isSidebarOpen && "Déconnexion"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LogoutButton;
