
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FiscalAttestationSection } from '../FiscalAttestationSection';

interface FiscalAttestationCardProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
  setValidityEndDate: (date: string) => void;
  showInAlert: boolean;
  hiddenFromDashboard: boolean;
  onToggleAlert: () => void;
  onToggleDashboardVisibility: () => void;
}

export const FiscalAttestationCard: React.FC<FiscalAttestationCardProps> = ({
  creationDate,
  validityEndDate,
  setCreationDate,
  setValidityEndDate,
  showInAlert,
  hiddenFromDashboard,
  onToggleAlert,
  onToggleDashboardVisibility
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Attestation de Situation Fiscale</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="alert-toggle"
              checked={showInAlert}
              onCheckedChange={onToggleAlert}
            />
            <Label htmlFor="alert-toggle" className="text-sm">Afficher dans les alertes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="dashboard-toggle"
              checked={!hiddenFromDashboard}
              onCheckedChange={onToggleDashboardVisibility}
            />
            <Label htmlFor="dashboard-toggle" className="text-sm">Visible au tableau de bord</Label>
          </div>
        </div>
      </div>

      <FiscalAttestationSection 
        creationDate={creationDate}
        validityEndDate={validityEndDate}
        setCreationDate={setCreationDate}
        showInAlert={showInAlert}
        onToggleAlert={onToggleAlert}
        hiddenFromDashboard={hiddenFromDashboard}
        onToggleDashboardVisibility={onToggleDashboardVisibility}
      />

      <Separator className="my-6" />
    </>
  );
};
