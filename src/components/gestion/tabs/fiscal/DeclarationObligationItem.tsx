
import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DeclarationObligationStatus, DeclarationPeriodicity } from "@/hooks/fiscal/types";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentUploader } from "./AttachmentUploader";
import { Badge } from "@/components/ui/badge";

interface DeclarationObligationItemProps {
  title: string;
  keyName: string;
  status: DeclarationObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  clientId: string;
  selectedYear: string;
  periodicity?: DeclarationPeriodicity;
}

export const DeclarationObligationItem: React.FC<DeclarationObligationItemProps> = ({
  title,
  keyName,
  status,
  onStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear,
  periodicity = "annual"
}) => {
  const [expanded, setExpanded] = React.useState(false);

  // Update periodicity when component mounts or when periodicity changes
  useEffect(() => {
    if (status?.periodicity !== periodicity) {
      onStatusChange(keyName, "periodicity", periodicity);
    }
  }, [keyName, status, periodicity, onStatusChange]);

  const handleAssujettiChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} assujetti change:`, checked);
      onStatusChange(keyName, "assujetti", checked);
    }
  };

  const handleDeposeChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      console.log(`${keyName} depose change:`, checked);
      onStatusChange(keyName, "depose", checked);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(keyName, "dateDepot", e.target.value);
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStatusChange(keyName, "observations", e.target.value);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  // Handle file upload for declaration items
  const handleFileUpload = (attachmentType: string, filePath: string | null) => {
    if (onAttachmentChange) {
      onAttachmentChange(keyName, attachmentType, filePath);
    }
  };

  return (
    <div className="border p-4 rounded-md bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`${keyName}-assujetti`}
            checked={Boolean(status?.assujetti)}
            onCheckedChange={handleAssujettiChange}
          />
          <div>
            <label
              htmlFor={`${keyName}-assujetti`}
              className="font-medium cursor-pointer"
            >
              {title}
            </label>
            <Badge 
              variant={periodicity === "monthly" ? "outline" : "secondary"} 
              className="ml-2 text-xs"
            >
              {periodicity === "monthly" ? "Mensuelle" : "Annuelle"}
            </Badge>
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
              id={`${keyName}-depose`}
              checked={Boolean(status?.depose)}
              onCheckedChange={handleDeposeChange}
            />
            <label
              htmlFor={`${keyName}-depose`}
              className="text-sm cursor-pointer"
            >
              Déposé
            </label>
          </div>
          
          {expanded && (
            <>
              {status?.depose && (
                <div className="space-y-1.5">
                  <Label htmlFor={`${keyName}-date`} className="text-sm flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" /> Date de dépôt
                  </Label>
                  <Input
                    id={`${keyName}-date`}
                    type="date"
                    value={status?.dateDepot || ""}
                    onChange={handleDateChange}
                    className="max-w-[200px]"
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
                  {/* Declaration document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={keyName}
                    attachmentType="declaration"
                    attachmentLabel="Déclaration"
                    filePath={status.attachments?.declaration}
                    onFileUploaded={(filePath) => handleFileUpload("declaration", filePath)}
                  />
                  
                  {/* Receipt document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={keyName}
                    attachmentType="receipt"
                    attachmentLabel="Accusé de réception"
                    filePath={status.attachments?.receipt}
                    onFileUploaded={(filePath) => handleFileUpload("receipt", filePath)}
                  />
                  
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
                  
                  {/* Additional document */}
                  <AttachmentUploader
                    clientId={clientId}
                    year={selectedYear}
                    obligationType={keyName}
                    attachmentType="additional"
                    attachmentLabel="Document supplémentaire"
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
