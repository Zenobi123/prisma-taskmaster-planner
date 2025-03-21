
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FilterX } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import FactureTable from "./FactureTable";
import { useFactures } from "@/hooks/useFactures";
import CreateFactureDialog from "./factures/CreateFactureDialog";
import FactureFilters from "./FactureFilters";
import FacturePagination from "./FacturePagination";
import { Button } from "@/components/ui/button";
import { Facture } from "@/types/facture";

const Factures = () => {
  const { 
    searchTerm, 
    setSearchTerm,
    paginatedFactures,
    factures,
    setFactures,
    handleVoirFacture, 
    handleTelechargerFacture,
    handleModifierFacture,
    handleAnnulerFacture,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter,
    periodeFilter,
    setPeriodeFilter,
    montantFilter,
    setMontantFilter,
    modePaiementFilter,
    setModePaiementFilter,
    clearFilters,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    totalPages,
    allClients
  } = useFactures();

  const hasActiveFilters = !!(
    searchTerm || 
    statusFilter || 
    clientFilter || 
    dateFilter || 
    periodeFilter.debut || 
    periodeFilter.fin || 
    montantFilter.min || 
    montantFilter.max || 
    modePaiementFilter
  );

  const onEditFacture = (facture: Facture, updatedData: Partial<Facture>) => {
    const updatedFacture = handleModifierFacture(facture, updatedData);
    setFactures(prev => prev.map(f => f.id === updatedFacture.id ? updatedFacture : f));
  };

  const onCancelFacture = (facture: Facture) => {
    const canceledFacture = handleAnnulerFacture(facture);
    setFactures(prev => prev.map(f => f.id === canceledFacture.id ? canceledFacture : f));
  };

  return (
    <Card className="shadow-md border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-[#84A98C]" /> 
            Gestion des factures
          </CardTitle>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600"
              >
                <FilterX className="h-4 w-4" />
                Effacer tous les filtres
              </Button>
            )}
            <CreateFactureDialog />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <FactureFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          clientFilter={clientFilter}
          setClientFilter={setClientFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          periodeFilter={periodeFilter}
          setPeriodeFilter={setPeriodeFilter}
          montantFilter={montantFilter}
          setMontantFilter={setMontantFilter}
          modePaiementFilter={modePaiementFilter}
          setModePaiementFilter={setModePaiementFilter}
          clearFilters={clearFilters}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          clients={allClients}
        />
        
        <div className="mt-4">
          <FactureTable 
            factures={paginatedFactures}
            formatMontant={formatMontant}
            onViewFacture={handleVoirFacture}
            onDownloadFacture={handleTelechargerFacture}
            onEditFacture={onEditFacture}
            onCancelFacture={onCancelFacture}
          />
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <FacturePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Factures;
