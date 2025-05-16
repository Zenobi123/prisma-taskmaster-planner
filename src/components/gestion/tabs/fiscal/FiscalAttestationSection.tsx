
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DatePickerSelector from "./DatePickerSelector";

interface FiscalAttestationSectionProps {
  creationDate: string | null;
  validityEndDate: string | null;
  setCreationDate: (date: string | null) => void;
  showInAlert: boolean;
  onToggleAlert: () => void;
  hiddenFromDashboard: boolean;
  onToggleDashboardVisibility: (value: boolean) => void;
}

export function FiscalAttestationSection({
  creationDate,
  validityEndDate,
  setCreationDate,
  showInAlert,
  onToggleAlert,
  hiddenFromDashboard,
  onToggleDashboardVisibility
}: FiscalAttestationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attestation fiscale</CardTitle>
        <CardDescription>
          Informations sur l'attestation fiscale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium block mb-2">Date de création</Label>
          <DatePickerSelector 
            date={creationDate}
            onSelect={setCreationDate}
            placeholder="Sélectionner la date de création"
          />
        </div>
        <div>
          <Label className="text-sm font-medium block mb-2">Date d'expiration</Label>
          <DatePickerSelector 
            date={validityEndDate}
            onSelect={setCreationDate}
            placeholder="Sélectionner la date d'expiration"
          />
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <Label htmlFor="show-alert" className="text-sm font-medium cursor-pointer">
            Afficher dans les alertes du tableau de bord
          </Label>
          <Switch
            id="show-alert"
            checked={showInAlert}
            onCheckedChange={() => onToggleAlert()}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="dashboard-visibility" className="text-sm font-medium cursor-pointer">
            Masquer du tableau de bord
          </Label>
          <Switch
            id="dashboard-visibility"
            checked={hiddenFromDashboard}
            onCheckedChange={(checked) => onToggleDashboardVisibility(checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
