
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

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
  const [caValue, setCAValue] = useState<string>('');
  const [isCGA, setIsCGA] = useState<boolean>(false);
  const [igsCalculation, setIgsCalculation] = useState<{ class: string | number; amount: number; outOfRange: boolean } | null>(null);
  
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

  // Update IGS calculation when revenue or CGA status changes
  useEffect(() => {
    const ca = parseFormattedNumber(caValue);
    if (ca > 0) {
      const result = calculateIGS(ca, isCGA);
      setIgsCalculation(result);
    } else {
      setIgsCalculation(null);
    }
  }, [caValue, isCGA]);

  // Toggle details visibility
  const toggleDetails = (taxType: string) => {
    setOpenedDetails(prev => ({
      ...prev,
      [taxType]: !prev[taxType]
    }));
  };

  // Handles change in CA input
  const handleCAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatNumberWithSpaces(rawValue);
    setCAValue(formattedValue);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* IGS - Impôt Général Synthétique */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <span className="font-medium text-gray-800">Impôt Général Synthétique (IGS)</span>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="igs-assujetti"
                  checked={obligationStatuses.igs.assujetti}
                  onCheckedChange={(checked) => handleStatusChange("igs", 'assujetti', checked)}
                />
                <Label htmlFor="igs-assujetti">
                  {obligationStatuses.igs.assujetti ? "Assujetti" : "Non assujetti"}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="igs-paye"
                  checked={obligationStatuses.igs.payee}
                  onCheckedChange={(checked) => handleStatusChange("igs", 'payee', checked)}
                  disabled={!obligationStatuses.igs.assujetti}
                />
                <Label htmlFor="igs-paye">
                  {obligationStatuses.igs.payee ? "Payé" : "Non payé"}
                </Label>
              </div>
              
              {obligationStatuses.igs.assujetti && !obligationStatuses.igs.payee && !openedDetails.igs && (
                <button 
                  className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => toggleDetails('igs')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Voir détails
                </button>
              )}
            </div>
          </div>
          
          {(obligationStatuses.igs.payee || openedDetails.igs) && (
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <div className="flex justify-between mb-4">
                <h4 className="font-medium text-sm">Détails du paiement</h4>
                {openedDetails.igs && (
                  <button 
                    onClick={() => toggleDetails('igs')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* IGS Calculator */}
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
                  onCheckedChange={setIsCGA}
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

              {/* IGS Schedule */}
              <div className="bg-gray-100 border-l-4 border-primary rounded p-2 text-sm inline-block mb-4">
                <strong className="text-primary mr-2">Échéances :</strong>
                <span>15 janvier, 15 avril, 15 juillet, 15 octobre</span>
              </div>
              
              {/* IGS Tracking Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 bg-gray-100 p-2 text-center">Échéance</th>
                      <th className="border border-gray-200 bg-gray-100 p-2 text-center">Date de paiement</th>
                      <th className="border border-gray-200 bg-gray-100 p-2 text-center">Montant payé (FCFA)</th>
                      <th className="border border-gray-200 bg-gray-100 p-2 text-center">Pièces justificatives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['15 janvier', '15 avril', '15 juillet', '15 octobre'].map((echeance, index) => (
                      <tr key={`echeance-${index}`}>
                        <td className="border border-gray-200 p-2 text-center">{echeance}</td>
                        <td className="border border-gray-200 p-2">
                          <input 
                            type="date" 
                            className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50"
                          />
                        </td>
                        <td className="border border-gray-200 p-2">
                          <input 
                            type="text" 
                            className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50"
                            placeholder="0"
                          />
                        </td>
                        <td className="border border-gray-200 p-2">
                          <input 
                            type="file" 
                            className="w-[95%] text-xs"
                            accept=".pdf,image/*"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-2">Date de paiement</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    defaultValue="2025-05-01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Montant payé</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    placeholder="0"
                    value={igsCalculation?.amount ? igsCalculation.amount.toLocaleString('fr-FR') : ''}
                    readOnly
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Pièces justificatives</h4>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Déclaration ou Avis d'imposition (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Reçu de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Quittance de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Patente */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <span className="font-medium text-gray-800">Patente</span>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="patente-assujetti"
                  checked={obligationStatuses.patente.assujetti}
                  onCheckedChange={(checked) => handleStatusChange("patente", 'assujetti', checked)}
                />
                <Label htmlFor="patente-assujetti">
                  {obligationStatuses.patente.assujetti ? "Assujetti" : "Non assujetti"}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="patente-paye"
                  checked={obligationStatuses.patente.payee}
                  onCheckedChange={(checked) => handleStatusChange("patente", 'payee', checked)}
                  disabled={!obligationStatuses.patente.assujetti}
                />
                <Label htmlFor="patente-paye">
                  {obligationStatuses.patente.payee ? "Payé" : "Non payé"}
                </Label>
              </div>
              
              {obligationStatuses.patente.assujetti && !obligationStatuses.patente.payee && !openedDetails.patente && (
                <button 
                  className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => toggleDetails('patente')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Voir détails
                </button>
              )}
            </div>
          </div>
          
          {(obligationStatuses.patente.payee || openedDetails.patente) && (
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <div className="flex justify-between mb-4">
                <h4 className="font-medium text-sm">Détails du paiement</h4>
                {openedDetails.patente && (
                  <button 
                    onClick={() => toggleDetails('patente')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Payment details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-2">Date de paiement</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    defaultValue="2025-05-01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Montant payé</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    placeholder="0"
                    defaultValue="75 000"
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Pièces justificatives</h4>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Déclaration ou Avis d'imposition (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Reçu de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Quittance de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bail Commercial */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <span className="font-medium text-gray-800">Bail Commercial</span>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="bail-commercial-assujetti"
                  checked={obligationStatuses.bailCommercial.assujetti}
                  onCheckedChange={(checked) => handleStatusChange("bailCommercial", 'assujetti', checked)}
                />
                <Label htmlFor="bail-commercial-assujetti">
                  {obligationStatuses.bailCommercial.assujetti ? "Assujetti" : "Non assujetti"}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="bail-commercial-paye"
                  checked={obligationStatuses.bailCommercial.payee}
                  onCheckedChange={(checked) => handleStatusChange("bailCommercial", 'payee', checked)}
                  disabled={!obligationStatuses.bailCommercial.assujetti}
                />
                <Label htmlFor="bail-commercial-paye">
                  {obligationStatuses.bailCommercial.payee ? "Payé" : "Non payé"}
                </Label>
              </div>
              
              {obligationStatuses.bailCommercial.assujetti && !obligationStatuses.bailCommercial.payee && !openedDetails.bailCommercial && (
                <button 
                  className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => toggleDetails('bailCommercial')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Voir détails
                </button>
              )}
            </div>
          </div>
          
          {(obligationStatuses.bailCommercial.payee || openedDetails.bailCommercial) && (
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <div className="flex justify-between mb-4">
                <h4 className="font-medium text-sm">Détails du paiement</h4>
                {openedDetails.bailCommercial && (
                  <button 
                    onClick={() => toggleDetails('bailCommercial')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Payment details */}
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
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Pièces justificatives</h4>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Déclaration ou Avis d'imposition (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Reçu de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Quittance de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Taxe sur la propriété (TPF) */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <span className="font-medium text-gray-800">Taxe sur la propriété (TPF)</span>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="tpf-assujetti"
                  checked={obligationStatuses.tpf.assujetti}
                  onCheckedChange={(checked) => handleStatusChange("tpf", 'assujetti', checked)}
                />
                <Label htmlFor="tpf-assujetti">
                  {obligationStatuses.tpf.assujetti ? "Assujetti" : "Non assujetti"}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="tpf-paye"
                  checked={obligationStatuses.tpf.payee}
                  onCheckedChange={(checked) => handleStatusChange("tpf", 'payee', checked)}
                  disabled={!obligationStatuses.tpf.assujetti}
                />
                <Label htmlFor="tpf-paye">
                  {obligationStatuses.tpf.payee ? "Payé" : "Non payé"}
                </Label>
              </div>
              
              {obligationStatuses.tpf.assujetti && !obligationStatuses.tpf.payee && !openedDetails.tpf && (
                <button 
                  className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => toggleDetails('tpf')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Voir détails
                </button>
              )}
            </div>
          </div>
          
          {(obligationStatuses.tpf.payee || openedDetails.tpf) && (
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <div className="flex justify-between mb-4">
                <h4 className="font-medium text-sm">Détails du paiement</h4>
                {openedDetails.tpf && (
                  <button 
                    onClick={() => toggleDetails('tpf')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Payment details */}
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
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Pièces justificatives</h4>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Déclaration ou Avis d'imposition (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Reçu de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
                
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Quittance de paiement (PDF ou Photo)</label>
                  <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
