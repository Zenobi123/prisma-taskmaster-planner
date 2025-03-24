
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterResetButtonProps {
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const FilterResetButton = ({ hasActiveFilters, clearFilters }: FilterResetButtonProps) => {
  if (!hasActiveFilters) return null;
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={clearFilters}
      className="text-sm flex items-center gap-1 h-9 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
    >
      <X className="h-3.5 w-3.5" /> Réinitialiser
    </Button>
  );
};

export default FilterResetButton;
