
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";
import usePaiements from "@/hooks/usePaiements";
import PaiementDialog from "@/components/facturation/paiements/PaiementDialog";
import PaiementsList from "./paiements/PaiementsList";
import PaiementStatsCards from "./paiements/PaiementStatsCards";
import PaiementFilters from "./paiements/PaiementFilters";
import { Paiement } from "@/types/paiement";
import { isAfter, isBefore, parseISO } from "date-fns";

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

  // Filtres avancés
  const [filters, setFilters] = useState({
    mode: "",
    client: "",
    dateDebut: null as Date | null,
    dateFin: null as Date | null,
    montantMin: "",
    montantMax: "",
    estCredit: ""
  });

  // Application des filtres avancés
  const finalFilteredPaiements = useMemo(() => {
    let filtered = filteredPaiements;

    // Filtre par mode de paiement
    if (filters.mode) {
      filtered = filtered.filter(p => p.mode === filters.mode);
    }

    // Filtre par client
    if (filters.client) {
      filtered = filtered.filter(p => p.client.includes(filters.client));
    }

    // Filtre par date
    if (filters.dateDebut || filters.dateFin) {
      filtered = filtered.filter(p => {
        const paiementDate = parseISO(p.date);
        if (filters.dateDebut && isBefore(paiementDate, filters.dateDebut)) return false;
        if (filters.dateFin && isAfter(paiementDate, filters.dateFin)) return false;
        return true;
      });
    }

    // Filtre par montant
    if (filters.montantMin) {
      filtered = filtered.filter(p => p.montant >= parseFloat(filters.montantMin));
    }
    if (filters.montantMax) {
      filtered = filtered.filter(p => p.montant <= parseFloat(filters.montantMax));
    }

    // Filtre par type (crédit ou paiement)
    if (filters.estCredit) {
      const isCredit = filters.estCredit === "true";
      filtered = filtered.filter(p => p.est_credit === isCredit);
    }

    return filtered;
  }, [filteredPaiements, filters]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const totalPaiements = finalFilteredPaiements.length;
    const montantTotal = finalFilteredPaiements.reduce((sum, p) => sum + p.montant, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const paiementsMoisCourant = finalFilteredPaiements.filter(p => {
      const pDate = parseISO(p.date);
      return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
    }).length;

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const paiementsMoisPrecedent = finalFilteredPaiements.filter(p => {
      const pDate = parseISO(p.date);
      return pDate.getMonth() === lastMonth && pDate.getFullYear() === lastMonthYear;
    }).length;

    const evolutionMensuelle = paiementsMoisPrecedent > 0 
      ? ((paiementsMoisCourant - paiementsMoisPrecedent) / paiementsMoisPrecedent) * 100 
      : 0;

    const paiementsEnEspeces = finalFilteredPaiements.filter(p => p.mode === "espèces").length;
    const paiementsVirement = finalFilteredPaiements.filter(p => p.mode === "virement").length;
    const paiementsOrangeMoney = finalFilteredPaiements.filter(p => p.mode === "orange_money").length;
    const paiementsMtnMoney = finalFilteredPaiements.filter(p => p.mode === "mtn_money").length;

    const credits = finalFilteredPaiements.filter(p => p.est_credit);
    const soldeCredit = credits.reduce((sum, p) => sum + p.montant, 0);
    const nombreClients = new Set(credits.map(p => p.client)).size;

    return {
      totalPaiements,
      montantTotal,
      paiementsMoisCourant,
      evolutionMensuelle,
      paiementsEnEspeces,
      paiementsVirement,
      paiementsOrangeMoney,
      paiementsMtnMoney,
      soldeCredit,
      nombreClients
    };
  }, [finalFilteredPaiements]);

  // Liste unique des clients pour les filtres
  const uniqueClients = useMemo(() => {
    return Array.from(new Set(filteredPaiements.map(p => p.client))).sort();
  }, [filteredPaiements]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      mode: "",
      client: "",
      dateDebut: null,
      dateFin: null,
      montantMin: "",
      montantMax: "",
      estCredit: ""
    });
  };

  const handleExport = () => {
    // TODO: Implémenter l'export des paiements
    console.log("Export des paiements");
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Paiements</h2>
          <p className="text-gray-600">Gestion des paiements et crédits clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshPaiements} className="gap-2">
            <RefreshCw size={16} />
            Actualiser
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download size={16} />
            Exporter
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus size={16} />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <PaiementStatsCards stats={stats} />

      {/* Filtres */}
      <PaiementFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        clients={uniqueClients}
      />

      {/* Liste des paiements */}
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

      {/* Dialog nouveau paiement */}
      <PaiementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={addPaiement}
      />
    </div>
  );
};

export default Paiements;
