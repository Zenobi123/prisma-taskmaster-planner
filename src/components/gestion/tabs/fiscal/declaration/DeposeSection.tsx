
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface DeposeSectionProps {
  keyName: string;
  isDepose: boolean;
  dateDepot: string | undefined;
  onDeposeChange: (checked: boolean | "indeterminate") => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DeposeSection: React.FC<DeposeSectionProps> = ({
  keyName,
  isDepose,
  dateDepot,
  onDeposeChange,
  onDateChange
}) => {
  // Empêche la propagation pour tout élément interactif
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onDeposeChange(checked);
    }
  };
  
  return (
    <div onClick={stopPropagation} className="w-full">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`${keyName}-depose`}
          checked={isDepose}
          onCheckedChange={handleCheckboxChange}
          onClick={stopPropagation}
          className="cursor-pointer data-[state=checked]:bg-primary"
        />
        <label
          htmlFor={`${keyName}-depose`}
          className="text-sm cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDeposeChange(!isDepose);
          }}
        >
          Déposé
        </label>
      </div>
      
      {isDepose && (
        <div className="space-y-1.5 mt-2 ml-6" onClick={stopPropagation}>
          <Label htmlFor={`${keyName}-date`} className="text-sm flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Date de dépôt
          </Label>
          <Input
            id={`${keyName}-date`}
            type="date"
            value={dateDepot || ""}
            onChange={onDateChange}
            className="max-w-[200px]"
            onClick={stopPropagation}
          />
        </div>
      )}
    </div>
  );
};
