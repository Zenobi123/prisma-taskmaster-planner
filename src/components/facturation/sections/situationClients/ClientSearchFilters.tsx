
import React, { useState } from "react";
import { Search, FileUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {["tous", "à_jour", "en_retard", "impayé"].map((filter) => (
          <div
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-300 ${
              activeFilter === filter 
                ? "bg-primary text-white font-medium shadow-md" 
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {filter === "tous" && "Tous"}
            {filter === "à_jour" && "À jour"}
            {filter === "en_retard" && "En retard"}
            {filter === "impayé" && "Impayé"}
          </div>
        ))}
      </div>
    </div>
  );
};
