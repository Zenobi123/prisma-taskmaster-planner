
import React, { memo } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { User } from './hooks/useUserManagement';

type UserManagementTableProps = {
  users: User[];
  openEditModal: (user: User) => void;
  handleDeleteUser: (id: number) => void;
  roles: { value: string; label: string }[];
  isMobile?: boolean;
};

const UserManagementTable = memo(({ users, openEditModal, handleDeleteUser, roles, isMobile }: UserManagementTableProps) => {
  const renderMobileUserRow = (user: User) => (
    <TableRow key={user.id} className="border-b">
      <TableCell className="px-3 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{user.name}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <span className="text-xs mt-1 bg-gray-100 rounded-full px-2 py-0.5 inline-block w-fit capitalize">
            {roles.find(r => r.value === user.role)?.label || user.role}
          </span>
          <div className="flex gap-2 mt-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1 justify-center" 
              onClick={() => openEditModal(user)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1 justify-center text-destructive hover:text-destructive" 
              onClick={() => handleDeleteUser(user.id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderDesktopUserRow = (user: User) => (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <span className="capitalize">{
          roles.find(r => r.value === user.role)?.label || user.role
        }</span>
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => openEditModal(user)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Modifier</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleDeleteUser(user.id)}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Supprimer</span>
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Table>
      {!isMobile && (
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {users.map(user => isMobile ? renderMobileUserRow(user) : renderDesktopUserRow(user))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={isMobile ? 1 : 4} className="text-center py-6 text-muted-foreground">
              Aucun utilisateur trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});

// Ajout du displayName pour faciliter le debugging
UserManagementTable.displayName = 'UserManagementTable';

export default UserManagementTable;
