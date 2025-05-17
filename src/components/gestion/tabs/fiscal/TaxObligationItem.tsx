
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TaxObligationStatus, AttachmentType } from '@/hooks/fiscal/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttachmentUploader } from './AttachmentUploader';
import { IgsDetailPanel } from './IgsDetailPanel';
import { Separator } from '@/components/ui/separator';
import { ObservationsSection } from './components/ObservationsSection';

interface TaxObligationItemProps {
  name: string;
  nameLabel: string;
  status: TaxObligationStatus;
  onChange: (field: string, value: any) => void;
  isIgsObligation?: boolean;
  clientId: string;
  selectedYear: string;
}

export const TaxObligationItem = ({
  name,
  nameLabel,
  status,
  onChange,
  isIgsObligation = false,
  clientId,
  selectedYear,
}: TaxObligationItemProps) => {
  const [showPanel, setShowPanel] = useState(false);

  // Function to update the tax liability status
  const handleAssujettissement = (checked: boolean) => {
    onChange('assujetti', checked);
    
    // If disabled, also reset payment status
    if (!checked) {
      onChange('paye', false);
    }
  };
  
  // Function to update payment status
  const handlePaymentChange = (checked: boolean) => {
    onChange('paye', checked);
  };

  // Function to add or update an attestation file
  const handleAttachmentChange = (attachmentType: AttachmentType, filePath: string) => {
    // Initialize attachments field if it doesn't exist
    if (!status.attachments) {
      onChange('attachments', {});
    }
    
    // Update attachment file
    onChange(`attachments.${attachmentType}`, filePath);
  };
  
  // IGS specific functionality
  const handleTogglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${name}-assujetti`} className="font-medium">
            {nameLabel}
          </Label>
          <div className="flex items-center gap-2">
            <Switch 
              id={`${name}-assujetti`}
              checked={status.assujetti}
              onCheckedChange={handleAssujettissement}
            />
          </div>
        </div>
        
        {status.assujetti && (
          <>
            <div className="mt-4 flex items-center justify-between">
              <Label htmlFor={`${name}-paye`} className="text-sm">
                Payé
              </Label>
              <Switch 
                id={`${name}-paye`}
                checked={status.paye}
                onCheckedChange={handlePaymentChange}
              />
            </div>
            
            {isIgsObligation && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex justify-between items-center"
                  onClick={handleTogglePanel}
                >
                  Détails IGS
                  {showPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
                
                {showPanel && (
                  <IgsDetailPanel 
                    igsStatus={status}
                    onStatusChange={onChange}
                  />
                )}
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="mt-4">
              <Label className="text-sm mb-2 block">Observations</Label>
              <ObservationsSection 
                observations={status.observations || ''}
                onObservationsChange={(value) => onChange('observations', value)}
              />
            </div>
            
            <div className="mt-4">
              <Label className="text-sm mb-2 block">Pièces justificatives</Label>
              <div className="space-y-2">
                <AttachmentUploader
                  obligationType={name}
                  attachmentType="attestation"
                  attachmentLabel="Attestation de paiement"
                  clientId={clientId}
                  year={selectedYear}
                  filePath={status.attachments?.attestation || ''}
                  onFileUploaded={(filePath) => handleAttachmentChange('attestation', filePath)}
                />
                
                <AttachmentUploader
                  obligationType={name}
                  attachmentType="receipt"
                  attachmentLabel="Reçu de paiement"
                  clientId={clientId}
                  year={selectedYear}
                  filePath={status.attachments?.receipt || ''}
                  onFileUploaded={(filePath) => handleAttachmentChange('receipt', filePath)}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
