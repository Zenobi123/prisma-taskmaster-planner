
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollaborateurSearchProps {
  searchTerm: string;
  selectedStatut: string;
  selectedPoste: string;
  isFiltersOpen: boolean;
  postes: string[];
  onSearchChange: (value: string) => void;
  onStatutChange: (value: string) => void;
  onPosteChange: (value: string) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function CollaborateurSearch({
  searchTerm,
  selectedStatut,
  selectedPoste,
  isFiltersOpen,
  postes,
  onSearchChange,
  onStatutChange,
  onPosteChange,
  onFiltersOpenChange,
}: CollaborateurSearchProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
        <Input
          type="text"
          placeholder="Rechercher un collaborateur..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Popover open={isFiltersOpen} onOpenChange={onFiltersOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onFiltersOpenChange(!isFiltersOpen)}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {(selectedStatut !== "all" || selectedPoste !== "all") && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Number(selectedStatut !== "all") + Number(selectedPoste !== "all")}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={selectedStatut}
                onValueChange={onStatutChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Poste</label>
              <Select
                value={selectedPoste}
                onValueChange={onPosteChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un poste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {postes.map((poste) => (
                    <SelectItem key={poste} value={poste}>
                      {poste}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
