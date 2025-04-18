
import React from "react";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ObservationsSectionProps {
  observations: string | undefined;
}

export const ObservationsSection = ({ observations }: ObservationsSectionProps) => {
  // Don't render anything if there are no observations
  if (!observations) return null;

  return (
    <>
      <Separator className="my-2" />
      <div>
        <div className="flex items-center mb-1">
          <Info className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <Label className="text-sm font-medium text-muted-foreground">Observations</Label>
        </div>
        <p className="text-sm whitespace-pre-line">{observations}</p>
      </div>
    </>
  );
};
