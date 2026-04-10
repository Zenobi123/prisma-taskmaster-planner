
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DatePickerSelector from "./DatePickerSelector";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { parse, isValid, differenceInDays, addDays, format } from "date-fns";

interface RegistrationAttestationSectionProps {
  registrationDate: string;
  setRegistrationDate: (date: string) => void;
}

export function RegistrationAttestationSection({
  registrationDate,
  setRegistrationDate,
}: RegistrationAttestationSectionProps) {
  const VALIDITY_DAYS = 30;

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    try {
      const d = dateStr.includes('-')
        ? new Date(dateStr)
        : parse(dateStr, 'dd/MM/yyyy', new Date());
      return isValid(d) ? d : null;
    } catch {
      return null;
    }
  };

  const startDate = parseDate(registrationDate);

  const expiryDate = startDate ? addDays(startDate, VALIDITY_DAYS) : null;

  const expiryDateStr = expiryDate ? format(expiryDate, 'yyyy-MM-dd') : "";

  const getDaysRemaining = (): number | null => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDate);
    exp.setHours(0, 0, 0, 0);
    return differenceInDays(exp, today);
  };

  const daysRemaining = getDaysRemaining();

  const getExpiryStatus = () => {
    if (daysRemaining === null) return "";
    if (daysRemaining <= 0) return "bg-rose-50 border-rose-300 text-rose-700";
    if (daysRemaining <= 7) return "bg-amber-50 border-amber-300 text-amber-700";
    return "bg-emerald-50 border-emerald-300 text-emerald-700";
  };

  const getStatusBadge = () => {
    if (daysRemaining === null) return null;
    if (daysRemaining <= 0) {
      return <Badge variant="destructive">Expirée</Badge>;
    }
    if (daysRemaining <= 7) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">{daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}</Badge>;
    }
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">{daysRemaining} jours restants</Badge>;
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">Attestation d'Immatriculation</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Durée de validité : {VALIDITY_DAYS} jours</p>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Date de délivrance</Label>
            <DatePickerSelector
              value={registrationDate}
              onChange={setRegistrationDate}
            />
          </div>
          <div>
            <Label>Date d'expiration</Label>
            <DatePickerSelector
              value={expiryDateStr}
              onChange={() => {}}
              className={getExpiryStatus()}
              disabled={true}
            />
            {daysRemaining !== null && daysRemaining <= 0 && (
              <p className="text-xs text-rose-600 mt-1">
                Attestation d'immatriculation expirée, bien vouloir procéder à son renouvellement.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
