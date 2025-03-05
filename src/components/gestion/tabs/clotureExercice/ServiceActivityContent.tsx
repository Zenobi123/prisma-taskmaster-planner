
import React from "react";

export const ServiceActivityContent = () => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Analyse du chiffre d'affaires pour l'activité de prestation de services de l'exercice précédent.
      </p>
      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
        <li>Prestations facturées</li>
        <li>Répartition par type de prestation</li>
      </ul>
    </div>
  );
};
