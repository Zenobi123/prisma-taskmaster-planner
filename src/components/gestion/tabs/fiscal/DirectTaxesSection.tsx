
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { ObligationStatuses, ObligationType, TaxObligationStatus } from '@/hooks/fiscal/types';

interface DirectTaxesSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (taxType: ObligationType, field: string, value: boolean | string | number) => void;
}

// IGS tax brackets configuration
const igsBareme = [
  { min: 0, max: 499999, class: 1, standard: 20000 },
  { min: 500000, max: 999999, class: 2, standard: 30000 },
  { min: 1000000, max: 1499999, class: 3, standard: 40000 },
  { min: 1500000, max: 1999999, class: 4, standard: 50000 },
  { min: 2000000, max: 2499999, class: 5, standard: 60000 },
  { min: 2500000, max: 4999999, class: 6, standard: 150000 },
  { min: 5000000, max: 9999999, class: 7, standard: 300000 },
  { min: 10000000, max: 19999999, class: 8, standard: 500000 },
  { min: 20000000, max: 29999999, class: 9, standard: 1000000 },
  { min: 30000000, max: 49999999, class: 10, standard: 2000000 }
];

export const DirectTaxesSection: React.FC<DirectTaxesSectionProps> = ({ 
  obligationStatuses,
  handleStatusChange 
}) => {
  const [openedDetails, setOpenedDetails] = useState<Record<string, boolean>>({});

  // Get IGS data from obligation statuses
  const igsObligation = obligationStatuses.igs as TaxObligationStatus;
  const caValue = (igsObligation?.caValue || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const isCGA = igsObligation?.isCGA || false;
  
  const quarterlyPayments = {
    q1: (igsObligation?.q1Montant || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    q2: (igsObligation?.q2Montant || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    q3: (igsObligation?.q3Montant || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    q4: (igsObligation?.q4Montant || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  };

  const quarterlyDates = {
    q1: igsObligation?.q1Date || '',
    q2: igsObligation?.q2Date || '',
    q3: igsObligation?.q3Date || '',
    q4: igsObligation?.q4Date || ''
  };
  
  // Format a number with spaces as thousand separators
  const formatNumberWithSpaces = (value: string): string => {
    value = value.replace(/\s/g, '').replace(/[^\d-]/g, '');
    if (!value) return '';
    
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  
  // Parse a formatted number to an integer
  const parseFormattedNumber = (value: string): number => {
    return parseInt(value.replace(/\s/g, ''), 10) || 0;
  };

  // Calculate IGS based on revenue and CGA status
  const calculateIGS = (ca: number, isCGA: boolean) => {
    if (ca >= 50000000) {
      return { class: 'Hors barème', amount: 0, outOfRange: true };
    }
    
    for (let bracket of igsBareme) {
      if (ca >= bracket.min && ca <= bracket.max) {
        let amount = bracket.standard;
        if (isCGA) amount = Math.round(amount / 2);
        return { class: bracket.class, amount, outOfRange: false };
      }
    }
    
    return { class: '-', amount: 0, outOfRange: false };
  };

  // Calculate IGS calculation based on current values
  const ca = parseFormattedNumber(caValue);
  const igsCalculation = ca > 0 ? calculateIGS(ca, isCGA) : null;

  // Calculate total IGS paid from quarterly payments
  const calculateTotalIgsPaid = (): number => {
    return Object.values(quarterlyPayments).reduce((sum, payment) => {
      return sum + parseFormattedNumber(payment);
    }, 0);
  };

  // Calculate IGS balance to pay
  const calculateIgsBalance = (): number => {
    if (!igsCalculation || igsCalculation.outOfRange) return 0;
    const totalPaid = calculateTotalIgsPaid();
    return Math.max(0, igsCalculation.amount - totalPaid);
  };

  // Toggle details visibility
  const toggleDetails = (taxType: string) => {
    setOpenedDetails(prev => ({
      ...prev,
      [taxType]: !prev[taxType]
    }));
  };

  // Handle CA change
  const handleCAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatNumberWithSpaces(rawValue);
    const numericValue = parseFormattedNumber(formattedValue);
    handleStatusChange('igs', 'caValue', numericValue);
  };

  // Handle CGA change
  const handleCGAChange = (checked: boolean) => {
    handleStatusChange('igs', 'isCGA', checked);
  };

  // Handle quarterly payment change
  const handleQuarterlyPaymentChange = (quarter: string, value: string) => {
    const formattedValue = formatNumberWithSpaces(value);
    const numericValue = parseFormattedNumber(formattedValue);
    handleStatusChange('igs', `${quarter}Montant`, numericValue);
  };

  // Handle quarterly date change
  const handleQuarterlyDateChange = (quarter: string, value: string) => {
    handleStatusChange('igs', `${quarter}Date`, value);
  };

  // Type guard to check if obligation is a tax obligation
  const isTaxObligation = (obligation: any): obligation is TaxObligationStatus => {
    return 'payee' in obligation;
  };

  // Render tax obligation item
  const renderTaxItem = (key: ObligationType, name: string) => {
    const obligation = obligationStatuses[key];
    if (!isTaxObligation(obligation)) return null;
    
    return (
      <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <span className="font-medium text-gray-800">{name}</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-assujetti`}
                checked={obligation.assujetti}
                onCheckedChange={(checked) => handleStatusChange(key, 'assujetti', checked)}
              />
              <Label htmlFor={`${key}-assujetti`}>
                {obligation.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-paye`}
                checked={obligation.payee}
                onCheckedChange={(checked) => handleStatusChange(key, 'payee', checked)}
                disabled={!obligation.assujetti}
              />
              <Label htmlFor={`${key}-paye`}>
                {obligation.payee ? "Payé" : "Non payé"}
              </Label>
            </div>
            
            {obligation.assujetti && !obligation.payee && !openedDetails[key] && (
              <button 
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => toggleDetails(key)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Voir détails
              </button>
            )}
          </div>
        </div>
        
        {(obligation.payee || openedDetails[key]) && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
            <div className="flex justify-between mb-4">
              <h4 className="font-medium text-sm">Détails du paiement</h4>
              {openedDetails[key] && (
                <button 
                  onClick={() => toggleDetails(key)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* IGS specific content */}
            {key === 'igs' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Chiffre d'affaires annuel HT (FCFA)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:border-primary focus:outline-none"
                    value={caValue}
                    onChange={handleCAChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="cga-toggle"
                    checked={isCGA}
                    onCheckedChange={handleCGAChange}
                  />
                  <Label htmlFor="cga-toggle" className="flex items-center">
                    Membre d'un Centre de Gestion Agréé (CGA) 
                    <span className="ml-1 text-primary font-medium">(-50%)</span>
                  </Label>
                </div>
                
                {igsCalculation && (
                  <div className="bg-gray-100 border-l-4 border-primary rounded p-3 mb-4 flex items-center min-h-10">
                    <div className="flex flex-col md:flex-row md:gap-8 items-start md:items-center">
                      <span className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-800 font-medium">
                        Classe : {igsCalculation.class}
                      </span>
                      <span className={`mt-2 md:mt-0 px-4 py-1 rounded font-bold text-white ${igsCalculation.outOfRange ? 'bg-red-500' : 'bg-primary'}`}>
                        {igsCalculation.outOfRange 
                          ? 'Montant : régime du réel'
                          : `Montant : ${igsCalculation.amount.toLocaleString('fr-FR')} FCFA`
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* IGS Payment Summary */}
                {igsCalculation && !igsCalculation.outOfRange && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">IGS payé :</span>
                        <span className="text-sm font-bold text-blue-900">
                          {calculateTotalIgsPaid().toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Solde IGS à payer :</span>
                        <span className="text-sm font-bold text-blue-900">
                          {calculateIgsBalance().toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 border-l-4 border-primary rounded p-2 text-sm inline-block mb-4">
                  <strong className="text-primary mr-2">Échéances :</strong>
                  <span>15 janvier, 15 avril, 15 juillet, 15 octobre</span>
                </div>
                
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 bg-gray-100 p-2 text-center">Échéance</th>
                        <th className="border border-gray-200 bg-gray-100 p-2 text-center">Date de paiement</th>
                        <th className="border border-gray-200 bg-gray-100 p-2 text-center">Montant payé (FCFA)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: '15 janvier', quarter: 'q1' },
                        { label: '15 avril', quarter: 'q2' },
                        { label: '15 juillet', quarter: 'q3' },
                        { label: '15 octobre', quarter: 'q4' }
                      ].map((echeance, index) => (
                        <tr key={`echeance-${index}`}>
                          <td className="border border-gray-200 p-2 text-center">{echeance.label}</td>
                          <td className="border border-gray-200 p-2">
                            <input 
                              type="date" 
                              className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50"
                              value={quarterlyDates[echeance.quarter as keyof typeof quarterlyDates]}
                              onChange={(e) => handleQuarterlyDateChange(echeance.quarter, e.target.value)}
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <input 
                              type="text" 
                              className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50"
                              placeholder="0"
                              value={quarterlyPayments[echeance.quarter as keyof typeof quarterlyPayments]}
                              onChange={(e) => handleQuarterlyPaymentChange(echeance.quarter, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* General payment details - NOT for IGS */}
            {key !== 'igs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-2">Date de paiement</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Montant payé</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    placeholder="0"
                    defaultValue={key === 'patente' ? "75 000" : ""}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderTaxItem('igs', 'Impôt Général Synthétique (IGS)')}
        {renderTaxItem('patente', 'Patente')}
        {renderTaxItem('bailCommercial', 'Bail Commercial')}
        {renderTaxItem('tpf', 'Taxe sur la propriété (TPF)')}
      </CardContent>
    </Card>
  );
};
