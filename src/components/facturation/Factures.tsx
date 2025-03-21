
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import FactureTable from "./FactureTable";
import { useFactures } from "@/hooks/useFactures";
import CreateFactureDialog from "./factures/CreateFactureDialog";
import FactureFilters from "./FactureFilters";
import FacturePagination from "./FacturePagination";
import EditFactureDialog from "./factures/EditFactureDialog";

const Factures = () => {
  const { 
    searchTerm, 
    setSearchTerm,
    paginatedFactures,
    handleVoirFacture, 
    handleTelechargerFacture,
    handleEditFacture,
    deleteFacture,
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

  const handleEditSuccess = () => {
    setEditFactureDialogOpen(false);
  };

  return (
    <Card className="shadow-md border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
          <FileText className="h-5 w-5 text-[#84A98C]" /> 
          Gestion des factures
        </CardTitle>
        <CreateFactureDialog />
      </CardHeader>
      <CardContent className="p-4">
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
        />
        
        <div className="mt-4">
          <FactureTable 
            factures={paginatedFactures}
            formatMontant={formatMontant}
            onViewFacture={handleVoirFacture}
            onDownloadFacture={handleTelechargerFacture}
            onDeleteFacture={deleteFacture}
            onEditFacture={handleEditFacture}
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
