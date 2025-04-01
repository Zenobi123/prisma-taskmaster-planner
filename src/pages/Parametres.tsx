
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";
import ProfileSettings from "@/components/parametres/ProfileSettings";
import AppSettings from "@/components/parametres/AppSettings";
import SecuritySettings from "@/components/parametres/SecuritySettings";
import NotificationSettings from "@/components/parametres/NotificationSettings";
import UserManagement from "@/components/parametres/user-management/UserManagement";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";
import { useAuthorization } from "@/hooks/useAuthorization";

const Parametres = () => {
  // Utilisation du hook d'autorisation
  const { isAuthorized, userRole } = useAuthorization(
    ["admin"], 
    "parametres",
    { showToast: true }
  );
  
  const isAdmin = userRole === "admin";
  
  // Si l'utilisateur n'a pas d'autorisation, ne pas rendre le contenu de la page
  if (!isAuthorized) {
    return <CollaborateurUnauthorized module="parametres" />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <PageLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              {isAdmin && <TabsTrigger value="users">Utilisateurs</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="application">
              <AppSettings />
            </TabsContent>
            
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="users">
              {isAdmin ? (
                <UserManagement />
              ) : (
                <CollaborateurUnauthorized module="parametres" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </div>
  );
};

export default Parametres;
