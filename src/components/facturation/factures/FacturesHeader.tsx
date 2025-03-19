
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import { FileText, Plus, Search } from "lucide-react";

interface FacturesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export const FacturesHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onCreateClick 
}: FacturesHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle className="text-xl flex items-center gap-2">
        <FileText className="h-5 w-5" /> 
        Gestion des factures
      </CardTitle>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8 w-64"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
        </Button>
      </div>
    </div>
  );
};
