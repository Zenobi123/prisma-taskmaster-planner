
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";
import ProfileSettings from "@/components/parametres/ProfileSettings";
import AppSettings from "@/components/parametres/AppSettings";
import SecuritySettings from "@/components/parametres/SecuritySettings";
import NotificationSettings from "@/components/parametres/NotificationSettings";
import CabinetConfigSettings from "@/components/parametres/CabinetConfigSettings";
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
      <div className="flex-1 min-w-0 overflow-y-auto">
        <PageLayout>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ml-10 md:ml-0">Paramètres</h1>

            <Tabs defaultValue="profile" className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="mb-4 sm:mb-6 w-max min-w-full sm:w-full">
                  <TabsTrigger value="profile" className="text-xs sm:text-sm">Profil</TabsTrigger>
                  <TabsTrigger value="cabinet" className="text-xs sm:text-sm">Cabinet (impressions)</TabsTrigger>
                  <TabsTrigger value="application" className="text-xs sm:text-sm">Application</TabsTrigger>
                  <TabsTrigger value="security" className="text-xs sm:text-sm">Sécurité</TabsTrigger>
                  <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
                  {isAdmin && <TabsTrigger value="users" className="text-xs sm:text-sm">Utilisateurs</TabsTrigger>}
                </TabsList>
              </div>

              <TabsContent value="profile">
                <ProfileSettings />
              </TabsContent>

              <TabsContent value="cabinet">
                <CabinetConfigSettings />
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
    </div>
  );
};

export default Parametres;
