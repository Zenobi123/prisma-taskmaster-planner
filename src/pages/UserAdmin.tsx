
import { UserAdminHeader } from "@/components/admin/UserAdminHeader";
import { UserTable } from "@/components/admin/UserTable";
import { UserForm } from "@/components/admin/UserForm";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { useUserAdminData } from "@/hooks/useUserAdminData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserAdmin = () => {
  // Vérifier si l'utilisateur est administrateur
  useAdminGuard();
  
  // Récupérer les données nécessaires
  const { credentials, collaborateurs, fetchData } = useUserAdminData();

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
