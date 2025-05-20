
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentUploader } from "./AttachmentUploader";

interface TaxObligationItemProps {
  title: string;
  keyName: string;
  status: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
  showPaymentDetails?: boolean;
}

export const TaxObligationItem: React.FC<TaxObligationItemProps> = ({
  title,
  keyName,
  status,
  onStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear,
  showPaymentDetails = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleAssujettiChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onStatusChange(keyName, "assujetti", checked);
    }
  };

  const handlePayeChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onStatusChange(keyName, "paye", checked);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(keyName, "dateReglement", e.target.value);
  };

  const handleObservationsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onStatusChange(keyName, "observations", e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only update if the value is a valid number or empty
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      onStatusChange(keyName, "montantAnnuel", value === "" ? 0 : Number(value));
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  // Handle file upload for tax obligations
  const handleFileUpload = (attachmentType: string, filePath: string | null) => {
    onAttachmentChange(keyName, attachmentType, filePath);
  };

  return (
    <div className="border p-4 rounded-md bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${keyName}-assujetti`}
            checked={status?.assujetti}
            onCheckedChange={handleAssujettiChange}
          />
          <div>
            <label
              htmlFor={`${keyName}-assujetti`}
              className="font-medium cursor-pointer"
            >
              {title}
            </label>
          </div>
        </div>

        {status?.assujetti && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpand}
            className="h-8 w-8 p-0"
            type="button"
            aria-label={expanded ? "Réduire" : "Développer"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {status?.assujetti && (
        <div className="mt-4 pl-6 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${keyName}-paye`}
              checked={Boolean(status?.paye)}
              onCheckedChange={handlePayeChange}
            />
            <label htmlFor={`${keyName}-paye`} className="text-sm cursor-pointer">
              Payé
            </label>
          </div>

          {expanded && (
            <>
              {status?.paye && (
                <div className="space-y-1.5">
                  <Label htmlFor={`${keyName}-date`} className="text-sm">
                    Date de règlement
                  </Label>
                  <Input
                    id={`${keyName}-date`}
                    type="date"
                    value={status?.dateReglement || ""}
                    onChange={handleDateChange}
                    className="max-w-[200px]"
                  />
                </div>
              )}

              {showPaymentDetails && (
                <div className="space-y-1.5">
                  <Label htmlFor={`${keyName}-montant`} className="text-sm">
                    Montant annuel
                  </Label>
                  <Input
                    id={`${keyName}-montant`}
                    type="number"
                    value={status?.montantAnnuel || ""}
                    onChange={handleAmountChange}
                    className="max-w-[200px]"
                    placeholder="0"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor={`${keyName}-observations`} className="text-sm">
                  Observations
                </Label>
                <Textarea
                  id={`${keyName}-observations`}
                  value={status?.observations || ""}
                  onChange={handleObservationsChange}
                  placeholder="Ajoutez des observations concernant cette obligation..."
                  className="h-20"
                />
              </div>

              {/* File attachments section */}
              <div className="pt-2 border-t mt-4">
                <h4 className="text-sm font-medium mb-3">Pièces jointes</h4>

                <div className="space-y-4">
                  {/* Payment document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={keyName}
                    attachmentType="payment"
                    attachmentLabel="Justificatif de paiement"
                    filePath={status.attachments?.payment}
                    onFileUploaded={(filePath) => handleFileUpload("payment", filePath)}
                  />

                  {/* Notice document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={keyName}
                    attachmentType="declaration"
                    attachmentLabel="Avis d'imposition"
                    filePath={status.attachments?.declaration}
                    onFileUploaded={(filePath) =>
                      handleFileUpload("declaration", filePath)
                    }
                  />

                  {/* Additional document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={keyName}
                    attachmentType="additional"
                    attachmentLabel="Document supplémentaire"
                    filePath={status.attachments?.additional}
                    onFileUploaded={(filePath) =>
                      handleFileUpload("additional", filePath)
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
