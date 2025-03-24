
import { Button } from "@/components/ui/button";

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
      className="text-xs h-8"
    >
      Réinitialiser
    </Button>
  );
};

export default FilterResetButton;
