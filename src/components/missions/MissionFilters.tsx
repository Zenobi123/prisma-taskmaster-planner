import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MissionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const MissionFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: MissionFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une mission..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px] bg-background border-input">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="en_cours">En cours</SelectItem>
          <SelectItem value="planifiee">Planifiée</SelectItem>
          <SelectItem value="terminee">Terminée</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MissionFilters;
