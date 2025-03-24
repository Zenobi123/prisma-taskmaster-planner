
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterSearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const FilterSearchInput = ({ searchTerm, setSearchTerm }: FilterSearchInputProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
      <Input
        placeholder="Rechercher une facture..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 h-10 text-sm border-neutral-300 focus-visible:ring-primary/30 focus-visible:border-primary w-full"
      />
    </div>
  );
};

export default FilterSearchInput;
