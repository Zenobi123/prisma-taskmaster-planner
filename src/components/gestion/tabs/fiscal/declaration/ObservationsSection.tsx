
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ObservationsSectionProps {
  keyName: string;
  observations: string | undefined;
  onObservationsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ObservationsSection: React.FC<ObservationsSectionProps> = ({
  keyName,
  observations,
  onObservationsChange
}) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${keyName}-observations`} className="text-sm">
        Observations
      </Label>
      <Textarea
        id={`${keyName}-observations`}
        value={observations || ""}
        onChange={onObservationsChange}
        placeholder="Ajoutez des observations concernant cette obligation..."
        className="h-20"
      />
    </div>
  );
};
