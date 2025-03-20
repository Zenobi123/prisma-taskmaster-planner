
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PaiementSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const PaiementSearchBar = ({ searchTerm, setSearchTerm }: PaiementSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Rechercher..."
        className="pl-8 w-64"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default PaiementSearchBar;
