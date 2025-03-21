
import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

interface FilterPopoverProps {
  children: ReactNode;
  hasActiveFilters: boolean;
  trigger?: ReactNode;
}

const FilterPopover = ({ children, hasActiveFilters, trigger }: FilterPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-1">
      <Filter size={16} />
      Filtres
      {hasActiveFilters && (
        <span className="ml-1 rounded-full bg-primary w-2 h-2" />
      )}
    </Button>
  );

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
