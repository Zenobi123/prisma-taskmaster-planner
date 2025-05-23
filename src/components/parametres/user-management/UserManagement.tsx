
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shield } from "lucide-react";
import { useUserManagement } from './hooks/useUserManagement';
import UserManagementTable from './UserManagementTable';
import AddUserDialog from './AddUserDialog';
import EditUserDialog from './EditUserDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const UserManagement = () => {
  const {
    users,
    roles,
    newUser,
    selectedUser,
    isAddUserOpen,
    isEditUserOpen,
    setIsAddUserOpen,
    setIsEditUserOpen,
    handleAddUser,
    handleDeleteUser,
    handleEditUser,
    openEditModal,
    handleUserChange,
  } = useUserManagement();
  
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row items-center justify-between'}`}>
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-primary" />
              Gestion des utilisateurs
            </CardTitle>
            <CardDescription className="mt-1">
              Créez et gérez les comptes utilisateurs et leurs privilèges d'accès
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddUserOpen(true)}
            className={isMobile ? "w-full justify-center" : ""}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </CardHeader>
        <CardContent className={isMobile ? "px-2 sm:px-6" : ""}>
          <div className="overflow-x-auto">
            <UserManagementTable 
              users={users} 
              openEditModal={openEditModal} 
              handleDeleteUser={handleDeleteUser}
              roles={roles} 
              isMobile={isMobile}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog d'ajout d'utilisateur */}
      <AddUserDialog
        isOpen={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        userData={newUser}
        onChange={handleUserChange}
        onSubmit={handleAddUser}
        roles={roles}
      />

      {/* Dialog de modification d'utilisateur */}
      {selectedUser && (
        <EditUserDialog
          isOpen={isEditUserOpen}
          onOpenChange={setIsEditUserOpen}
          userData={selectedUser}
          onChange={handleUserChange}
          onSubmit={handleEditUser}
          roles={roles}
        />
      )}
    </div>
  );
};

export default UserManagement;
