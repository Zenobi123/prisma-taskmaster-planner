
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw } from "lucide-react";

interface FacturationHeaderProps {
  onNewFactureClick: () => void;
  onRefreshClick: () => void;
  onSearchChange: (value: string) => void;
}

export const FacturationHeader = ({
  onNewFactureClick,
  onRefreshClick,
  onSearchChange
}: FacturationHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold">Facturation</h1>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8 w-full sm:w-[250px] bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefreshClick}
          title="Rafraîchir"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={onNewFactureClick}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>
    </div>
  );
};
