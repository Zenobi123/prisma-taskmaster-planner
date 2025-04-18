
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ObligationStatuses } from "@/hooks/fiscal/types";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { IgsDetailPanel } from "./IgsDetailPanel";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: boolean | string | number) => void;
}

export const AnnualObligationsSection: React.FC<AnnualObligationsSectionProps> = ({ 
  obligationStatuses,
  handleStatusChange
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("igs");

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleIgsUpdate = (field: string, value: any) => {
    handleStatusChange("igs", field, value);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Obligations annuelles</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <TaxObligationItem
                label="Impôt Général Synthétique (IGS)"
                status={obligationStatuses.igs}
                obligationKey="igs"
                onChange={handleStatusChange}
                expanded={expandedSection === "igs"}
                onToggleExpand={() => toggleSection("igs")}
              />
              
              {expandedSection === "igs" && (
                <IgsDetailPanel 
                  igsStatus={obligationStatuses.igs}
                  onUpdate={handleIgsUpdate}
                />
              )}
            </div>
            
            {/* Patente Section */}
            <div className="space-y-2">
              <TaxObligationItem
                label="Patente"
                status={obligationStatuses.patente}
                obligationKey="patente"
                onChange={handleStatusChange}
                expanded={expandedSection === "patente"}
                onToggleExpand={() => toggleSection("patente")}
              />
            </div>
            
            {/* DSF Section */}
            <div className="space-y-2">
              <DeclarationObligationItem
                label="Déclaration Statistique et Fiscale (DSF)"
                status={obligationStatuses.dsf}
                obligationKey="dsf"
                onChange={handleStatusChange}
                expanded={expandedSection === "dsf"}
                onToggleExpand={() => toggleSection("dsf")}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
