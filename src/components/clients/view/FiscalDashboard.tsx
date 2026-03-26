
import { useMemo } from "react";
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateAllTaxes, formatMoney, FiscalInput, FiscalResult } from "@/utils/fiscalCalculations";
import { Building2, Landmark, Receipt, Home, Store, Wine, Calculator, TrendingUp } from "lucide-react";

interface FiscalDashboardProps {
  client: Client;
}

const REGIME_LABELS: Record<string, string> = {
  reel: "Régime Réel",
  igs: "Impôt Général Synthétique",
  non_professionnel: "Non Professionnel",
  obnl: "OBNL",
};

export function FiscalDashboard({ client }: FiscalDashboardProps) {
  const chiffreAffaires = client.chiffreaffaires || 0;

  const input: FiscalInput = useMemo(() => ({
    regimeFiscal: client.regimefiscal,
    chiffreAffaires,
    isCGA: client.iscga || false,
    isVendeurBoissons: client.isvendeurboissons || false,
    modePaiementIGS: client.modepaiementigs || "trimestriel",
    situationImmobiliere: client.situationimmobiliere
      ? {
          type: client.situationimmobiliere.type,
          loyerMensuel: client.situationimmobiliere.loyer,
          valeurBien: client.situationimmobiliere.valeur,
        }
      : undefined,
    modePaiementPSL: client.modepaiementpsl || "trimestriel",
  }), [client]);

  const result: FiscalResult = useMemo(() => calculateAllTaxes(input), [input]);

  if (chiffreAffaires === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Aucune donnée fiscale. Renseignez le chiffre d&apos;affaires du client pour voir les calculs fiscaux.
        </CardContent>
      </Card>
    );
  }

  const regime = client.regimefiscal;
  const isLocataire =
    client.situationimmobiliere?.type === "locataire";
  const isProprietaire =
    client.situationimmobiliere?.type === "proprietaire";

  const taxCards: {
    key: string;
    label: string;
    amount: number;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    show: boolean;
  }[] = [
    {
      key: "igs",
      label: "IGS",
      amount: result.igs,
      description: "Impôt Général Synthétique",
      icon: <Landmark className="h-5 w-5 text-blue-500" />,
      badge: `Classe ${result.igsClasse}`,
      show: regime === "igs" && result.igs > 0,
    },
    {
      key: "patente",
      label: "Patente",
      amount: result.patente,
      description: "Contribution des patentes",
      icon: <Building2 className="h-5 w-5 text-indigo-500" />,
      show: regime === "reel" && result.patente > 0,
    },
    {
      key: "tdl",
      label: "TDL",
      amount: result.tdl,
      description: "Taxe de Développement Local",
      icon: <Receipt className="h-5 w-5 text-purple-500" />,
      show: result.tdl > 0,
    },
    {
      key: "soldeIR",
      label: "Solde IR",
      amount: result.soldeIR,
      description: "Solde de l'Impôt sur le Revenu",
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      show: regime === "reel" && result.soldeIR > 0,
    },
    {
      key: "licence",
      label: "Licence",
      amount: result.licence,
      description: "Licence vendeur de boissons",
      icon: <Wine className="h-5 w-5 text-amber-500" />,
      show: (client.isvendeurboissons || false) && result.licence > 0,
    },
    {
      key: "psl",
      label: "PSL",
      amount: result.psl,
      description: "Précompte sur Loyer",
      icon: <Home className="h-5 w-5 text-teal-500" />,
      show: isLocataire && result.psl > 0,
    },
    {
      key: "bail",
      label: "Bail",
      amount: result.bail,
      description: `Droit d'enregistrement du bail (${result.tauxBail}%)`,
      icon: <Store className="h-5 w-5 text-rose-500" />,
      show: result.bail > 0,
    },
    {
      key: "tf",
      label: "Taxe Foncière",
      amount: result.tf,
      description: "Taxe foncière sur la propriété",
      icon: <Calculator className="h-5 w-5 text-green-500" />,
      show: isProprietaire && result.tf > 0,
    },
  ];

  const visibleCards = taxCards.filter((card) => card.show);

  const total = visibleCards.reduce((sum, card) => sum + card.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 py-4">
          <Badge variant="outline" className="text-sm">
            {REGIME_LABELS[regime] || regime}
          </Badge>
          <div className="text-sm text-muted-foreground">
            CA : <span className="font-semibold text-foreground">{formatMoney(chiffreAffaires)}</span>
          </div>
          {client.iscga && (
            <Badge variant="secondary" className="text-sm">
              CGA
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Tax cards grid */}
      {visibleCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleCards.map((card) => (
            <Card key={card.key}>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                {card.icon}
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {card.label}
                    {card.badge && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {card.badge}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{formatMoney(card.amount)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            Aucun impôt calculé pour ce régime fiscal.
          </CardContent>
        </Card>
      )}

      {/* Total */}
      {visibleCards.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between py-4">
            <span className="text-lg font-semibold">Total des obligations fiscales</span>
            <span className="text-2xl font-bold text-primary">{formatMoney(total)}</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
