
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FactureSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const FactureSearchBar = ({ searchTerm, setSearchTerm }: FactureSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Rechercher..."
        className="pl-9 w-64 border-gray-300 focus:border-[#84A98C] focus:ring-[#84A98C]/20"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default FactureSearchBar;
