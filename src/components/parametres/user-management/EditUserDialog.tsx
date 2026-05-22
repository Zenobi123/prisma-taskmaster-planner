
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserForm, { UserFormData } from './UserForm';

type EditUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserFormData | null;
  onChange: (field: string, value) => void;
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
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Modifier l'utilisateur
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations et les permissions de cet utilisateur.
          </DialogDescription>
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
