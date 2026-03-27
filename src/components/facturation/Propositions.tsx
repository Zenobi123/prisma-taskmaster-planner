
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { usePropositions } from "@/hooks/facturation/usePropositions";
import PropositionTable from "./propositions/PropositionTable";
import PropositionFilters from "./propositions/PropositionFilters";
import CreatePropositionDialog from "./propositions/CreatePropositionDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Proposition as PropositionType } from "@/types/proposition";

const Propositions = () => {
  const {
    filteredPropositions,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    allClients,
    createProposition,
    deleteProposition,
    editProposition,
    isSubmitting,
  } = usePropositions();

  const isMobile = useIsMobile();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleEdit = (proposition: PropositionType) => {
    editProposition(proposition);
  };

  const handleDelete = (propositionId: string) => {
    deleteProposition(propositionId);
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
          Propositions de paiement
        </CardTitle>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-[#84A98C] hover:bg-[#6B8F73] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle proposition
        </Button>
      </CardHeader>

      <CardContent className={`p-3 ${isMobile ? "" : "p-4"}`}>
        <PropositionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          clientFilter={clientFilter}
          onClientChange={setClientFilter}
          clients={allClients}
        />

        <div className="mt-4">
          <PropositionTable
            propositions={filteredPropositions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>

        <CreatePropositionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          clients={allClients}
          onSubmit={(data) => {
            createProposition(data);
            setCreateDialogOpen(false);
          }}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default Propositions;
