
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface FilterActionsProps {
  hasAnyFilters: boolean;
  clearFilters: () => void;
}

const FilterActions = ({ hasAnyFilters, clearFilters }: FilterActionsProps) => {
  if (!hasAnyFilters) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={clearFilters}
      className="flex items-center gap-1"
    >
      <RefreshCcw className="h-3.5 w-3.5" />
      Réinitialiser
    </Button>
  );
};

export default FilterActions;
