
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { calculateValidityEndDate } from "@/hooks/fiscal/utils/dateUtils";
import { format, parse } from "date-fns";

export interface FiscalAttestationSectionProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
  setValidityEndDate: (date: string) => void; // Ajout de cette prop
  handleSave: () => void;
  showInAlert: boolean;
  onToggleAlert: (checked: boolean) => void;
  hiddenFromDashboard: boolean;
  onToggleDashboardVisibility: (checked: boolean) => void;
}

export const FiscalAttestationSection = ({
  creationDate,
  validityEndDate,
  setCreationDate,
  setValidityEndDate, // Utilisation de cette prop
  handleSave,
  showInAlert,
  onToggleAlert,
  hiddenFromDashboard,
  onToggleDashboardVisibility
}: FiscalAttestationSectionProps) => {
  // Conversion des dates entre format HTML (YYYY-MM-DD) et format français (DD/MM/YYYY)
  const htmlDateFormat = (frenchDate: string): string => {
    if (!frenchDate) return "";
    const parts = frenchDate.split('/');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
  };

  const frenchDateFormat = (htmlDate: string): string => {
    if (!htmlDate) return "";
    const date = new Date(htmlDate);
    return isNaN(date.getTime()) ? "" : format(date, 'dd/MM/yyyy');
  };

  // Mettre à jour la date de fin de validité lorsque la date de création change
  useEffect(() => {
    if (creationDate) {
      // Assurer que nous travaillons avec le format français pour le calcul
      const frenchDate = creationDate.includes('-') ? frenchDateFormat(creationDate) : creationDate;
      const newEndDate = calculateValidityEndDate(frenchDate);
      if (newEndDate) {
        setValidityEndDate(newEndDate);
      }
    }
  }, [creationDate, setValidityEndDate]);

  // Gérer le changement de date en convertissant le format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const htmlDate = e.target.value;
    setCreationDate(frenchDateFormat(htmlDate));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attestation de Conformité Fiscale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creation-date">Date de délivrance</Label>
            <Input
              id="creation-date"
              type="date"
              value={htmlDateFormat(creationDate)}
              onChange={handleDateChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validity-end-date">Date de fin de validité</Label>
            <Input
              id="validity-end-date"
              type="date"
              value={htmlDateFormat(validityEndDate)}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="alert-toggle"
            checked={showInAlert}
            onCheckedChange={onToggleAlert}
          />
          <Label htmlFor="alert-toggle">
            Afficher dans les alertes
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="dashboard-visibility"
            checked={hiddenFromDashboard}
            onCheckedChange={onToggleDashboardVisibility}
          />
          <Label htmlFor="dashboard-visibility">
            Masquer du tableau de bord
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
