
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client";
import {
  CheckCircle2,
  Calendar,
  FileText,
  Briefcase,
  Building2,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";

interface ContratPrestationsProps {
  client: Client;
}

interface Prestation {
  nom: string;
  description: string;
}

interface Echeance {
  label: string;
  periode: string;
  description: string;
  regimes: string[];
  /** Month (1-12) for annual deadlines, or null for recurring */
  moisReference?: number;
  /** Day of month for the deadline */
  jourReference?: number;
}

const PRESTATIONS_REEL: Prestation[] = [
  {
    nom: "Tenue de comptabilité complète (OHADA)",
    description:
      "Enregistrement de toutes les opérations comptables selon le plan OHADA révisé, incluant le journal, le grand livre et la balance.",
  },
  {
    nom: "Établissement des états financiers (Bilan, CR, TAFIRE)",
    description:
      "Préparation du bilan, du compte de résultat et du tableau financier des ressources et emplois en fin d'exercice.",
  },
  {
    nom: "Déclaration Statistique et Fiscale (DSF)",
    description:
      "Élaboration et dépôt de la DSF auprès de l'administration fiscale avant le 15 mars de chaque année.",
  },
  {
    nom: "Déclarations fiscales mensuelles (TVA, AIR, IS acomptes)",
    description:
      "Calcul et télédéclaration mensuelle de la TVA, de l'Acompte d'Impôt sur le Revenu et des acomptes d'IS.",
  },
  {
    nom: "Déclarations sociales (CNPS)",
    description:
      "Établissement des bulletins de paie, déclarations trimestrielles et annuelles auprès de la CNPS.",
  },
  {
    nom: "Conseil fiscal et optimisation",
    description:
      "Analyse de la situation fiscale du client et recommandations pour une optimisation légale de la charge fiscale.",
  },
  {
    nom: "Assistance en cas de contrôle fiscal",
    description:
      "Accompagnement et représentation du client lors des vérifications et contrôles de l'administration fiscale.",
  },
];

const PRESTATIONS_IGS: Prestation[] = [
  {
    nom: "Tenue du registre des recettes/dépenses",
    description:
      "Enregistrement simplifié des entrées et sorties de fonds dans un registre conforme aux exigences du régime IGS.",
  },
  {
    nom: "Déclaration IGS trimestrielle",
    description:
      "Calcul et dépôt de la déclaration trimestrielle de l'Impôt Global et Synthétique auprès du centre des impôts.",
  },
  {
    nom: "Calcul et déclaration de la patente",
    description:
      "Détermination du montant de la patente et dépôt de la déclaration annuelle correspondante.",
  },
  {
    nom: "Conseil fiscal simplifié",
    description:
      "Conseils pratiques adaptés au régime simplifié pour une bonne gestion des obligations fiscales.",
  },
  {
    nom: "Assistance en cas de contrôle fiscal",
    description:
      "Accompagnement et représentation du client lors des vérifications et contrôles de l'administration fiscale.",
  },
];

const ECHEANCES: Echeance[] = [
  {
    label: "TVA, AIR, Précompte",
    periode: "15 du mois suivant",
    description:
      "Déclarations et paiements mensuels à déposer au plus tard le 15 du mois suivant la période concernée.",
    regimes: ["reel"],
    jourReference: 15,
  },
  {
    label: "DSF",
    periode: "15 mars",
    description:
      "Déclaration Statistique et Fiscale annuelle à déposer avant le 15 mars de l'exercice suivant.",
    regimes: ["reel"],
    moisReference: 3,
    jourReference: 15,
  },
  {
    label: "Patente",
    periode: "15 mars",
    description:
      "Déclaration et paiement de la contribution des patentes avant le 15 mars de chaque année.",
    regimes: ["reel", "igs", "non_professionnel"],
    moisReference: 3,
    jourReference: 15,
  },
  {
    label: "IGS",
    periode: "Trimestriel",
    description:
      "Déclaration et paiement de l'Impôt Global et Synthétique à la fin de chaque trimestre.",
    regimes: ["igs"],
  },
  {
    label: "CNPS (déclaration annuelle des salaires)",
    periode: "Annuel",
    description:
      "Déclaration annuelle des salaires versés auprès de la Caisse Nationale de Prévoyance Sociale.",
    regimes: ["reel", "igs", "non_professionnel"],
    moisReference: 1,
    jourReference: 31,
  },
];

const REGIME_LABELS: Record<string, string> = {
  reel: "Réel",
  igs: "IGS (Impôt Global Synthétique)",
  non_professionnel: "Non professionnel",
};

const STATUT_CONFIG: Record<string, { label: string; className: string }> = {
  actif: {
    label: "Actif",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  inactif: {
    label: "Inactif",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  archive: {
    label: "Archivé",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

function getEcheanceColor(echeance: Echeance): string {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (!echeance.moisReference || !echeance.jourReference) {
    // Recurring (monthly/quarterly) -- always "upcoming"
    return "text-amber-600";
  }

  const deadlineMonth = echeance.moisReference;
  const deadlineDay = echeance.jourReference;

  if (
    currentMonth < deadlineMonth ||
    (currentMonth === deadlineMonth && currentDay < deadlineDay)
  ) {
    // Deadline is in the future within the year
    const monthsAway =
      deadlineMonth - currentMonth + (currentDay > deadlineDay ? -1 : 0);
    if (monthsAway <= 1) {
      return "text-amber-600"; // upcoming
    }
    return "text-green-600"; // future
  }

  if (currentMonth === deadlineMonth && currentDay === deadlineDay) {
    return "text-amber-600"; // today
  }

  // Past this year's deadline
  return "text-red-600";
}

export function ContratPrestations({ client }: ContratPrestationsProps) {
  const clientName = client.nom || client.raisonsociale || "Client";
  const prestations =
    client.regimefiscal === "reel" ? PRESTATIONS_REEL : PRESTATIONS_IGS;
  const echeances = useMemo(
    () => ECHEANCES.filter((e) => e.regimes.includes(client.regimefiscal)),
    [client.regimefiscal]
  );

  const statutConfig = STATUT_CONFIG[client.statut] ?? STATUT_CONFIG.actif;

  return (
    <div className="space-y-6">
      {/* Section 1: Résumé du contrat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Résumé du contrat
          </CardTitle>
          <CardDescription>
            Informations contractuelles pour {clientName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Client
                </p>
                <p className="text-sm font-semibold">{clientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Type de gestion
                </p>
                <Badge
                  variant={
                    client.gestionexternalisee ? "default" : "secondary"
                  }
                  className="mt-1"
                >
                  {client.gestionexternalisee ? "Externalisée" : "Interne"}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Régime fiscal
                </p>
                <Badge variant="outline" className="mt-1">
                  {REGIME_LABELS[client.regimefiscal] || client.regimefiscal}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Secteur d'activité
                </p>
                <p className="text-sm">{client.secteuractivite || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Centre de rattachement
                </p>
                <p className="text-sm">{client.centrerattachement || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Statut du client
                </p>
                <Badge variant="outline" className={`mt-1 ${statutConfig.className}`}>
                  {statutConfig.label}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Prestations incluses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Prestations incluses
          </CardTitle>
          <CardDescription>
            Services couverts par le contrat en régime{" "}
            {REGIME_LABELS[client.regimefiscal] || client.regimefiscal}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prestations.map((prestation) => (
              <div
                key={prestation.nom}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{prestation.nom}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {prestation.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Échéances fiscales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Échéances fiscales
          </CardTitle>
          <CardDescription>
            Calendrier des obligations fiscales et sociales au Cameroun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {echeances.map((echeance) => {
              const colorClass = getEcheanceColor(echeance);
              return (
                <div
                  key={echeance.label}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <Calendar className={`h-5 w-5 mt-0.5 shrink-0 ${colorClass}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{echeance.label}</p>
                      <Badge
                        variant="outline"
                        className={colorClass}
                      >
                        {echeance.periode}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {echeance.description}
                    </p>
                  </div>
                  {colorClass === "text-red-600" && (
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
