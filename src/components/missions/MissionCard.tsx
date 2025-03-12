import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, User2 } from "lucide-react";

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    client_id: string;
    collaborateur_id: string;
    status: "en_attente" | "en_cours" | "termine" | "en_retard";
    created_at: string;
    updated_at: string;
    start_date?: string;
    end_date?: string;
    clients: {
      id: string;
      nom: string;
      raisonsociale: string;
      type: string;
    };
    collaborateurs: {
      id: string;
      nom: string;
      prenom: string;
    };
  };
}

export const MissionCard = ({ mission }: MissionCardProps) => {
  // Function to determine the appropriate avatar name
  const getAvatarName = () => {
    if (mission.collaborateurs) {
      return `${mission.collaborateurs.prenom} ${mission.collaborateurs.nom}`;
    }
    return "Collaborateur inconnu";
  };

  // Function to get initials for the avatar fallback
  const getInitials = () => {
    if (mission.collaborateurs) {
      return `${mission.collaborateurs.prenom.charAt(0)}${mission.collaborateurs.nom.charAt(0)}`;
    }
    return "??";
  };

  // Function to determine status badge
  const getStatusBadge = () => {
    switch (mission.status) {
      case "en_attente":
        return <Badge variant="outline">En attente</Badge>;
      case "en_cours":
        return <Badge variant="success">En cours</Badge>;
      case "termine":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Terminé</Badge>;
      case "en_retard":
        return (
          <Badge className="bg-[#ea384c] hover:bg-[#d32f40] text-white">
            <Clock size={14} className="mr-1" />
            En retard
          </Badge>
        );
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{mission.title}</CardTitle>
        <CardDescription>
          {mission.clients && mission.clients.type === "physique"
            ? mission.clients.nom
            : mission.clients?.raisonsociale || "Client inconnu"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage alt={getAvatarName()} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{getAvatarName()}</div>
          <div className="text-xs text-muted-foreground">
            <User2 size={14} className="mr-1 inline-block" />
            {mission.collaborateurs
              ? `${mission.collaborateurs.prenom}.${mission.collaborateurs.nom}@example.com`
              : "email@example.com"}
          </div>
        </div>
        <div className="ml-auto">{getStatusBadge()}</div>
      </CardContent>
    </Card>
  );
};
