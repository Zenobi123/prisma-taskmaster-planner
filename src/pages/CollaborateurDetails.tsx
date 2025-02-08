
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCollaborateur } from "@/services/collaborateurService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

export default function CollaborateurDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: collaborateur, isLoading } = useQuery({
    queryKey: ["collaborateur", id],
    queryFn: () => getCollaborateur(id!),
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!collaborateur) {
    return (
      <div className="p-8">
        <h1>Collaborateur non trouvé</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/collaborateurs")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Button
          onClick={() => navigate(`/collaborateurs/${id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {collaborateur.prenom} {collaborateur.nom}
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd>{collaborateur.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                <dd>{collaborateur.telephone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Poste</dt>
                <dd className="capitalize">{collaborateur.poste}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date d'entrée
                </dt>
                <dd>{new Date(collaborateur.dateentree).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date de naissance
                </dt>
                <dd>
                  {new Date(collaborateur.datenaissance).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Niveau d'études
                </dt>
                <dd>{collaborateur.niveauetude}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ville</dt>
                <dd>{collaborateur.ville}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quartier</dt>
                <dd>{collaborateur.quartier}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
