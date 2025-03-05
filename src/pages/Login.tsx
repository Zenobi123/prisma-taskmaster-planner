
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createUser, getExistingCredentials } from "@/services/userService";

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
      
      // Vérification de l'existence de l'utilisateur
      const { data: userExists, error: userCheckError } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (userCheckError) {
        console.log("Erreur lors de la vérification de l'utilisateur:", userCheckError);
      } else {
        console.log("Utilisateur trouvé dans la table users:", userExists);
      }
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim()
      });

      if (authError) {
        console.error("Erreur d'authentification détaillée:", {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });
        
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: `${authError.message}. Veuillez vérifier vos identifiants.`,
          className: "bg-white border-red-500 text-black",
        });
        return;
      }

      if (authData.user) {
        console.log("Authentification réussie:", authData.user);
        
        // Récupérer le rôle de l'utilisateur depuis la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (userError) {
          console.error("Erreur lors de la récupération du rôle:", userError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les informations de l'utilisateur.",
            className: "bg-white border-red-500 text-black",
          });
          return;
        }

        console.log("Données utilisateur récupérées:", userData);

        // Stocker les informations de l'utilisateur
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", userData.role);

        // Si c'est un admin, vérifier si l'utilisateur assistant existe déjà
        if (userData.role === "admin") {
          try {
            const credentials = await getExistingCredentials();
            const assistantExists = credentials.some(cred => 
              cred.email === "assistant@prismagestion.com"
            );

            if (!assistantExists) {
              // Créer l'utilisateur assistant
              await createUser(
                "assistant@prismagestion.com",
                "Assistant123",
                "comptable"
              );
              console.log("Utilisateur assistant créé avec succès");
            }
          } catch (error) {
            console.error("Erreur lors de la vérification/création de l'assistant:", error);
          }
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace de gestion",
          className: "bg-white border-green-500 text-black",
        });
        navigate("/");
      }
    } catch (error) {
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
