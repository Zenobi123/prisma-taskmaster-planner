
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw } from "lucide-react";
import usePaiements from "@/hooks/usePaiements";
import PaiementDialog from "./paiements/dialog/PaiementDialog";
import PaiementsList from "./paiements/PaiementsList";

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshPaiements}
            className="h-9 w-9"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Actualiser</span>
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="gap-1">
            <Plus size={16} />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-opacity-50 border-t-primary mx-auto mb-4 rounded-full"></div>
          <p className="text-muted-foreground">Chargement des paiements...</p>
        </div>
      ) : (
        <PaiementsList 
          paiements={filteredPaiements} 
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
