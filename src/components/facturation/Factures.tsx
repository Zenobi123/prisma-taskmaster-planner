
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import FactureTable from "./FactureTable";
import { useFactures } from "@/hooks/facturation/useFactures";
import CreateFactureDialog from "./factures/CreateFactureDialog";
import FactureFilters from "./FactureFilters";
import FacturePagination from "./FacturePagination";
import EditFactureDialog from "./factures/EditFactureDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const Factures = () => {
  const {
    searchTerm,
    setSearchTerm,
    paginatedFactures,
    filteredFactures,
    handleVoirFacture, 
    handleTelechargerFacture,
    handleEditFacture,
    deleteFacture,
    sendFacture,
    cancelFacture,
    statusFilter,
    setStatusFilter,
    statusPaiementFilter,
    setStatusPaiementFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    totalPages,
    allClients,
    // Edit dialog state
    editFactureDialogOpen,
    setEditFactureDialogOpen,
    currentEditFacture,
    setCurrentEditFacture
  } = useFactures();

  const isMobile = useIsMobile();

  const handleEditSuccess = () => {
    setEditFactureDialogOpen(false);
  };

  // Référence : totaux affichés sous la liste filtrée
  // (Total Impôts / Total Honoraires / Total Général / Factures Payées).
  const totaux = useMemo(() => {
    return filteredFactures.reduce(
      (acc, f) => {
        acc.impots += f.montant_impots || 0;
        acc.honoraires += f.montant_honoraires || 0;
        acc.general += f.montant || 0;
        if (f.status_paiement === "payée") acc.payees += f.montant || 0;
        return acc;
      },
      { impots: 0, honoraires: 0, general: 0, payees: 0 },
    );
  }, [filteredFactures]);

  return (
    <Card className="shadow-md border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row items-center justify-between'} pb-4 bg-gray-50 border-b`}>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-gray-800">
          <FileText className="h-5 w-5 text-[#84A98C]" /> 
          Gestion des factures
        </CardTitle>
        <CreateFactureDialog clients={allClients} />
      </CardHeader>
      <CardContent className={`p-3 ${isMobile ? '' : 'p-4'}`}>
        <FactureFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusPaiementFilter={statusPaiementFilter}
          setStatusPaiementFilter={setStatusPaiementFilter}
          clientFilter={clientFilter}
          setClientFilter={setClientFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          clients={allClients}
          isMobile={isMobile}
        />
        
        <div className="mt-4">
          <FactureTable 
            factures={paginatedFactures}
            formatMontant={formatMontant}
            onViewFacture={handleVoirFacture}
            onDownloadFacture={handleTelechargerFacture}
            onDeleteFacture={deleteFacture}
            onEditFacture={handleEditFacture}
            onSendFacture={sendFacture}
            onCancelFacture={cancelFacture}
            isMobile={isMobile}
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

        {filteredFactures.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-semibold">Total Impôts</p>
              <p className="text-xl font-bold text-blue-900">{formatMontant(totaux.impots)}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-xs text-green-600 font-semibold">Total Honoraires</p>
              <p className="text-xl font-bold text-green-900">{formatMontant(totaux.honoraires)}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 font-semibold">Total Général</p>
              <p className="text-xl font-bold text-gray-900">{formatMontant(totaux.general)}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-xs text-emerald-600 font-semibold">Factures Payées</p>
              <p className="text-xl font-bold text-emerald-900">{formatMontant(totaux.payees)}</p>
            </div>
          </div>
        )}

        {/* Edit Facture Dialog */}
        <EditFactureDialog 
          facture={currentEditFacture}
          open={editFactureDialogOpen}
          onOpenChange={setEditFactureDialogOpen}
          onSuccess={handleEditSuccess}
        />
      </CardContent>
    </Card>
  );
};

export default Factures;
