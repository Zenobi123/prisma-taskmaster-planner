
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { Button } from "@/components/ui/button";

interface TaxObligationItemProps {
  label: string;
  status: TaxObligationStatus;
  obligationKey: string;
  onChange: (obligation: string, field: string, value: any) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export const TaxObligationItem = ({
  label,
  status,
  expanded,
  onToggleExpand,
}: TaxObligationItemProps) => {
  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full flex items-center justify-between p-4"
        onClick={onToggleExpand}
      >
        <span className="font-medium">{label}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
