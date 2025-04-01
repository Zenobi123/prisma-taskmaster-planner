
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserForm, { UserFormData } from './UserForm';

type AddUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserFormData;
  onChange: (field: string, value: any) => void;
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
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
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
