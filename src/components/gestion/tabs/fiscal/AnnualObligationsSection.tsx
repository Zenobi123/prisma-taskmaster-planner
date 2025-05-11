
import { useState } from "react";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { TaxObligationItem } from "./TaxObligationItem";
import { ObligationStatuses } from "@/hooks/fiscal/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses | null;
  handleStatusChange: (obligation: string, field: string, value: boolean | string | number) => void;
  onAttachmentChange?: (obligation: string, isDeclaration: boolean, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
}

export function AnnualObligationsSection({
  obligationStatuses,
  handleStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear
}: AnnualObligationsSectionProps) {
  const [activeTab, setActiveTab] = useState("declarations");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if (!obligationStatuses) {
    return <div>Chargement des obligations...</div>;
  }

  // Toggle expanded state for an obligation item
  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle attachment changes with type differentiation
  const handleAttachmentUpdate = (obligation: string, attachmentType: string, filePath: string | null) => {
    if (onAttachmentChange) {
      const isDeclaration = ["dsf", "darp", "licence"].includes(obligation);
      onAttachmentChange(obligation, isDeclaration, attachmentType, filePath);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Obligations Fiscales Annuelles</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-2">
            <TabsTrigger value="declarations">Déclarations</TabsTrigger>
            <TabsTrigger value="impots">Impôts</TabsTrigger>
          </TabsList>

          <TabsContent value="declarations" className="space-y-4">
            <DeclarationObligationItem
              label="DSF (Déclaration Statistique et Fiscale)"
              status={obligationStatuses.dsf}
              obligationKey="dsf"
              onChange={handleStatusChange}
              onAttachmentChange={handleAttachmentUpdate}
              expanded={!!expandedItems["dsf"]}
              onToggleExpand={() => toggleExpanded("dsf")}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              label="DARP (Déclaration Annuelle des Revenus Professionnels)"
              status={obligationStatuses.darp}
              obligationKey="darp"
              onChange={handleStatusChange}
              onAttachmentChange={handleAttachmentUpdate}
              expanded={!!expandedItems["darp"]}
              onToggleExpand={() => toggleExpanded("darp")}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </TabsContent>

          <TabsContent value="impots" className="space-y-4">
            <TaxObligationItem
              label="IGS (Impôt Général Synthétique)"
              status={obligationStatuses.igs}
              obligationKey="igs"
              onChange={handleStatusChange}
              onAttachmentChange={handleAttachmentUpdate}
              expanded={!!expandedItems["igs"]}
              onToggleExpand={() => toggleExpanded("igs")}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              label="Patente"
              status={obligationStatuses.patente}
              obligationKey="patente"
              onChange={handleStatusChange}
              onAttachmentChange={handleAttachmentUpdate}
              expanded={!!expandedItems["patente"]}
              onToggleExpand={() => toggleExpanded("patente")}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              label="IS (Impôt sur les Sociétés)"
              status={obligationStatuses.baic}
              obligationKey="baic"
              onChange={handleStatusChange}
              onAttachmentChange={handleAttachmentUpdate}
              expanded={!!expandedItems["baic"]}
              onToggleExpand={() => toggleExpanded("baic")}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              label="IBA (Impôt sur les Bénéfices Agricoles)"
              status={obligationStatuses.iba}
              obligationKey="iba"
              onChange={handleStatusChange}
              onAttachmentChange={handleAttachmentUpdate}
              expanded={!!expandedItems["iba"]}
              onToggleExpand={() => toggleExpanded("iba")}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
