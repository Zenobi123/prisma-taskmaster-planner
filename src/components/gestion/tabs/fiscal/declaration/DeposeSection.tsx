
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
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la propagation du clic
  };
  
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`${keyName}-depose`}
          checked={isDepose}
          onCheckedChange={onDeposeChange}
          onClick={handleCheckboxClick}
          className="cursor-pointer"
        />
        <label
          htmlFor={`${keyName}-depose`}
          className="text-sm cursor-pointer"
          onClick={handleCheckboxClick}
        >
          Déposé
        </label>
      </div>
      
      {isDepose && (
        <div className="space-y-1.5 mt-2 ml-6">
          <Label htmlFor={`${keyName}-date`} className="text-sm flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Date de dépôt
          </Label>
          <Input
            id={`${keyName}-date`}
            type="date"
            value={dateDepot || ""}
            onChange={onDateChange}
            className="max-w-[200px]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
