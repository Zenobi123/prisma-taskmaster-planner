import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DatePickerSelector from "./DatePickerSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FiscalAttestationSectionProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
  setValidityEndDate: (date: string) => void;
  showInAlert: boolean;
  onToggleAlert: () => void;
  hiddenFromDashboard: boolean;
  onToggleDashboardVisibility: (hidden: boolean) => void;
}

export function FiscalAttestationSection({
  creationDate,
  validityEndDate,
  setCreationDate,
  setValidityEndDate,
  showInAlert,
  onToggleAlert,
  hiddenFromDashboard,
  onToggleDashboardVisibility,
}: FiscalAttestationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attestation fiscale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="creationDate">Date de création</Label>
            <DatePickerSelector
              id="creationDate"
              value={creationDate}
              onChange={setCreationDate}
            />
          </div>
          <div>
            <Label htmlFor="validityEndDate">Date de validité</Label>
            <DatePickerSelector
              id="validityEndDate"
              value={validityEndDate}
              onChange={setValidityEndDate}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showInAlert"
            checked={showInAlert}
            onCheckedChange={onToggleAlert}
          />
          <Label htmlFor="showInAlert">
            Afficher dans les alertes d'expiration
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hideDashboard"
            checked={hiddenFromDashboard}
            onCheckedChange={onToggleDashboardVisibility}
          />
          <Label htmlFor="hideDashboard">
            Masquer du tableau de bord
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
