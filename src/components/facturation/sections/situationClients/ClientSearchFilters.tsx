
import { Search, FileUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

interface ClientSearchFiltersProps {
  onFilterChange?: (value: string) => void;
}

export const ClientSearchFilters = ({ onFilterChange }: ClientSearchFiltersProps = {}) => {
  const [activeFilter, setActiveFilter] = useState<string>("tous");

  const handleFilterChange = (value: string) => {
    if (!value) return; // Prevent null value
    setActiveFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Rechercher un client..." className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-neutral-200">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
          <Button variant="outline" className="flex items-center gap-2 hover:bg-neutral-200">
            <FileUp className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white">
            <span className="w-4 h-4">+</span>
            Nouvelle relance
          </Button>
        </div>
      </div>
      
      <ToggleGroup 
        type="single" 
        value={activeFilter} 
        onValueChange={handleFilterChange}
        className="justify-start"
      >
        <ToggleGroupItem 
          value="tous" 
          className="data-[state=on]:bg-primary data-[state=on]:text-white font-medium transition-all"
        >
          Tous
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="à_jour" 
          className="data-[state=on]:bg-primary data-[state=on]:text-white font-medium transition-all"
        >
          À jour
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="en_retard" 
          className="data-[state=on]:bg-primary data-[state=on]:text-white font-medium transition-all"
        >
          En retard
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="impayé" 
          className="data-[state=on]:bg-primary data-[state=on]:text-white font-medium transition-all"
        >
          Impayé
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
