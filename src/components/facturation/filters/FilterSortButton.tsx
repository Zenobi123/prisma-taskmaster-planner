
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FilterSortButtonProps {
  sortKey: string;
  sortDirection: "asc" | "desc";
  toggleSort: (key: string) => void;
}

const FilterSortButton = ({ sortKey, sortDirection, toggleSort }: FilterSortButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8"
        >
          Trier par: {sortKey === "date" ? "Date" : "Montant"}
          {sortDirection === "asc" ? " ↑" : " ↓"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleSort("date")}>
          Date {sortKey === "date" && (sortDirection === "asc" ? "↑" : "↓")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleSort("montant")}>
          Montant {sortKey === "montant" && (sortDirection === "asc" ? "↑" : "↓")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterSortButton;
