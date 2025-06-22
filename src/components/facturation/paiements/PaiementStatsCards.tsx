
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Users } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";

interface PaiementStatsCardsProps {
  stats: {
    totalPaiements: number;
    montantTotal: number;
    paiementsEnEspeces: number;
    paiementsVirement: number;
    paiementsOrangeMoney: number;
    paiementsMtnMoney: number;
    paiementsMoisCourant: number;
    evolutionMensuelle: number;
    soldeCredit: number;
    nombreClients: number;
  };
}

const PaiementStatsCards = ({ stats }: PaiementStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total des paiements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total paiements</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatMontant(stats.montantTotal)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalPaiements} paiement{stats.totalPaiements > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Paiements du mois */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.paiementsMoisCourant}</div>
          <div className="flex items-center text-xs">
            {stats.evolutionMensuelle >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={stats.evolutionMensuelle >= 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(stats.evolutionMensuelle)}%
            </span>
            <span className="text-muted-foreground ml-1">vs mois dernier</span>
          </div>
        </CardContent>
      </Card>

      {/* Modes de paiement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Modes préférés</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Espèces</span>
              <Badge variant="outline" className="text-xs">{stats.paiementsEnEspeces}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Virement</span>
              <Badge variant="outline" className="text-xs">{stats.paiementsVirement}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Mobile Money</span>
              <Badge variant="outline" className="text-xs">
                {stats.paiementsOrangeMoney + stats.paiementsMtnMoney}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crédits clients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Crédits clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatMontant(stats.soldeCredit)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.nombreClients} client{stats.nombreClients > 1 ? 's' : ''} avec crédit
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaiementStatsCards;
