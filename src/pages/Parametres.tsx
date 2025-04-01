
import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";
import ProfileSettings from "@/components/parametres/ProfileSettings";
import AppSettings from "@/components/parametres/AppSettings";
import SecuritySettings from "@/components/parametres/SecuritySettings";
import NotificationSettings from "@/components/parametres/NotificationSettings";
import UserManagement from "@/components/parametres/UserManagement";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Parametres = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem("userRole");
  
  // Define allowed roles for the Settings page
  const allowedRoles = ["admin", "comptable"];
  const isAdmin = userRole === "admin";
  
  useEffect(() => {
    // Check if user has permission; if not, redirect to dashboard
    if (!allowedRoles.includes(userRole || "")) {
      toast({
        variant: "destructive",
        title: "Accès non autorisé",
        description: "Vous n'avez pas les droits nécessaires pour accéder à cette page."
      });
      navigate("/");
    }
  }, [navigate, toast, userRole]);

  // If user doesn't have permission, don't render the page content
  if (!allowedRoles.includes(userRole || "")) {
    return null;
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
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Accès restreint</AlertTitle>
                  <AlertDescription>
                    Seuls les administrateurs peuvent gérer les utilisateurs et leurs privilèges.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </div>
  );
};

export default Parametres;
