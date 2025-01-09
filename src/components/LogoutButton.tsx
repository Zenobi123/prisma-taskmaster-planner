import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate("/login");
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="text-neutral-600 hover:text-neutral-900"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Déconnexion
    </Button>
  );
};

export default LogoutButton;