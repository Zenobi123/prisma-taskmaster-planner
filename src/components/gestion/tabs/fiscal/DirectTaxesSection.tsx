
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TaxStatus {
  assujetti: boolean;
  payee: boolean;
}

interface DirectTaxesSectionProps {
  obligationStatuses: {
    igs: TaxStatus;
    patente: TaxStatus;
    licence: TaxStatus;
    bailCommercial: TaxStatus;
    precompteLoyer: TaxStatus;
    tpf: TaxStatus;
  };
  handleStatusChange: (taxType: string, field: string, value: boolean) => void;
}

export const DirectTaxesSection: React.FC<DirectTaxesSectionProps> = ({
  obligationStatuses,
  handleStatusChange
}) => {
  // Fonction pour le rendu d'un élément d'impôt
  const renderTaxItem = (key: string, taxKey: string, label: string) => {
    const status = obligationStatuses[taxKey as keyof typeof obligationStatuses];
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <span className="font-medium text-gray-800 mb-3 md:mb-0">{label}</span>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-assujetti`}
                checked={status.assujetti}
                onCheckedChange={(checked) => handleStatusChange(taxKey, 'assujetti', checked)}
              />
              <Label htmlFor={`${key}-assujetti`}>
                {status.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-payee`}
                checked={status.payee}
                onCheckedChange={(checked) => handleStatusChange(taxKey, 'payee', checked)}
                disabled={!status.assujetti}
              />
              <Label htmlFor={`${key}-payee`}>
                {status.payee ? "Payé" : "Non payé"}
              </Label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {renderTaxItem('igs', 'igs', 'Impôt Général Synthétique (IGS)')}
        {renderTaxItem('patente', 'patente', 'Patente')}
        {renderTaxItem('licence', 'licence', 'Licence')}
        {renderTaxItem('bail', 'bailCommercial', 'Bail Commercial')}
        {renderTaxItem('precompte', 'precompteLoyer', 'Précompte sur Loyer')}
        {renderTaxItem('tpf', 'tpf', 'Taxe sur la Propriété Foncière (TPF)')}
      </CardContent>
    </Card>
  );
};
