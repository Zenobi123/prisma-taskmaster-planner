
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DeclarationObligationStatus } from "@/hooks/fiscal/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentUploader } from "./AttachmentUploader";

interface DeclarationObligationItemProps {
  label: string;
  status: DeclarationObligationStatus;
  obligationKey: string;
  onChange: (obligation: string, field: string, value: boolean | string) => void;
  onAttachmentChange?: (obligation: string, attachmentType: string, filePath: string | null) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  clientId: string;
  selectedYear: string;
}

export const DeclarationObligationItem: React.FC<DeclarationObligationItemProps> = ({
  label,
  status,
  obligationKey,
  onChange,
  onAttachmentChange,
  expanded = false,
  onToggleExpand,
  clientId,
  selectedYear,
}) => {
  const handleAssujettiChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onChange(obligationKey, "assujetti", checked);
    }
  };

  const handleDeposeChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onChange(obligationKey, "depose", checked);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(obligationKey, "dateDepot", e.target.value);
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(obligationKey, "observations", e.target.value);
  };

  // Handle expansion click
  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  // Handle file upload
  const handleFileUpload = (attachmentType: string, filePath: string | null) => {
    if (onAttachmentChange) {
      onAttachmentChange(obligationKey, attachmentType, filePath);
    }
  };

  return (
    <div className="border p-4 rounded-md bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`${obligationKey}-assujetti`}
            checked={status?.assujetti}
            onCheckedChange={handleAssujettiChange}
          />
          <label
            htmlFor={`${obligationKey}-assujetti`}
            className="font-medium cursor-pointer"
          >
            {label}
          </label>
        </div>
        
        {status?.assujetti && onToggleExpand && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExpandClick}
            className="h-8 w-8 p-0"
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
              id={`${obligationKey}-depose`}
              checked={status?.depose}
              onCheckedChange={handleDeposeChange}
            />
            <label
              htmlFor={`${obligationKey}-depose`}
              className="text-sm cursor-pointer"
            >
              Déposé
            </label>
          </div>
          
          {expanded && (
            <>
              {status?.depose && (
                <div className="space-y-1.5">
                  <Label htmlFor={`${obligationKey}-date`} className="text-sm">
                    Date de dépôt
                  </Label>
                  <Input
                    id={`${obligationKey}-date`}
                    type="date"
                    value={status?.dateDepot || ""}
                    onChange={handleDateChange}
                    className="max-w-[200px]"
                  />
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label htmlFor={`${obligationKey}-observations`} className="text-sm">
                  Observations
                </Label>
                <Textarea
                  id={`${obligationKey}-observations`}
                  value={status?.observations || ""}
                  onChange={handleObservationsChange}
                  placeholder="Ajoutez des observations concernant cette obligation..."
                  className="h-20"
                />
              </div>

              {/* File attachments section - Now with 4 different types */}
              <div className="pt-2 border-t mt-4">
                <h4 className="text-sm font-medium mb-3">Pièces jointes</h4>
                
                <div className="space-y-4">
                  {/* Declaration document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={obligationKey}
                    attachmentType="declaration"
                    attachmentLabel="Déclaration"
                    filePath={status.attachments?.declaration}
                    onFileUploaded={(filePath) => handleFileUpload("declaration", filePath)}
                  />
                  
                  {/* Receipt document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={obligationKey}
                    attachmentType="receipt"
                    attachmentLabel="Accusé de réception"
                    filePath={status.attachments?.receipt}
                    onFileUploaded={(filePath) => handleFileUpload("receipt", filePath)}
                  />
                  
                  {/* Payment document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={obligationKey}
                    attachmentType="payment"
                    attachmentLabel="Solde"
                    filePath={status.attachments?.payment}
                    onFileUploaded={(filePath) => handleFileUpload("payment", filePath)}
                  />
                  
                  {/* Additional document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={obligationKey}
                    attachmentType="additional"
                    attachmentLabel="Document complémentaire"
                    filePath={status.attachments?.additional}
                    onFileUploaded={(filePath) => handleFileUpload("additional", filePath)}
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
