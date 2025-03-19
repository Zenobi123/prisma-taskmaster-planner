
interface DeleteAllFacturesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count: number;
}

// This component is no longer in use, kept for backwards compatibility
export const DeleteAllFacturesDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
}: DeleteAllFacturesDialogProps) => {
  return null;
};
