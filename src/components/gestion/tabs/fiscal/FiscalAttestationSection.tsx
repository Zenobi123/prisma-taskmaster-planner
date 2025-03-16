
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Attestation de Conformité Fiscale</h3>
        <Button onClick={handleSave} variant="default" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="creation-date">Date de création (JJ/MM/AAAA)</Label>
          <Input
            id="creation-date"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
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
