
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollaborateur, updateCollaborateur } from "@/services/collaborateurService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurForm } from "@/components/collaborateurs/CollaborateurForm";
import { Collaborateur } from "@/types/collaborateur";
import PageLayout from "@/components/layout/PageLayout";

export default function CollaborateurEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collaborateur, isLoading } = useQuery({
    queryKey: ["collaborateur", id],
    queryFn: () => getCollaborateur(id!),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Omit<Collaborateur, 'id' | 'created_at'>>) => 
      updateCollaborateur(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborateur", id] });
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
      toast({
        title: "Collaborateur modifié",
        description: "Les modifications ont été enregistrées avec succès.",
      });
      navigate(`/collaborateurs/${id}`);
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du collaborateur.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collaborateur) {
      updateMutation.mutate(collaborateur);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (collaborateur) {
      const updatedCollaborateur = {
        ...collaborateur,
        [field]: value,
      };
      queryClient.setQueryData(["collaborateur", id], updatedCollaborateur);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-8 w-full">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!collaborateur) {
    return (
      <PageLayout>
        <div className="p-8 w-full">
          <h1>Collaborateur non trouvé</h1>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/collaborateurs/${id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Modifier {collaborateur.prenom} {collaborateur.nom}
          </h2>
          <CollaborateurForm
            collaborateur={collaborateur}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </PageLayout>
  );
}
