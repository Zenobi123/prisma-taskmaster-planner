import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative de connexion avec:", { email, password });
    
    if (email === "admin@gmail.com" && password === "Admin") {
      console.log("Identifiants corrects, connexion réussie");
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace de gestion",
      });
      navigate("/");
    } else {
      console.log("Échec de la connexion - identifiants incorrects");
      console.log("Email attendu: admin@gmail.com");
      console.log("Mot de passe attendu: Admin");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect. Attention à la casse !",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800">Cabinet XYZ</h1>
          <p className="text-neutral-600 mt-2">Connectez-vous à votre espace</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-sm text-center space-y-2">
          <p className="text-neutral-600 font-medium">Identifiants de test :</p>
          <p className="text-neutral-600">Email : <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">admin@gmail.com</span></p>
          <p className="text-neutral-600">Mot de passe : <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">Admin</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;