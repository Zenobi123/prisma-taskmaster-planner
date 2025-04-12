
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface FiscalAttestationSectionProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
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
  handleSave,
  showInAlert,
  onToggleAlert,
  hiddenFromDashboard,
  onToggleDashboardVisibility
}: FiscalAttestationSectionProps) => {
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
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validity-end-date">Date de fin de validité</Label>
            <Input
              id="validity-end-date"
              type="date"
              value={validityEndDate}
              readOnly
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
