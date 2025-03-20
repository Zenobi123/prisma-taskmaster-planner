
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import FactureSearchBar from "./FactureSearchBar";
import FactureTable from "./FactureTable";
import { useFactures } from "@/hooks/useFactures";

const Factures = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredFactures, 
    handleVoirFacture, 
    handleTelechargerFacture 
  } = useFactures();

  return (
    <Card className="shadow-sm border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
          <FileText className="h-5 w-5 text-[#84A98C]" /> 
          Gestion des factures
        </CardTitle>
        <div className="flex items-center gap-3">
          <FactureSearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          <Button className="bg-[#84A98C] hover:bg-[#6B8E74] shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <FactureTable 
          factures={filteredFactures}
          formatMontant={formatMontant}
          onViewFacture={handleVoirFacture}
          onDownloadFacture={handleTelechargerFacture}
        />
      </CardContent>
    </Card>
  );
};

export default Factures;
