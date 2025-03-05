
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MontageDSFProps {
  previousYear: number;
}

export const MontageDSF = ({ previousYear }: MontageDSFProps) => {
  return (
    <Card className="border-[#A8C1AE] bg-[#F2FCE2] animate-fade-in mt-4">
      <CardHeader>
        <CardTitle className="text-[#1A1F2C]">Montage DSF {previousYear}</CardTitle>
        <CardDescription className="text-[#8E9196]">
          Déclaration statistique et fiscale de l'exercice {previousYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Détails sur la préparation et le montage des documents pour la déclaration statistique et fiscale (DSF) de l'exercice {previousYear}.
        </p>
      </CardContent>
    </Card>
  );
};
