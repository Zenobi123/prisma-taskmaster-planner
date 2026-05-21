
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserForm, { UserFormData } from './UserForm';

type AddUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserFormData;
  onChange: (field: string, value) => void;
  onSubmit: () => void;
  roles: { value: string; label: string }[];
};

const AddUserDialog = ({ 
  isOpen, 
  onOpenChange, 
  userData, 
  onChange, 
  onSubmit, 
  roles 
}: AddUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Ajouter un nouvel utilisateur
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau compte utilisateur.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          userData={userData}
          onChange={onChange}
          roles={roles}
          isNewUser={true}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onSubmit}>Ajouter l'utilisateur</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
