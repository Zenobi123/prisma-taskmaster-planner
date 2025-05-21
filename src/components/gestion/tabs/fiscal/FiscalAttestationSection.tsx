
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DatePickerSelector from "./DatePickerSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";

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
  // Calculer automatiquement la date de fin de validité lorsque la date de création change
  useEffect(() => {
    if (creationDate) {
      try {
        console.log("Date de création changée:", creationDate);
        // Conversion de la chaîne de date en objet Date
        const creationDateObj = new Date(creationDate);
        
        // Vérification que la date est valide
        if (!isNaN(creationDateObj.getTime())) {
          // Ajout de 90 jours pour la date de fin de validité
          const endDateObj = addDays(creationDateObj, 90);
          // Formatage de la date en chaîne au format ISO
          const formattedEndDate = format(endDateObj, "yyyy-MM-dd");
          console.log("Nouvelle date de fin calculée:", formattedEndDate);
          setValidityEndDate(formattedEndDate);
        } else {
          console.error("Date de création invalide:", creationDate);
        }
      } catch (error) {
        console.error("Erreur lors du calcul de la date de fin de validité:", error);
      }
    }
  }, [creationDate, setValidityEndDate]);

  const handleCreationDateChange = (date: string) => {
    console.log("Date sélectionnée dans FiscalAttestationSection:", date);
    setCreationDate(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attestation de Conformité Fiscale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="creationDate">Date de création</Label>
            <DatePickerSelector
              value={creationDate}
              onChange={handleCreationDateChange}
            />
          </div>
          <div>
            <Label htmlFor="validityEndDate">Date de fin validité</Label>
            <DatePickerSelector
              value={validityEndDate}
              onChange={setValidityEndDate}
              disabled={true}
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
