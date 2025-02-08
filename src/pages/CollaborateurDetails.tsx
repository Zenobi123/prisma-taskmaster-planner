
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCollaborateur } from "@/services/collaborateurService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Mail, Phone, MapPin, GraduationCap, Calendar, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
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

      <Card className="bg-white p-8">
        <div className="space-y-8">
          {/* En-tête */}
          <div className="text-center pb-6 border-b">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-primary font-semibold">
                {collaborateur.prenom[0]}{collaborateur.nom[0]}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {collaborateur.prenom} {collaborateur.nom}
            </h1>
            <p className="text-lg text-neutral-600">{collaborateur.poste}</p>
          </div>

          {/* Informations principales */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Informations professionnelles</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Email</p>
                    <p>{collaborateur.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Téléphone</p>
                    <p>{collaborateur.telephone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Date d'entrée</p>
                    <p>{formatDate(collaborateur.dateentree)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Statut</p>
                    <p className="capitalize">{collaborateur.statut}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Date de naissance</p>
                    <p>{formatDate(collaborateur.datenaissance)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Niveau d'études</p>
                    <p>{collaborateur.niveauetude}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Adresse</p>
                    <p>{collaborateur.quartier}, {collaborateur.ville}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
