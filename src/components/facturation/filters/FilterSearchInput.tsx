
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterSearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const FilterSearchInput = ({ searchTerm, setSearchTerm }: FilterSearchInputProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Rechercher une facture..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 h-9 text-sm"
      />
    </div>
  );
};

export default FilterSearchInput;
