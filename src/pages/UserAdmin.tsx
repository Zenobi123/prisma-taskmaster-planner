
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getExistingCredentials } from "@/services/userService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { Collaborateur } from "@/types/collaborateur";
import { UserAdminHeader } from "@/components/admin/UserAdminHeader";
import { UserTable } from "@/components/admin/UserTable";
import { UserForm } from "@/components/admin/UserForm";

const UserAdmin = () => {
  const [credentials, setCredentials] = useState<{email: string, role: string}[]>([]);
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
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

  // Récupérer les identifiants existants et les collaborateurs
  const fetchData = async () => {
    try {
      const credentialsData = await getExistingCredentials();
      setCredentials(credentialsData);
      
      const collaborateursData = await getCollaborateurs();
      setCollaborateurs(collaborateursData);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les données nécessaires.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  return (
    <div className="container mx-auto py-8">
      <UserAdminHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Identifiants existants</CardTitle>
            <CardDescription>Liste des utilisateurs enregistrés dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable credentials={credentials} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel utilisateur</CardTitle>
            <CardDescription>Ajouter un nouvel identifiant de connexion</CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm 
              collaborateurs={collaborateurs} 
              onUserCreated={fetchData} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAdmin;
