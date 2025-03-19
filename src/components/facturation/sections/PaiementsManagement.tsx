
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { facturesMockData, formatMontant } from "@/data/factureData";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export const PaiementsManagement = () => {
  const [currentView, setCurrentView] = useState<'all' | 'pending' | 'paid'>('all');

  // Calcul des statistiques de paiement
  const totalFactures = facturesMockData.length;
  const facturesPaid = facturesMockData.filter(f => f.status === 'payée').length;
  const facturesPending = facturesMockData.filter(f => f.status === 'en_attente').length;
  const facturesSent = facturesMockData.filter(f => f.status === 'envoyée').length;
  
  const totalAmount = facturesMockData.reduce((sum, facture) => sum + facture.montant, 0);
  const paidAmount = facturesMockData
    .filter(f => f.status === 'payée')
    .reduce((sum, facture) => sum + facture.montant, 0);

  const paymentRate = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestion des paiements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de recouvrement</CardTitle>
            <CardDescription>
              {paymentRate.toFixed(0)}% des factures payées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={paymentRate} className="h-2" />
            <div className="mt-2 text-xs text-right text-neutral-500">
              {formatMontant(paidAmount)} / {formatMontant(totalAmount)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Statut des factures</CardTitle>
            <CardDescription>
              Répartition par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Payées</span>
                <span className="text-sm font-medium text-green-600 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {facturesPaid} ({Math.round((facturesPaid/totalFactures)*100)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">En attente</span>
                <span className="text-sm font-medium text-amber-600 flex items-center">
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                  {facturesPending} ({Math.round((facturesPending/totalFactures)*100)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Envoyées</span>
                <span className="text-sm font-medium text-blue-600 flex items-center">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  {facturesSent} ({Math.round((facturesSent/totalFactures)*100)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actions populaires</CardTitle>
            <CardDescription>
              Raccourcis fréquemment utilisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="text-sm text-blue-600 hover:underline block w-full text-left">
                Enregistrer un paiement
              </button>
              <button className="text-sm text-blue-600 hover:underline block w-full text-left">
                Factures en retard
              </button>
              <button className="text-sm text-blue-600 hover:underline block w-full text-left">
                Relancer un client
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Liste des paiements récents - à implémenter */}
      <Card>
        <CardHeader>
          <CardTitle>Paiements récents</CardTitle>
          <CardDescription>
            Les 5 derniers paiements enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500 py-4 text-center">
            La liste des paiements récents sera affichée ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
