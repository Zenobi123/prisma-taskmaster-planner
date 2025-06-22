
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import usePaiements from "@/hooks/usePaiements";
import PaiementDialog from "@/components/facturation/paiements/PaiementDialog";
import PaiementsList from "./paiements/PaiementsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMontant } from "@/utils/formatUtils";
import { Badge } from "@/components/ui/badge";

const Paiements = () => {
  const { 
    searchTerm, 
    setSearchTerm,
    filteredPaiements,
    loading,
    addPaiement,
    deletePaiement,
    dialogOpen,
    setDialogOpen,
    refreshPaiements
  } = usePaiements();

  const [modeFilter, setModeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter paiements based on additional criteria
  const finalFilteredPaiements = filteredPaiements.filter(paiement => {
    const matchesMode = modeFilter === "all" || paiement.mode === modeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "credit" && paiement.est_credit) ||
      (statusFilter === "verified" && paiement.est_verifie) ||
      (statusFilter === "pending" && !paiement.est_verifie);
    
    return matchesMode && matchesStatus;
  });

  // Calculate statistics
  const totalPaiements = finalFilteredPaiements.reduce((sum, p) => sum + p.montant, 0);
  const totalCredits = finalFilteredPaiements.filter(p => p.est_credit).reduce((sum, p) => sum + p.montant, 0);
  const totalVerified = finalFilteredPaiements.filter(p => p.est_verifie).reduce((sum, p) => sum + p.montant, 0);
  const pendingVerification = finalFilteredPaiements.filter(p => !p.est_verifie).length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMontant(totalPaiements)}</div>
            <p className="text-xs text-muted-foreground">
              {finalFilteredPaiements.length} paiement{finalFilteredPaiements.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avances Client</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatMontant(totalCredits)}</div>
            <p className="text-xs text-muted-foreground">
              Crédits disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vérifiés</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatMontant(totalVerified)}</div>
            <p className="text-xs text-muted-foreground">
              Paiements confirmés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Filter className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingVerification}</div>
            <p className="text-xs text-muted-foreground">
              À vérifier
              {pendingVerification > 0 && (
                <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                  Action requise
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher un paiement..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les modes</SelectItem>
              <SelectItem value="espèces">Espèces</SelectItem>
              <SelectItem value="virement">Virement</SelectItem>
              <SelectItem value="orange_money">Orange Money</SelectItem>
              <SelectItem value="mtn_money">MTN Money</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="verified">Vérifiés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="credit">Avances</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setDialogOpen(true)} className="gap-1">
          <Plus size={16} />
          Nouveau paiement
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-opacity-50 border-t-primary mx-auto mb-4 rounded-full"></div>
          <p className="text-muted-foreground">Chargement des paiements...</p>
        </div>
      ) : (
        <PaiementsList 
          paiements={finalFilteredPaiements} 
          onDelete={deletePaiement}
        />
      )}

      <PaiementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={addPaiement}
      />
    </div>
  );
};

export default Paiements;
