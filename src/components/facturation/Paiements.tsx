
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Plus } from "lucide-react";
import { usePaiements } from "@/hooks/usePaiements";
import PaiementSearchBar from "./paiements/PaiementSearchBar";
import PaiementTable from "./paiements/PaiementTable";

const Paiements = () => {
  const { searchTerm, setSearchTerm, filteredPaiements } = usePaiements();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Wallet className="h-5 w-5" /> 
          Gestion des paiements
        </CardTitle>
        <div className="flex items-center gap-2">
          <PaiementSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau paiement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PaiementTable paiements={filteredPaiements} />
      </CardContent>
    </Card>
  );
};

export default Paiements;
