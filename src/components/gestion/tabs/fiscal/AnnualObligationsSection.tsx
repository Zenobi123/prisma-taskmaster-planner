
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { ObligationStatuses } from "@/hooks/fiscal/types";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses | null;
  handleStatusChange: (obligation: string, field: string, value: boolean | string | number) => void;
  onAttachmentChange: (obligation: string, isDeclaration: boolean, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
}

export const AnnualObligationsSection = ({
  obligationStatuses,
  handleStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear
}: AnnualObligationsSectionProps) => {
  const [expandedTaxes, setExpandedTaxes] = useState<string[]>([]);
  const [expandedDeclarations, setExpandedDeclarations] = useState<string[]>([]);

  // Toggle expanded state for an obligation
  const toggleTaxExpanded = (key: string) => {
    setExpandedTaxes(prev => 
      prev.includes(key) ? 
        prev.filter(item => item !== key) : 
        [...prev, key]
    );
  };

  const toggleDeclarationExpanded = (key: string) => {
    setExpandedDeclarations(prev => 
      prev.includes(key) ? 
        prev.filter(item => item !== key) : 
        [...prev, key]
    );
  };

  // Handle attachment updates for tax obligations
  const handleTaxAttachmentChange = (obligation: string, attachmentType: string, filePath: string | null) => {
    onAttachmentChange(obligation, false, attachmentType, filePath);
  };

  // Handle attachment updates for declaration obligations
  const handleDeclarationAttachmentChange = (obligation: string, attachmentType: string, filePath: string | null) => {
    onAttachmentChange(obligation, true, attachmentType, filePath);
  };

  if (!obligationStatuses) {
    return null;
  }

  // Group obligations by type
  const taxObligations = [
    { key: "igs", label: "I.G.S (Impôt Global sur le Revenu)" },
    { key: "patente", label: "Patente" },
    { key: "iba", label: "IBA (Impôts sur les Bénéfices Agricoles)" },
    { key: "baic", label: "BAIC (Impôts sur les Bénéfices Artisanaux, Industriels et Commerciaux)" },
    { key: "ibnc", label: "IBNC (Impôts sur les Bénéfices des Professions Non Commerciales)" },
    { key: "ircm", label: "IRCM (Impôts sur les Revenus des Capitaux Mobiliers)" },
    { key: "irf", label: "IRF (Impôts sur les Revenus Fonciers)" },
    { key: "its", label: "ITS (Impôts sur les Traitements et Salaires)" },
    { key: "precompte", label: "Précompte sur loyer" },
    { key: "taxeSejour", label: "Taxe de séjour" },
    { key: "baillCommercial", label: "Bail Commercial" }
  ];

  const declarationObligations = [
    { key: "dsf", label: "DSF (Déclaration Statistique et Fiscale)" },
    { key: "darp", label: "DARP (Déclaration Annuelle de Revenus des Personnes Physiques)" },
    { key: "licence", label: "Licence" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Obligations annuelles - {selectedYear}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Impôts et taxes */}
        <div>
          <h3 className="font-semibold mb-3">Impôts et taxes</h3>
          <div className="space-y-2">
            {taxObligations.map(({ key, label }) => (
              <TaxObligationItem
                key={key}
                label={label}
                status={obligationStatuses[key]}
                obligationKey={key}
                onChange={handleStatusChange}
                onAttachmentChange={handleTaxAttachmentChange}
                expanded={expandedTaxes.includes(key)}
                onToggleExpand={() => toggleTaxExpanded(key)}
                clientId={clientId}
                selectedYear={selectedYear}
              />
            ))}
          </div>
        </div>
        
        {/* Déclarations */}
        <div>
          <h3 className="font-semibold mb-3">Déclarations</h3>
          <div className="space-y-2">
            {declarationObligations.map(({ key, label }) => (
              <DeclarationObligationItem
                key={key}
                label={label}
                status={obligationStatuses[key]}
                obligationKey={key}
                onChange={handleStatusChange}
                onAttachmentChange={handleDeclarationAttachmentChange}
                expanded={expandedDeclarations.includes(key)}
                onToggleExpand={() => toggleDeclarationExpanded(key)}
                clientId={clientId}
                selectedYear={selectedYear}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
