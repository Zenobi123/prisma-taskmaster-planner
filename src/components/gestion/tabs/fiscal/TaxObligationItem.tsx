import React, { useState } from "react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { QuarterlyPaymentsSection } from "./components/QuarterlyPaymentsSection";
import { PaymentStatus } from "./components/PaymentStatus";
import { ObservationsSection } from "./components/ObservationsSection";
import AttachmentSection from "./declaration/AttachmentSection";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface TaxObligationItemProps {
  title: string;
  keyName: string;
  status: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
}

export const TaxObligationItem: React.FC<TaxObligationItemProps> = ({
  title,
  keyName,
  status,
  onStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleAssujettiChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} assujetti change:`, checked);
      onStatusChange(keyName, "assujetti", checked);
    }
  };

  const handlePayeeChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} payee change:`, checked);
      onStatusChange(keyName, "payee", checked);
    }
  };

  const handleDateEcheanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(keyName, "dateEcheance", e.target.value);
  };

  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      onStatusChange(keyName, "montant", value);
    }
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStatusChange(keyName, "observations", e.target.value);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="border p-4 rounded-md bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Switch
            id={`${keyName}-assujetti`}
            checked={Boolean(status?.assujetti)}
            onCheckedChange={handleAssujettiChange}
          />
          <Label htmlFor={`${keyName}-assujetti`}>{title}</Label>
        </div>
        <button onClick={handleToggleExpand} className="text-sm text-muted-foreground hover:underline">
          {expanded ? "Réduire" : "Plus d'options"}
        </button>
      </div>

      {status?.assujetti && (
        <CardContent className="mt-4 pl-6 space-y-3">
          {keyName === "igs" && (
            <QuarterlyPaymentsSection
              status={status}
              onStatusChange={onStatusChange}
              obligation={keyName}
            />
          )}

          <PaymentStatus
            keyName={keyName}
            isPayee={Boolean(status?.payee)}
            onPayeeChange={handlePayeeChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${keyName}-dateEcheance`}>Date d'échéance</Label>
              <Input
                type="date"
                id={`${keyName}-dateEcheance`}
                value={status?.dateEcheance || ""}
                onChange={handleDateEcheanceChange}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`${keyName}-montant`}>Montant</Label>
              <Input
                type="text"
                id={`${keyName}-montant`}
                value={String(status?.montant || "")}
                onChange={handleMontantChange}
                className="w-full"
              />
            </div>
          </div>

          {expanded && (
            <>
              <ObservationsSection
                keyName={keyName}
                observations={status?.observations}
                onObservationsChange={handleObservationsChange}
              />

              <AttachmentSection
                obligationName={keyName}
                existingAttachments={status?.attachements}
                onAttachmentUpload={(obligation, attachmentType, filePath) => onAttachmentChange(obligation, attachmentType, filePath)}
                onAttachmentDelete={(obligation, attachmentType) => onAttachmentChange(obligation, attachmentType, null)}
              />
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};
