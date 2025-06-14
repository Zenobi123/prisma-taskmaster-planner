import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { ObligationStatuses, ObligationType, TaxObligationStatus, IgsObligationStatus } from '@/hooks/fiscal/types';

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

  // Get IGS status with type safety
  const igsStatus = obligationStatuses.igs as IgsObligationStatus; // Cast for full IGS properties
  const caValue = igsStatus?.caValue || '';
  const isCGA = igsStatus?.isCGA || false;
  const montantAnnuel = igsStatus?.montantAnnuel || 0;

  // Local state for quarterly payments (for input field formatting)
  const [quarterlyPayments, setQuarterlyPayments] = useState<Record<string, string>>({
    q1: '', q2: '', q3: '', q4: ''
  });

  // Local state for quarterly dates
  const [quarterlyDates, setQuarterlyDates] = useState<Record<string, string>>({
    q1: '', q2: '', q3: '', q4: ''
  });

  // Format a number with spaces as thousand separators
  function formatNumberWithSpaces(value: string): string {
    if (!value) return '';
    const numStr = String(value).replace(/\s/g, '').replace(/[^\d]/g, ''); // Allow only digits
    if (!numStr) return '';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  
  // Parse a formatted number to an integer
  const parseFormattedNumber = (value: string): number => {
    if (!value) return 0;
    return parseInt(String(value).replace(/\s/g, ''), 10) || 0;
  };

  // Sync local state from igsStatus (global state)
  useEffect(() => {
    if (igsStatus) {
      setQuarterlyPayments({
        q1: formatNumberWithSpaces(String(igsStatus.q1Montant || 0)),
        q2: formatNumberWithSpaces(String(igsStatus.q2Montant || 0)),
        q3: formatNumberWithSpaces(String(igsStatus.q3Montant || 0)),
        q4: formatNumberWithSpaces(String(igsStatus.q4Montant || 0))
      });
      setQuarterlyDates({
        q1: igsStatus.q1Date || '',
        q2: igsStatus.q2Date || '',
        q3: igsStatus.q3Date || '',
        q4: igsStatus.q4Date || ''
      });
    }
  }, [
    igsStatus?.q1Montant, igsStatus?.q2Montant, igsStatus?.q3Montant, igsStatus?.q4Montant,
    igsStatus?.q1Date, igsStatus?.q2Date, igsStatus?.q3Date, igsStatus?.q4Date,
    // Add igsStatus itself as a dependency if the whole object might be replaced
    igsStatus 
  ]);

  // Calculate IGS based on revenue and CGA status
  const calculateIGS = useCallback((ca: number, cgaStatus: boolean) => {
    if (ca >= 50000000) {
      return { class: 'Hors barème', amount: 0, outOfRange: true };
    }
    for (let bracket of igsBareme) {
      if (ca >= bracket.min && ca <= bracket.max) {
        let amount = bracket.standard;
        if (cgaStatus) amount = Math.round(amount / 2);
        return { class: bracket.class, amount, outOfRange: false };
      }
    }
    return { class: '-', amount: 0, outOfRange: false };
  }, []);

  // Update IGS calculation when revenue or CGA status changes
  useEffect(() => {
    const caNum = parseFormattedNumber(caValue);
    // Also update if caValue is empty to reset montantAnnuel
    if (caNum > 0) {
      const result = calculateIGS(caNum, isCGA);
      handleStatusChange('igs', 'classe', result.class);
      handleStatusChange('igs', 'montantAnnuel', result.amount);
      handleStatusChange('igs', 'outOfRange', result.outOfRange);
    } else if (caValue === '' || caValue === '0') {
      handleStatusChange('igs', 'classe', '-');
      handleStatusChange('igs', 'montantAnnuel', 0);
      handleStatusChange('igs', 'outOfRange', false);
    }
  }, [caValue, isCGA, handleStatusChange, calculateIGS]);

  // Update global IGS status when local quarterly payments/dates change
  // And calculate/update total paid and remaining balance in global state
  useEffect(() => {
    const q1Amount = parseFormattedNumber(quarterlyPayments.q1);
    const q2Amount = parseFormattedNumber(quarterlyPayments.q2);
    const q3Amount = parseFormattedNumber(quarterlyPayments.q3);
    const q4Amount = parseFormattedNumber(quarterlyPayments.q4);
    
    // Update individual quarterly amounts in global state
    if (igsStatus?.q1Montant !== q1Amount) handleStatusChange('igs', 'q1Montant', q1Amount);
    if (igsStatus?.q2Montant !== q2Amount) handleStatusChange('igs', 'q2Montant', q2Amount);
    if (igsStatus?.q3Montant !== q3Amount) handleStatusChange('igs', 'q3Montant', q3Amount);
    if (igsStatus?.q4Montant !== q4Amount) handleStatusChange('igs', 'q4Montant', q4Amount);
    
    const totalPaid = q1Amount + q2Amount + q3Amount + q4Amount;
    const currentMontantAnnuel = igsStatus?.montantAnnuel || 0; // Use montantAnnuel from global state
    const soldeRestant = Math.max(0, currentMontantAnnuel - totalPaid);
    
    // Update calculated totals in global state
    if (igsStatus?.montantTotalPaye !== totalPaid) handleStatusChange('igs', 'montantTotalPaye', totalPaid);
    if (igsStatus?.soldeRestant !== soldeRestant) handleStatusChange('igs', 'soldeRestant', soldeRestant);
    
  }, [quarterlyPayments, igsStatus?.montantAnnuel, handleStatusChange, igsStatus]); // Added igsStatus for other fields like qXMontant to compare

  useEffect(() => {
    if (igsStatus?.q1Date !== quarterlyDates.q1) handleStatusChange('igs', 'q1Date', quarterlyDates.q1);
    if (igsStatus?.q2Date !== quarterlyDates.q2) handleStatusChange('igs', 'q2Date', quarterlyDates.q2);
    if (igsStatus?.q3Date !== quarterlyDates.q3) handleStatusChange('igs', 'q3Date', quarterlyDates.q3);
    if (igsStatus?.q4Date !== quarterlyDates.q4) handleStatusChange('igs', 'q4Date', quarterlyDates.q4);
  }, [quarterlyDates, handleStatusChange, igsStatus]); // Added igsStatus for qXDate to compare

  // Toggle details visibility
  const toggleDetails = (taxType: string) => {
    setOpenedDetails(prev => ({ ...prev, [taxType]: !prev[taxType] }));
  };

  // Handles change in CA input
  const handleCAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Formatting is primarily for display; store raw or consistently parsed value if needed
    // For CA, storing the formatted string is current behavior.
    handleStatusChange('igs', 'caValue', formatNumberWithSpaces(rawValue));
  };

  // Handle quarterly payment change (updates local formatted state)
  const handleQuarterlyPaymentChange = (quarter: string, value: string) => {
    setQuarterlyPayments(prev => ({ ...prev, [quarter]: formatNumberWithSpaces(value) }));
  };

  // Handle quarterly date change (updates local state)
  const handleQuarterlyDateChange = (quarter: string, value: string) => {
    setQuarterlyDates(prev => ({ ...prev, [quarter]: value }));
  };

  const isTaxObligation = (obligation: any): obligation is TaxObligationStatus => {
    return obligation && 'payee' in obligation;
  };

  const renderTaxItem = (key: ObligationType, name: string) => {
    const obligation = obligationStatuses[key];
    if (!isTaxObligation(obligation)) return null;
    
    // For IGS summary display, use values from igsStatus (global state)
    // These are updated by the useEffect hooks.
    const igsTotalPaidForDisplay = igsStatus?.montantTotalPaye || 0;
    const igsBalanceForDisplay = igsStatus?.soldeRestant || 0;

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
              {openedDetails[key] && !obligation.payee && ( // Show X only if details opened by button and not yet paid
                <button 
                  onClick={() => toggleDetails(key)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
    
            {/* IGS specific content */}
            {key === 'igs' && igsStatus && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Chiffre d'affaires annuel HT (FCFA)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:border-primary focus:outline-none"
                    value={caValue} // Controlled by caValue from igsStatus
                    onChange={handleCAChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="cga-toggle"
                    checked={isCGA} // Controlled by isCGA from igsStatus
                    onCheckedChange={(checked) => handleStatusChange('igs', 'isCGA', checked)}
                  />
                  <Label htmlFor="cga-toggle" className="flex items-center">
                    Membre d'un Centre de Gestion Agréé (CGA) 
                    <span className="ml-1 text-primary font-medium">(-50%)</span>
                  </Label>
                </div>
                
                {montantAnnuel > 0 && (
                  <div className="bg-gray-100 border-l-4 border-primary rounded p-3 mb-4 flex items-center min-h-10">
                    <div className="flex flex-col md:flex-row md:gap-8 items-start md:items-center">
                      <span className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-800 font-medium">
                        Classe : {igsStatus?.classe || '-'}
                      </span>
                      <span className={`mt-2 md:mt-0 px-4 py-1 rounded font-bold text-white ${igsStatus?.outOfRange ? 'bg-red-500' : 'bg-primary'}`}>
                        {igsStatus?.outOfRange 
                          ? 'Montant : régime du réel'
                          : `Montant : ${montantAnnuel.toLocaleString('fr-FR')} FCFA`
                        }
                      </span>
                    </div>
                  </div>
                )}
    
                {/* IGS Payment Summary - using derived values from igsStatus */}
                {montantAnnuel > 0 && !igsStatus?.outOfRange && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">IGS payé :</span>
                        <span className="text-sm font-bold text-blue-900">
                          {(igsStatus?.montantTotalPaye || 0).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Solde IGS à payer :</span>
                        <span className="text-sm font-bold text-blue-900">
                          {(igsStatus?.soldeRestant || 0).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                )}
    
                <div className="bg-gray-100 border-l-4 border-primary rounded p-2 text-sm inline-block mb-4">
                  <strong className="text-primary mr-2">Échéances :</strong>
                  <span>15 janvier, 15 avril, 15 juillet, 15 octobre</span>
                </div>
                
                {/* Quarterly payments table */}
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
                              className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50 focus:border-primary focus:outline-none"
                              value={quarterlyDates[echeance.quarter]}
                              onChange={(e) => handleQuarterlyDateChange(echeance.quarter, e.target.value)}
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <input 
                              type="text" 
                              className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50 focus:border-primary focus:outline-none"
                              placeholder="0"
                              value={quarterlyPayments[echeance.quarter]}
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
                    value={obligation.datePaiement || ''}
                    onChange={(e) => handleStatusChange(key, 'datePaiement', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Montant payé</label>
                  <input
                    type="text" // Consider type="number" or ensure parsing
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    placeholder="0"
                    // Formatting and parsing logic should be robust here as well
                    value={formatNumberWithSpaces(String(obligation.montant || (key === 'patente' ? 75000 : 0)))}
                    onChange={(e) => handleStatusChange(key, 'montant', parseFormattedNumber(e.target.value))}
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
