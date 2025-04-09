
import { useToast } from "@/components/ui/use-toast";
import { useAddClientMutation } from "./mutations/useAddClientMutation";
import { useUpdateClientMutation } from "./mutations/useUpdateClientMutation";
import { useArchiveClientMutation, useRestoreClientMutation, useDeleteClientMutation } from "./mutations/useClientStatusMutations";
import { useConfirmation } from "./confirmation/ConfirmationDialogContext";

export function useClientsPageMutations() {
  const { toast } = useToast();
  const { showConfirmation } = useConfirmation();
  
  const addMutation = useAddClientMutation();
  const updateMutation = useUpdateClientMutation();
  const archiveMutation = useArchiveClientMutation();
  const restoreMutation = useRestoreClientMutation();
  const deleteMutation = useDeleteClientMutation();

  return {
    addMutation,
    updateMutation,
    archiveMutation,
    restoreMutation,
    deleteMutation,
    toast,
    showConfirmation
  };
}
