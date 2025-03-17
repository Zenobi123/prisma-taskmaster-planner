
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, AlertTriangle, CheckCircle, XCircle, FileCheck } from "lucide-react";
import { differenceInDays, isValid, parse } from "date-fns";

interface FiscalAttestationSectionProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
  handleSave: () => void;
}

export function FiscalAttestationSection({ 
  creationDate, 
  validityEndDate, 
  setCreationDate,
  handleSave
}: FiscalAttestationSectionProps) {
  const getAttestationStatus = () => {
    if (!creationDate || !validityEndDate) return null;
    
    try {
      const endDate = parse(validityEndDate, 'dd/MM/yyyy', new Date());
      if (!isValid(endDate)) return null;
      
      const today = new Date();
      const daysUntilExpiration = differenceInDays(endDate, today);
      
      if (daysUntilExpiration < 0) {
        return { 
          status: "expired", 
          label: `Expirée depuis ${Math.abs(daysUntilExpiration)} jours`, 
          icon: XCircle, 
          variant: "destructive" 
        };
      } else if (daysUntilExpiration <= 5) {
        return { 
          status: "expiring-soon", 
          label: `Expire dans ${daysUntilExpiration} jours`, 
          icon: AlertTriangle, 
          variant: "outline",
          className: "bg-amber-50 text-amber-700 border-amber-200"
        };
      } else {
        return { 
          status: "valid", 
          label: "Valide", 
          icon: CheckCircle, 
          variant: "outline",
          className: "bg-green-50 text-green-700 border-green-200"
        };
      }
    } catch (error) {
      console.error("Error calculating attestation status:", error);
      return null;
    }
  };
  
  const status = getAttestationStatus();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow format dd/mm/yyyy
    const value = e.target.value;
    // Basic format validation (users can still enter invalid dates)
    const dateRegex = /^(\d{0,2})(\/?)(\d{0,2})(\/?)(\d{0,4})$/;
    const match = value.match(dateRegex);
    
    if (match) {
      setCreationDate(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Attestation de Conformité Fiscale</h3>
          {status && (
            <Badge 
              variant={status.variant as any} 
              className={`flex items-center gap-1 ${status.className || ""}`}
            >
              <status.icon className="h-3.5 w-3.5" />
              <span>{status.label}</span>
            </Badge>
          )}
        </div>
        <Button onClick={handleSave} variant="outline" size="sm" className="bg-green-100 hover:bg-green-200 border-green-300">
          <FileCheck className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md ${status?.status === 'expired' ? 'bg-red-50 border border-red-200' : ''}`}>
        <div className="space-y-2">
          <Label htmlFor="creation-date">Date de création (JJ/MM/AAAA)</Label>
          <Input
            id="creation-date"
            value={creationDate}
            onChange={handleDateChange}
            placeholder="JJ/MM/AAAA"
          />
          <p className="text-sm text-gray-500">
            Date de délivrance de l'attestation
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="validity-end-date">Date de fin de validité</Label>
          <Input
            id="validity-end-date"
            value={validityEndDate}
            readOnly
            disabled
          />
          <p className="text-sm text-gray-500">
            Validité de 3 mois à partir de la date de création
          </p>
        </div>
      </div>
    </div>
  );
}
