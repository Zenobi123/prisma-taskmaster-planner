
import { UserCheck, Clock, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ClientStatsCardsProps {
  clientsData: any[];
  formatMontant: (montant: number) => string;
  totalSolde: number;
}

export const ClientStatsCards = ({ clientsData, formatMontant, totalSolde }: ClientStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-600" />
            Clients à jour
          </CardTitle>
          <CardDescription>Nombre de clients sans impayés</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {clientsData.filter(c => c.statut === "à jour").length} clients
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Clients en retard
          </CardTitle>
          <CardDescription>Nombre de clients en retard de paiement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {clientsData.filter(c => c.statut === "en_retard").length} clients
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Impayés
          </CardTitle>
          <CardDescription>Total des impayés clients</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatMontant(totalSolde)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
