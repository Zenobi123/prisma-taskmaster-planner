
import React from "react";
import { ObligationStatuses, ObligationType } from "../ObligationsFiscales";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (
    obligationType: ObligationType,
    statusType: "assujetti" | "paye" | "depose",
    value: boolean
  ) => void;
}

export function AnnualObligationsSection({
  obligationStatuses,
  handleStatusChange
}: AnnualObligationsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Obligations annuelles</h3>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Impôts</h4>
          <div className="grid grid-cols-1 gap-4">
            <TaxObligationItem
              title="Patente"
              deadline="28 février"
              obligationType="patente"
              status={obligationStatuses.patente}
              onChange={handleStatusChange}
            />
            
            <TaxObligationItem
              title="Bail"
              deadline="28 février"
              obligationType="bail"
              status={obligationStatuses.bail}
              onChange={handleStatusChange}
            />
            
            <TaxObligationItem
              title="Taxe foncière"
              deadline="28 février"
              obligationType="taxeFonciere"
              status={obligationStatuses.taxeFonciere}
              onChange={handleStatusChange}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Déclarations</h4>
          <div className="grid grid-cols-1 gap-4">
            <DeclarationObligationItem
              title="Déclaration Statistique et Fiscale (DSF)"
              deadline="15 avril"
              obligationType="dsf"
              status={obligationStatuses.dsf}
              onChange={handleStatusChange}
            />
            
            <DeclarationObligationItem
              title="Déclaration Annuelle des Revenus des Particuliers (DARP)"
              deadline="30 juin"
              obligationType="darp"
              status={obligationStatuses.darp}
              onChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
