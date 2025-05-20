
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import DatePickerSelector from './DatePickerSelector';

interface FiscalAttestationSectionProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
  showInAlert: boolean;
  onToggleAlert: () => void;
  hiddenFromDashboard: boolean;
  onToggleDashboardVisibility: (value: boolean) => void;
}

export const FiscalAttestationSection: React.FC<FiscalAttestationSectionProps> = ({
  creationDate,
  validityEndDate,
  setCreationDate,
  showInAlert,
  onToggleAlert,
  hiddenFromDashboard,
  onToggleDashboardVisibility
}) => {
  const handleCreationDateChange = (date: string | null) => {
    if (date) {
      setCreationDate(date);
    }
  };

  const handleEndDateChange = (date: string | null) => {
    // Implement if needed for end date
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attestation de situation fiscale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="creation-date" className="block mb-2">Date de création</Label>
            <DatePickerSelector
              date={creationDate}
              onDateSelect={handleCreationDateChange}
              placeholder="Date de création"
            />
          </div>
          <div>
            <Label htmlFor="validity-end-date" className="block mb-2">Date de fin de validité</Label>
            <DatePickerSelector
              date={validityEndDate}
              onDateSelect={handleEndDateChange}
              placeholder="Date de fin de validité"
            />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-in-alert" className="flex-grow">
              Afficher dans les alertes d'échéance
            </Label>
            <Switch
              id="show-in-alert"
              checked={showInAlert}
              onCheckedChange={onToggleAlert}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="hide-from-dashboard" className="flex-grow">
              Masquer du tableau de bord
            </Label>
            <Switch
              id="hide-from-dashboard"
              checked={hiddenFromDashboard}
              onCheckedChange={onToggleDashboardVisibility}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
