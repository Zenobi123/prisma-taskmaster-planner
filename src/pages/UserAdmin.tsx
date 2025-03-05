
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, getExistingCredentials } from "@/services/userService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { Collaborateur } from "@/types/collaborateur";

const UserAdmin = () => {
  const [credentials, setCredentials] = useState<{email: string, role: string}[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "comptable">("comptable");
  const [collaborateur, setCollaborateur] = useState("");
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier si l'utilisateur est administrateur
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

  // Récupérer les identifiants existants
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const data = await getExistingCredentials();
        setCredentials(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les identifiants existants.",
        });
      }
    };

    const fetchCollaborateurs = async () => {
      try {
        const data = await getCollaborateurs();
        setCollaborateurs(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les collaborateurs.",
        });
      }
    };

    fetchCredentials();
    fetchCollaborateurs();
  }, [toast]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createUser(
        email, 
        password, 
        role, 
        collaborateur || undefined
      );
      
      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès.",
        className: "bg-white border-green-500 text-black",
      });
      
      // Rafraîchir la liste des identifiants
      const data = await getExistingCredentials();
      setCredentials(data);
      
      // Réinitialiser le formulaire
      setEmail("");
      setPassword("");
      setRole("comptable");
      setCollaborateur("");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de l'utilisateur.",
        className: "bg-white border-red-500 text-black",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Administration des utilisateurs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Identifiants existants</CardTitle>
            <CardDescription>Liste des utilisateurs enregistrés dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rôle</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {credentials.map((cred, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{cred.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">{cred.role}</td>
                    </tr>
                  ))}
                  {credentials.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-sm text-neutral-500">Aucun identifiant trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel utilisateur</CardTitle>
            <CardDescription>Ajouter un nouvel identifiant de connexion</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select 
                  value={role} 
                  onValueChange={(value: "admin" | "comptable") => setRole(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="comptable">Comptable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collaborateur">Associer à un collaborateur (optionnel)</Label>
                <Select 
                  value={collaborateur} 
                  onValueChange={setCollaborateur}
                  disabled={isLoading}
                >
                  <SelectTrigger id="collaborateur">
                    <SelectValue placeholder="Sélectionner un collaborateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun</SelectItem>
                    {collaborateurs.map((collab) => (
                      <SelectItem key={collab.id} value={collab.id}>
                        {collab.prenom} {collab.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : "Créer l'utilisateur"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAdmin;
