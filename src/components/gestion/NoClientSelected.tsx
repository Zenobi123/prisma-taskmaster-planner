
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NoClientSelected() {
  return (
    <Card className="border-[#A8C1AE] bg-gradient-to-r from-[#F2FCE2] to-white">
      <CardHeader>
        <CardTitle className="text-[#1A1F2C]">Sélectionnez un client</CardTitle>
        <CardDescription className="text-[#8E9196]">
          Veuillez sélectionner un client pour gérer son dossier
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
