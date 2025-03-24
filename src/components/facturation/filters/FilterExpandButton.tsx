
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FilterExpandButtonProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const FilterExpandButton = ({ expanded, setExpanded }: FilterExpandButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => setExpanded(!expanded)}
      className="text-sm flex items-center gap-2 h-9 border-neutral-300 bg-white hover:bg-neutral-100 hover:text-neutral-800 transition-all"
    >
      {expanded ? (
        <>Masquer les filtres <ChevronUp className="h-4 w-4" /></>
      ) : (
        <>Afficher les filtres <ChevronDown className="h-4 w-4" /></>
      )}
    </Button>
  );
};

export default FilterExpandButton;
