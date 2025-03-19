
import { Search, FileUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ClientSearchFilters = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder="Rechercher un client..." className="pl-10" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtres
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileUp className="w-4 h-4" />
          Exporter
        </Button>
        <Button className="flex items-center gap-2">
          <span className="w-4 h-4">+</span>
          Nouvelle relance
        </Button>
      </div>
    </div>
  );
};
