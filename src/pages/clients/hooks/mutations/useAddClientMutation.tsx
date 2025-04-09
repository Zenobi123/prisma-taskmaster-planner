
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useAddClientMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      const clientName = data.type === "physique" 
        ? data.nom 
        : data.raisonsociale;
        
      toast({
        title: "Client ajouté avec succès",
        description: `Le client "${clientName}" a été ajouté à votre base de données.`,
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'ajout du client:", error);
      toast({
        title: "Erreur lors de l'ajout",
        description: error.message || "Une erreur est survenue lors de l'ajout du client. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
}
