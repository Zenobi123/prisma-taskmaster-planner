
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { loginUser } from "@/services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentative de connexion avec:", { email, password });
      
      // Utiliser le service d'authentification
      const { data, error } = await loginUser(email, password);

      if (error) {
        console.error("Erreur d'authentification détaillée:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: `${error.message}. Veuillez vérifier vos identifiants.`,
          className: "bg-white border-red-500 text-black",
        });
        return;
      }

      if (data.user) {
        console.log("Authentification réussie:", data.user);
        
        let userRole = "comptable"; // Rôle par défaut
        
        if (data.session && data.session.access_token !== "demo_token") {
          // Si c'est une vraie session Supabase, récupérer le rôle depuis la base
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (!userError && userData) {
            userRole = userData.role;
          }
        } else if (email.toLowerCase() === "admin@prisma.com") {
          userRole = "admin";
        }

        // Stocker les informations de l'utilisateur
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", userRole);

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace de gestion",
          className: "bg-white border-green-500 text-black",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Erreur inattendue détaillée:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        className: "bg-white border-red-500 text-black",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800">PRISMA GESTION</h1>
          <p className="text-neutral-600 mt-2">Connectez-vous à votre espace</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </span>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
