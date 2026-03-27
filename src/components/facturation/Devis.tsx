
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useDevis } from "@/hooks/facturation/useDevis";
import DevisTable from "./devis/DevisTable";
import DevisFilters from "./devis/DevisFilters";
import CreateDevisDialog from "./devis/CreateDevisDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Devis as DevisType } from "@/types/devis";

const Devis = () => {
  const {
    filteredDevis,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    allClients,
    createDevis,
    deleteDevis,
    convertDevis,
    editDevis,
    isSubmitting,
  } = useDevis();

  const isMobile = useIsMobile();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleEdit = (devis: DevisType) => {
    editDevis(devis);
  };

  const handleDelete = (devisId: string) => {
    deleteDevis(devisId);
  };

  const handleConvert = (devis: DevisType) => {
    convertDevis(devis);
  };

  return (
    <Card className="shadow-md border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader
        className={`flex ${
          isMobile ? "flex-col gap-3" : "flex-row items-center justify-between"
        } pb-4 bg-gray-50 border-b`}
      >
        <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-gray-800">
          <FileText className="h-5 w-5 text-[#84A98C]" />
          Gestion des devis
        </CardTitle>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-[#84A98C] hover:bg-[#6B8F73] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau devis
        </Button>
      </CardHeader>

      <CardContent className={`p-3 ${isMobile ? "" : "p-4"}`}>
        <DevisFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          clientFilter={clientFilter}
          onClientChange={setClientFilter}
          clients={allClients}
        />

        <div className="mt-4">
          <DevisTable
            devis={filteredDevis}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onConvert={handleConvert}
            isLoading={isLoading}
          />
        </div>

        <CreateDevisDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          clients={allClients}
          onSubmit={(data) => {
            createDevis(data);
            setCreateDialogOpen(false);
          }}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default Devis;
