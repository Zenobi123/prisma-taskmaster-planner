
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ActivityTypeSelectorProps {
  activityType: "commercial" | "service";
  setActivityType: (type: "commercial" | "service") => void;
}

export const ActivityTypeSelector = ({ 
  activityType, 
  setActivityType 
}: ActivityTypeSelectorProps) => {
  return (
    <RadioGroup 
      value={activityType} 
      onValueChange={(value) => setActivityType(value as "commercial" | "service")} 
      className="mt-2 mb-4"
    >
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="commercial" id="commercial" />
          <Label htmlFor="commercial">Activité commerciale</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="service" id="service" />
          <Label htmlFor="service">Prestataire de services</Label>
        </div>
      </div>
    </RadioGroup>
  );
};
