
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ObservationsSectionProps {
  keyName: string;
  observations?: string;
  onObservationsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ObservationsSection: React.FC<ObservationsSectionProps> = ({
  keyName,
  observations,
  onObservationsChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${keyName}-observations`}>Observations</Label>
      <Textarea
        id={`${keyName}-observations`}
        value={observations || ""}
        onChange={onObservationsChange}
        placeholder="Ajoutez des notes ou observations concernant cette obligation fiscale..."
        className="min-h-[100px]"
      />
    </div>
  );
};
