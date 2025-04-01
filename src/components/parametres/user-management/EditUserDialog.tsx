
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserForm, { UserFormData } from './UserForm';

type EditUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserFormData | null;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  roles: { value: string; label: string }[];
};

const EditUserDialog = ({ 
  isOpen, 
  onOpenChange, 
  userData, 
  onChange, 
  onSubmit, 
  roles 
}: EditUserDialogProps) => {
  if (!userData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <UserForm
          userData={userData}
          onChange={onChange}
          roles={roles}
          isNewUser={false}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onSubmit}>Enregistrer les modifications</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
