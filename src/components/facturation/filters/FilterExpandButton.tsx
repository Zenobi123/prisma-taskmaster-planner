
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
      className="text-xs flex items-center gap-1 h-8"
    >
      {expanded ? (
        <>Masquer les filtres <ChevronUp className="ml-1 h-3 w-3" /></>
      ) : (
        <>Afficher les filtres <ChevronDown className="ml-1 h-3 w-3" /></>
      )}
    </Button>
  );
};

export default FilterExpandButton;
