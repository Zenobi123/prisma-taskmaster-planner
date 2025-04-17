
import React from "react";
import { 
  ObligationStatuses, 
  ObligationType,
  IGSData
} from "../fiscal/types";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { IGSEstablishmentsSection } from "./IGSEstablishmentsSection";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (
    obligationType: ObligationType,
    statusType: "assujetti" | "paye" | "depose",
    value: boolean
  ) => void;
  igsData?: IGSData;
  onIGSDataChange: (data: IGSData) => void;
}

export function AnnualObligationsSection({
  obligationStatuses,
  handleStatusChange,
  igsData,
  onIGSDataChange
}: AnnualObligationsSectionProps) {
  // Ensure obligationStatuses includes all required fields with defaults
  const safeObligationStatuses: ObligationStatuses = {
    patente: { assujetti: false, paye: false },
    igs: { assujetti: false, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false },
    ...obligationStatuses
  };

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
              status={safeObligationStatuses.patente}
              onChange={handleStatusChange}
            />
            
            <TaxObligationItem
              title="Impôt Général Synthétique (IGS)"
              deadline="31 mars"
              obligationType="igs"
              status={safeObligationStatuses.igs}
              onChange={handleStatusChange}
            />

            <IGSEstablishmentsSection 
              igsData={igsData}
              onIGSDataChange={onIGSDataChange}
              assujetti={safeObligationStatuses.igs?.assujetti || false}
            />
            
            <TaxObligationItem
              title="Bail"
              deadline="28 février"
              obligationType="bail"
              status={safeObligationStatuses.bail}
              onChange={handleStatusChange}
            />
            
            <TaxObligationItem
              title="Taxe foncière"
              deadline="28 février"
              obligationType="taxeFonciere"
              status={safeObligationStatuses.taxeFonciere}
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
              status={safeObligationStatuses.dsf}
              onChange={handleStatusChange}
            />
            
            <DeclarationObligationItem
              title="Déclaration Annuelle des Revenus des Particuliers (DARP)"
              deadline="30 juin"
              obligationType="darp"
              status={safeObligationStatuses.darp}
              onChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
