
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, getExistingCredentials } from "@/services/userService";
import { Collaborateur } from "@/types/collaborateur";
import { useToast } from "@/components/ui/use-toast";

interface UserFormProps {
  collaborateurs: Collaborateur[];
  onUserCreated: () => void;
}

export const UserForm = ({ collaborateurs, onUserCreated }: UserFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "comptable" | "assistant">("comptable");
  const [collaborateur, setCollaborateur] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      
      // Réinitialiser le formulaire
      setEmail("");
      setPassword("");
      setRole("comptable");
      setCollaborateur("");
      
      // Notifier le parent pour rafraîchir la liste
      onUserCreated();
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
          onValueChange={(value: "admin" | "comptable" | "assistant") => setRole(value)}
          disabled={isLoading}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="comptable">Comptable</SelectItem>
            <SelectItem value="assistant">Assistant</SelectItem>
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
  );
};
