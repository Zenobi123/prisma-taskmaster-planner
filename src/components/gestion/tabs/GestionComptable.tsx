
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client";
import {
  BookOpen,
  FileText,
  BarChart3,
  ClipboardList,
  Building2,
  Hash,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface GestionComptableProps {
  selectedClient?: Client;
}

type ObligationStatus = "a_faire" | "en_cours" | "termine";

interface Obligation {
  label: string;
  description: string;
  icon: React.ReactNode;
  status: ObligationStatus;
}

function getStatusBadge(status: ObligationStatus) {
  switch (status) {
    case "termine":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Terminé
        </Badge>
      );
    case "en_cours":
      return (
        <Badge variant="default" className="gap-1">
          <Clock className="h-3 w-3" />
          En cours
        </Badge>
      );
    case "a_faire":
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          À faire
        </Badge>
      );
  }
}

function getRegimeLabel(regime: string) {
  switch (regime) {
    case "reel":
      return "Régime du Réel";
    case "igs":
      return "Impôt Général Synthétique (IGS)";
    case "non_professionnel":
      return "Non professionnel";
    default:
      return regime;
  }
}

function getObligationsReel(): Obligation[] {
  return [
    {
      label: "Journal comptable",
      description: "Tenue du journal des opérations quotidiennes",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      status: "en_cours",
    },
    {
      label: "Grand livre",
      description: "Enregistrement détaillé de tous les comptes",
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      status: "en_cours",
    },
    {
      label: "Balance générale",
      description: "Synthèse des soldes de tous les comptes",
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      status: "a_faire",
    },
    {
      label: "Bilan",
      description: "État de la situation patrimoniale",
      icon: <ClipboardList className="h-5 w-5 text-green-500" />,
      status: "a_faire",
    },
    {
      label: "Compte de résultat",
      description: "Synthèse des produits et charges de l'exercice",
      icon: <BarChart3 className="h-5 w-5 text-orange-500" />,
      status: "a_faire",
    },
    {
      label: "DSF (Déclaration Statistique et Fiscale)",
      description: "Liasse fiscale annuelle obligatoire",
      icon: <FileText className="h-5 w-5 text-red-500" />,
      status: "a_faire",
    },
  ];
}

function getObligationsIgs(): Obligation[] {
  return [
    {
      label: "Registre des recettes et dépenses",
      description: "Tenue simplifiée des entrées et sorties",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      status: "en_cours",
    },
    {
      label: "Déclaration IGS",
      description: "Déclaration trimestrielle de l'impôt synthétique",
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      status: "a_faire",
    },
    {
      label: "Pièces justificatives",
      description: "Conservation des factures et reçus",
      icon: <ClipboardList className="h-5 w-5 text-green-500" />,
      status: "en_cours",
    },
  ];
}

export function GestionComptable({ selectedClient }: GestionComptableProps) {
  if (!selectedClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion comptable</CardTitle>
          <CardDescription>Veuillez sélectionner un client pour afficher les informations comptables.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const regime = selectedClient.regimefiscal;
  const obligations = regime === "reel" ? getObligationsReel() : getObligationsIgs();
  const isPersonnePhysique = selectedClient.type === "physique";

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations fiscales
          </CardTitle>
          <CardDescription>
            Résumé du profil fiscal du client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Régime fiscal</p>
              <div className="flex items-center gap-2">
                <Badge variant={regime === "reel" ? "default" : "secondary"}>
                  {getRegimeLabel(regime)}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">NIU</p>
              <p className="text-sm font-mono flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" />
                {selectedClient.niu}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Type de contribuable</p>
              <p className="text-sm">
                {isPersonnePhysique ? "Personne physique" : "Personne morale"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounting Obligations */}
      <Card>
        <CardHeader>
          <CardTitle>Obligations comptables</CardTitle>
          <CardDescription>
            {regime === "reel"
              ? "Obligations du régime du réel - Comptabilité complète selon le système OHADA"
              : "Obligations simplifiées du régime IGS"}
            {isPersonnePhysique
              ? " — Personne physique"
              : " — Personne morale (obligations renforcées)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {obligations.map((obligation) => (
              <Card key={obligation.label} className="border">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{obligation.icon}</div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-none">{obligation.label}</p>
                        <p className="text-xs text-muted-foreground">{obligation.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(obligation.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional obligations for personne morale */}
      {!isPersonnePhysique && regime === "reel" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Obligations spécifiques - Personne morale</CardTitle>
            <CardDescription>
              Obligations supplémentaires liées à la forme juridique ({selectedClient.formejuridique?.toUpperCase() || "N/A"})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-teal-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-none">Rapport du commissaire aux comptes</p>
                        <p className="text-xs text-muted-foreground">Certification annuelle des comptes</p>
                      </div>
                    </div>
                    {getStatusBadge("a_faire")}
                  </div>
                </CardContent>
              </Card>
              <Card className="border">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <ClipboardList className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-none">PV d&apos;Assemblée Générale</p>
                        <p className="text-xs text-muted-foreground">Approbation des comptes annuels</p>
                      </div>
                    </div>
                    {getStatusBadge("a_faire")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
