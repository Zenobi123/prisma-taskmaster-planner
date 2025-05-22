
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface TaxObligationStatus {
  assujetti: boolean;
  payee: boolean;
}

interface ObligationStatuses {
  igs: TaxObligationStatus;
  patente: TaxObligationStatus;
  licence: TaxObligationStatus;
  bailCommercial: TaxObligationStatus;
  precompteLoyer: TaxObligationStatus;
  tpf: TaxObligationStatus;
}

interface DirectTaxesSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (taxType: string, field: string, value: boolean) => void;
}

export const DirectTaxesSection: React.FC<DirectTaxesSectionProps> = ({ 
  obligationStatuses,
  handleStatusChange 
}) => {
  const renderTaxItem = (taxType: string, taxName: string, taxKey: keyof ObligationStatuses) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <span className="font-medium text-gray-800">{taxName}</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${taxType}-assujetti`}
                checked={obligationStatuses[taxKey].assujetti}
                onCheckedChange={(checked) => handleStatusChange(taxType, 'assujetti', checked)}
              />
              <Label htmlFor={`${taxType}-assujetti`}>
                {obligationStatuses[taxKey].assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${taxType}-paye`}
                checked={obligationStatuses[taxKey].payee}
                onCheckedChange={(checked) => handleStatusChange(taxType, 'payee', checked)}
                disabled={!obligationStatuses[taxKey].assujetti}
              />
              <Label htmlFor={`${taxType}-paye`}>
                {obligationStatuses[taxKey].payee ? "Payé" : "Non payé"}
              </Label>
            </div>
            
            {obligationStatuses[taxKey].assujetti && obligationStatuses[taxKey].payee && (
              <button 
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Voir détails
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* IGS */}
        {renderTaxItem("igs", "Impôt Général Synthétique (IGS)", "igs")}
        
        {/* Patente */}
        {renderTaxItem("patente", "Patente", "patente")}
        
        {/* Licence */}
        {renderTaxItem("licence", "Licence", "licence")}
        
        {/* Bail Commercial */}
        {renderTaxItem("bail-commercial", "Bail Commercial", "bailCommercial")}
        
        {/* Précompte sur Loyer */}
        {renderTaxItem("precompte-loyer", "Précompte sur Loyer", "precompteLoyer")}
        
        {/* Taxe sur la propriété (TPF) */}
        {renderTaxItem("tpf", "Taxe sur la propriété (TPF)", "tpf")}
      </CardContent>
    </Card>
  );
};
