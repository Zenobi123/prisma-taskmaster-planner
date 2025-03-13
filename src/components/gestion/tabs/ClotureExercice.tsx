
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTypeSelector } from "./clotureExercice/ActivityTypeSelector";
import { CommercialActivityContent } from "./clotureExercice/CommercialActivityContent";
import { ServiceActivityContent } from "./clotureExercice/ServiceActivityContent";
import { Client } from "@/types/client";

export interface ClotureExerciceProps {
  client: Client;
}

export function ClotureExercice({ client }: ClotureExerciceProps) {
  const [activityType, setActivityType] = React.useState<"commercial" | "service">("commercial");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clôture d'exercice</CardTitle>
        <CardDescription>Préparation et traitement de la clôture fiscale annuelle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ActivityTypeSelector 
          value={activityType} 
          onChange={setActivityType} 
        />
        
        {activityType === "commercial" ? (
          <CommercialActivityContent client={client} />
        ) : (
          <ServiceActivityContent client={client} />
        )}
      </CardContent>
    </Card>
  );
}
