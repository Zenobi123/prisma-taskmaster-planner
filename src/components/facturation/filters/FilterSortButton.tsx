
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, SortAsc, SortDesc } from "lucide-react";

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
          className="text-sm flex items-center gap-2 h-9 border-neutral-300 bg-white hover:bg-neutral-100 hover:text-neutral-800 transition-all"
        >
          <span>Trier par: {sortKey === "date" ? "Date" : "Montant"}</span>
          {sortKey === "date" ? (
            sortDirection === "asc" ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />
          ) : (
            sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-neutral-200 shadow-md">
        <DropdownMenuItem 
          onClick={() => toggleSort("date")} 
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          Date {sortKey === "date" && (
            sortDirection === "asc" ? <ArrowUpAZ className="h-4 w-4 ml-1" /> : <ArrowDownAZ className="h-4 w-4 ml-1" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleSort("montant")} 
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          Montant {sortKey === "montant" && (
            sortDirection === "asc" ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterSortButton;
