
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
                keyName={keyName}
                status={status}
                onStatusChange={onStatusChange}
                onPaymentChange={handlePayment}
              />
              
              {isIGS && onToggleIGSPanel && (
                <IgsDetailPanel 
                  status={status} 
                  onStatusChange={(field, value) => onStatusChange(keyName, field, value)} 
                  showPanel={showIGSPanel}
                  onTogglePanel={onToggleIGSPanel}
                />
              )}

              {/* Attachments section */}
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <AttachmentUploader
                  label="Déclaration"
                  keyName={keyName}
                  clientId={clientId}
                  attachmentType="declaration"
                  selectedYear={selectedYear}
                  existingFile={status.payment_attachments?.declaration}
                  onAttachmentChange={onAttachmentChange}
                />
                <AttachmentUploader
                  label="Reçu de paiement"
                  keyName={keyName}
                  clientId={clientId}
                  attachmentType="receipt"
                  selectedYear={selectedYear}
                  existingFile={status.payment_attachments?.receipt}
                  onAttachmentChange={onAttachmentChange}
                />
              </div>

              <ObservationsSection
                observations={status.observations || ""}
                onChange={(value) => onStatusChange(keyName, "observations", value)}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
