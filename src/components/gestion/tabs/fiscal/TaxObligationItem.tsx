
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { AttachmentUploader } from './AttachmentUploader';
import { IgsDetailPanel } from './IgsDetailPanel';
import { ObservationsSection } from './components/ObservationsSection';
import { PaymentStatus } from './components/PaymentStatus';

interface TaxObligationItemProps {
  keyName: string;
  title: string;
  status: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (key: string, attachmentType: string, filePath: string) => void;
  clientId: string;
  selectedYear: string;
  showIGSPanel?: boolean;
  onToggleIGSPanel?: () => void;
}

export function TaxObligationItem({
  keyName,
  title,
  status,
  onStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear,
  showIGSPanel = false,
  onToggleIGSPanel
}: TaxObligationItemProps) {
  const handleAssujetti = (checked: boolean) => {
    onStatusChange(keyName, "assujetti", checked);
    if (!checked) {
      onStatusChange(keyName, "paye", false);
    }
  };

  const handlePayment = (checked: boolean) => {
    onStatusChange(keyName, "paye", checked);
    if (checked && !status.datePaiement) {
      onStatusChange(keyName, "datePaiement", new Date().toISOString().split('T')[0]);
    }
  };

  const isIGS = keyName === "igs";

  return (
    <Card className={`overflow-hidden ${status.assujetti ? "border-green-100" : ""}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Header section */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${keyName}-assujetti`}
                checked={status.assujetti}
                onCheckedChange={handleAssujetti}
              />
              <label
                htmlFor={`${keyName}-assujetti`}
                className={`text-base font-medium ${status.assujetti ? "text-primary" : "text-gray-500"}`}
              >
                {title}
              </label>
            </div>
          </div>

          {/* Content that shows only if assujetti is true */}
          {status.assujetti && (
            <>
              <PaymentStatus
                status={status}
                onStatusChange={(field, value) => onStatusChange(keyName, field, value)}
                onPaymentChange={handlePayment}
              />
              
              {isIGS && onToggleIGSPanel && (
                <IgsDetailPanel 
                  igStatus={status}
                  onStatusChange={(field, value) => onStatusChange(keyName, field, value)} 
                  showPanel={showIGSPanel}
                  onTogglePanel={onToggleIGSPanel}
                />
              )}

              {/* Attachments section */}
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <AttachmentUploader
                  clientId={clientId}
                  year={selectedYear}
                  obligationType={keyName}
                  attachmentType="declaration"
                  attachmentLabel="Déclaration"
                  filePath={status.payment_attachments?.declaration}
                  onFileUploaded={(filePath) => onAttachmentChange(keyName, "declaration", filePath || "")}
                />
                <AttachmentUploader
                  clientId={clientId}
                  year={selectedYear}
                  obligationType={keyName}
                  attachmentType="receipt"
                  attachmentLabel="Reçu de paiement"
                  filePath={status.payment_attachments?.receipt}
                  onFileUploaded={(filePath) => onAttachmentChange(keyName, "receipt", filePath || "")}
                />
              </div>

              <ObservationsSection
                value={status.observations || ""}
                onValueChange={(value) => onStatusChange(keyName, "observations", value)}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
