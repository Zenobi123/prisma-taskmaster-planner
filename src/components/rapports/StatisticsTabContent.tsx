
import React from "react";
import { FileBarChart } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export const StatisticsTabContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Répartition des rapports</CardTitle>
          <CardDescription>Par type de document</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <FileBarChart className="w-12 h-12 mx-auto mb-2" />
            <p>Statistiques disponibles prochainement</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Rapports par période</CardTitle>
          <CardDescription>Évolution mensuelle</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <FileBarChart className="w-12 h-12 mx-auto mb-2" />
            <p>Statistiques disponibles prochainement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
