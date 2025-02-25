
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ClientType } from "@/types/client";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: ClientType | "all";
  onTypeChange: (value: ClientType | "all") => void;
  selectedSecteur: string;
  onSecteurChange: (value: string) => void;
}

export function ClientFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSecteur,
  onSecteurChange,
}: ClientFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher un client..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Type de client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="physique">Personne Physique</SelectItem>
          <SelectItem value="morale">Personne Morale</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedSecteur} onValueChange={onSecteurChange}>
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Secteur d'activité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les secteurs</SelectItem>
          <SelectItem value="commerce">Commerce</SelectItem>
          <SelectItem value="services">Services</SelectItem>
          <SelectItem value="industrie">Industrie</SelectItem>
          <SelectItem value="agriculture">Agriculture</SelectItem>
          <SelectItem value="autre">Autre</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
