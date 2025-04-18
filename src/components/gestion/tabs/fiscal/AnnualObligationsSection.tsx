import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ObligationStatuses } from "@/hooks/fiscal/types";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { IgsDetailPanel } from "./IgsDetailPanel";
import { Separator } from "@/components/ui/separator";
import { ListCheck } from "lucide-react";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: boolean | string | number) => void;
}

export const AnnualObligationsSection: React.FC<AnnualObligationsSectionProps> = ({ 
  obligationStatuses,
  handleStatusChange
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("igs");

  // Debug expanded section state changes
  useEffect(() => {
    console.log("AnnualObligationsSection - Current expanded section:", expandedSection);
  }, [expandedSection]);

  const toggleSection = (section: string) => {
    console.log(`Toggling section: ${section}, current: ${expandedSection}`);
    setExpandedSection(prevSection => {
      const newSection = prevSection === section ? null : section;
      console.log(`Setting expanded section from ${prevSection} to ${newSection}`);
      return newSection;
    });
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
            
            {/* DARP Section - New */}
            <div className="space-y-2">
              <DeclarationObligationItem
                label="Déclaration Annuelle des Revenus des Particuliers (DARP)"
                status={obligationStatuses.darp}
                obligationKey="darp"
                onChange={handleStatusChange}
                expanded={expandedSection === "darp"}
                onToggleExpand={() => toggleSection("darp")}
              />
            </div>
            
            {/* New section: Other obligations */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <ListCheck className="h-5 w-5 text-muted-foreground" />
                <h4 className="text-lg font-medium">Autres obligations</h4>
              </div>
              <div className="space-y-4 pl-2">
                <TaxObligationItem
                  label="Impôts sur les Bénéfices Agricoles (IBA)"
                  status={obligationStatuses.iba}
                  obligationKey="iba"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "iba"}
                  onToggleExpand={() => toggleSection("iba")}
                />
                <TaxObligationItem
                  label="Impôts sur les Bénéfices Artisanaux, Industriels et Commerciaux (BAIC)"
                  status={obligationStatuses.baic}
                  obligationKey="baic"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "baic"}
                  onToggleExpand={() => toggleSection("baic")}
                />
                <TaxObligationItem
                  label="Impôts sur les Bénéfices des Professions Non Commerciales (IBNC)"
                  status={obligationStatuses.ibnc}
                  obligationKey="ibnc"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "ibnc"}
                  onToggleExpand={() => toggleSection("ibnc")}
                />
                <TaxObligationItem
                  label="Impôts sur les Revenus des Capitaux Mobiliers (IRCM)"
                  status={obligationStatuses.ircm}
                  obligationKey="ircm"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "ircm"}
                  onToggleExpand={() => toggleSection("ircm")}
                />
                <TaxObligationItem
                  label="Impôts sur les Revenus Foncier (IRF)"
                  status={obligationStatuses.irf}
                  obligationKey="irf"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "irf"}
                  onToggleExpand={() => toggleSection("irf")}
                />
                <TaxObligationItem
                  label="Impôts sur les traitements, salaires et rentes viagères (I/TS)"
                  status={obligationStatuses.its}
                  obligationKey="its"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "its"}
                  onToggleExpand={() => toggleSection("its")}
                />
                <DeclarationObligationItem
                  label="Licence"
                  status={obligationStatuses.licence}
                  obligationKey="licence"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "licence"}
                  onToggleExpand={() => toggleSection("licence")}
                />
                <TaxObligationItem
                  label="Précompte sur loyer"
                  status={obligationStatuses.precompte}
                  obligationKey="precompte"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "precompte"}
                  onToggleExpand={() => toggleSection("precompte")}
                />
                <TaxObligationItem
                  label="Taxe de séjour dans les établissements d'hébergement"
                  status={obligationStatuses.taxeSejour}
                  obligationKey="taxeSejour"
                  onChange={handleStatusChange}
                  expanded={expandedSection === "taxeSejour"}
                  onToggleExpand={() => toggleSection("taxeSejour")}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
