
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DatePickerSelector from "./DatePickerSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { addDays, format, parse, isValid, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface FiscalAttestationSectionProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
  setValidityEndDate: (date: string) => void;
  showInAlert: boolean;
  onToggleAlert: () => void;
  hiddenFromDashboard: boolean;
  onToggleDashboardVisibility: (hidden: boolean) => void;
  fiscalSituationCompliant?: boolean;
  onToggleFiscalSituationCompliant?: (compliant: boolean) => void;
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
  fiscalSituationCompliant = true,
  onToggleFiscalSituationCompliant,
}: FiscalAttestationSectionProps) {
  // Détermine le statut d'expiration (pour la couleur du champ de date)
  const getExpiryStatus = () => {
    if (!validityEndDate) return "";

    // Parse la date de fin de validité
    let endDateObj: Date;
    try {
      if (validityEndDate.includes('-')) {
        endDateObj = new Date(validityEndDate);
      } else {
        endDateObj = parse(validityEndDate, 'dd/MM/yyyy', new Date());
      }

      if (!isValid(endDateObj)) return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDateObj.setHours(0, 0, 0, 0);

      const daysRemaining = differenceInDays(endDateObj, today);

      if (daysRemaining <= 0) {
        return "bg-rose-50 border-rose-300 text-rose-700";
      } else if (daysRemaining <= 4) {
        return "bg-amber-50 border-amber-300 text-amber-700";
      } else {
        return "bg-emerald-50 border-emerald-300 text-emerald-700";
      }
    } catch (error) {
      console.error("Erreur lors du calcul du statut d'expiration:", error);
      return "";
    }
  };

  // Vérifie si l'attestation est expirée
  const isExpired = () => {
    if (!validityEndDate) return false;

    let endDateObj: Date;
    try {
      if (validityEndDate.includes('-')) {
        endDateObj = new Date(validityEndDate);
      } else {
        endDateObj = parse(validityEndDate, 'dd/MM/yyyy', new Date());
      }

      if (!isValid(endDateObj)) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDateObj.setHours(0, 0, 0, 0);

      return endDateObj < today;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'expiration:", error);
      return false;
    }
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
              onChange={setCreationDate}
            />
          </div>
          <div>
            <Label htmlFor="validityEndDate">Date de fin validité</Label>
            <DatePickerSelector
              value={validityEndDate}
              onChange={setValidityEndDate}
              className={getExpiryStatus()}
              disabled={true}
            />
            {isExpired() && (
              <p className="text-xs text-rose-600 mt-1">
                ACF expirée, bien vouloir procéder à son renouvellement.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="fiscalSituationCompliant"
            checked={fiscalSituationCompliant}
            onCheckedChange={onToggleFiscalSituationCompliant}
          />
          <Label htmlFor="fiscalSituationCompliant">
            Situation fiscale conforme
          </Label>
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
