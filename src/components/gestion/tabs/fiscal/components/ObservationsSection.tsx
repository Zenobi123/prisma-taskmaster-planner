
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface ObservationsSectionProps {
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
      <Label htmlFor={`${keyName}-observations`} className="text-sm font-medium">
        Observations
      </Label>
      <Textarea
        id={`${keyName}-observations`}
        value={observations || ""}
        onChange={onObservationsChange}
        placeholder="Notes et observations..."
        className="w-full h-24 resize-y"
      />
    </div>
  );
};
