
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PermissionsFields } from "@/components/collaborateurs/form/PermissionsFields";
import { CollaborateurPermissions } from "@/types/collaborateur";

export type UserFormData = {
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions: CollaborateurPermissions[]
};

type UserFormProps = {
  userData: UserFormData;
  onChange: (field: string, value: any) => void;
  roles: { value: string; label: string }[];
  isNewUser?: boolean;
};

const UserForm = ({ userData, onChange, roles, isNewUser = false }: UserFormProps) => {
  const handlePermissionChange = (field: string, value: CollaborateurPermissions[]) => {
    onChange('permissions', value);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input 
          id="name" 
          value={userData.name} 
          onChange={(e) => onChange('name', e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={userData.email} 
          onChange={(e) => onChange('email', e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">
          {isNewUser ? "Mot de passe initial" : "Réinitialiser le mot de passe"}
        </Label>
        <Input 
          id="password" 
          type="password" 
          value={userData.password || ""}
          placeholder={!isNewUser ? "Laisser vide pour ne pas modifier" : ""}
          onChange={(e) => onChange('password', e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Select 
          value={userData.role} 
          onValueChange={(value) => onChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Champs de permissions */}
      <PermissionsFields 
        permissions={userData.permissions} 
        onChange={handlePermissionChange} 
      />
    </div>
  );
};

export default UserForm;
