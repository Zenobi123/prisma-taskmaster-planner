
import React, { createContext, useState, useContext, ReactNode } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "destructive";
}

type ShowConfirmationProps = Omit<ConfirmationDialogProps, "isOpen" | "onCancel" | "onConfirm">;

interface ConfirmationContextType {
  showConfirmation: (props: ShowConfirmationProps) => Promise<boolean>;
  confirmationDialog: React.ReactNode;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationProvider");
  }
  return context;
};

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogProps | null>(null);

  // Helper to show confirmation dialog
  const showConfirmation = (props: ShowConfirmationProps) => {
    return new Promise<boolean>((resolve) => {
      setConfirmDialog({
        ...props,
        isOpen: true,
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        },
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        }
      });
    });
  };

  // Confirmation dialog component
  const confirmationDialog = confirmDialog ? (
    <AlertDialog 
      open={confirmDialog.isOpen} 
      onOpenChange={(open) => {
        if (!open) confirmDialog.onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={confirmDialog.onCancel}>
            {confirmDialog.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDialog.onConfirm}
            className={confirmDialog.variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {confirmDialog.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;

  return (
    <ConfirmationContext.Provider value={{ showConfirmation, confirmationDialog }}>
      {children}
      {confirmationDialog}
    </ConfirmationContext.Provider>
  );
};
