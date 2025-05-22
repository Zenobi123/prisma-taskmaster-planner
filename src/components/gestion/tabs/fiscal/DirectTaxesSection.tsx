
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { AttachmentUploader } from './AttachmentUploader';
import { AttachmentType } from '@/services/fiscalAttachmentService';
import { toast } from 'sonner';

interface DirectTaxesSectionProps {
  obligationStatuses: {
    igs: { assujetti: boolean; payee: boolean };
    patente: { assujetti: boolean; payee: boolean };
    bailCommercial: { assujetti: boolean; payee: boolean };
    precompteLoyer: { assujetti: boolean; payee: boolean };
    tpf: { assujetti: boolean; payee: boolean };
  };
  handleStatusChange: (taxType: string, field: string, value: boolean) => void;
  clientId: string;
  fiscalYear: string;
}

interface TaxItemState {
  openedDetails: Record<string, boolean>;
  attachments: Record<string, Record<string, string>>;
}

export const DirectTaxesSection: React.FC<DirectTaxesSectionProps> = ({ 
  obligationStatuses, 
  handleStatusChange,
  clientId,
  fiscalYear
}) => {
  const [state, setState] = React.useState<TaxItemState>({
    openedDetails: {},
    attachments: {
      igs: {},
      patente: {},
      bailCommercial: {},
      precompteLoyer: {},
      tpf: {}
    }
  });
  
  // Gère l'ouverture/fermeture du panneau de détails
  const toggleDetails = (taxType: string) => {
    setState(prevState => ({
      ...prevState,
      openedDetails: {
        ...prevState.openedDetails,
        [taxType]: !prevState.openedDetails[taxType]
      }
    }));
  };

  // Gère le téléchargement des fichiers
  const handleFileUploaded = (taxType: string, attachmentType: AttachmentType, filePath: string | null) => {
    setState(prevState => {
      const newAttachments = { ...prevState.attachments };
      
      if (!newAttachments[taxType]) {
        newAttachments[taxType] = {};
      }
      
      if (filePath) {
        newAttachments[taxType][attachmentType] = filePath;
      } else {
        delete newAttachments[taxType][attachmentType];
      }
      
      return {
        ...prevState,
        attachments: newAttachments
      };
    });
    
    // Afficher un message de confirmation
    if (filePath) {
      toast.success(`Le document a été téléchargé avec succès`);
    } else {
      toast.success(`Le document a été supprimé`);
    }
  };

  // Conversion des clés d'impôts pour l'interface utilisateur
  const getTaxDisplayName = (key: string): string => {
    switch (key) {
      case 'igs':
        return 'Impôt Général Synthétique (IGS)';
      case 'patente':
        return 'Patente';
      case 'bailCommercial':
        return 'Bail Commercial';
      case 'precompteLoyer':
        return 'Précompte sur Loyer';
      case 'tpf':
        return 'Taxe sur la propriété (TPF)';
      default:
        return key;
    }
  };

  // Conversion des clés d'impôts pour les attributs data-*
  const getDataAttributeKey = (key: string): string => {
    switch (key) {
      case 'bailCommercial':
        return 'bail-commercial';
      case 'precompteLoyer':
        return 'precompte-loyer';
      default:
        return key;
    }
  };

  const renderTaxItem = (key: keyof typeof obligationStatuses) => {
    const tax = obligationStatuses[key];
    const dataKey = getDataAttributeKey(key);
    const displayName = getTaxDisplayName(key);
    const isDetailsOpen = state.openedDetails[key];

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <span className="font-medium text-gray-800">{displayName}</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-assujetti`}
                checked={tax.assujetti}
                onCheckedChange={(checked) => handleStatusChange(key, 'assujetti', checked)}
              />
              <Label htmlFor={`${key}-assujetti`}>
                {tax.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-payee`}
                checked={tax.payee}
                onCheckedChange={(checked) => handleStatusChange(key, 'payee', checked)}
                disabled={!tax.assujetti}
              />
              <Label htmlFor={`${key}-payee`}>
                {tax.payee ? "Payé" : "Non payé"}
              </Label>
            </div>
            
            {tax.assujetti && tax.payee && !isDetailsOpen && (
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
        
        {tax.assujetti && tax.payee && isDetailsOpen && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
            <div className="flex justify-between mb-4">
              <h4 className="font-medium text-sm">Détails du paiement</h4>
              <button 
                onClick={() => toggleDetails(key)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
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
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
            {key === 'igs' && (
              <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                <h5 className="font-medium text-sm mb-3">Suivi des échéances trimestrielles</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                    <div key={quarter} className="flex items-center space-x-2">
                      <Switch 
                        id={`${key}-${quarter}`}
                        checked={false}
                        onCheckedChange={() => {}}
                      />
                      <Label htmlFor={`${key}-${quarter}`}>
                        {`${quarter} payé`}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Pièces justificatives</h4>
              
              <div className="space-y-4">
                <AttachmentUploader
                  clientId={clientId}
                  year={fiscalYear}
                  obligationType={key}
                  attachmentType="declaration"
                  attachmentLabel="Déclaration ou Avis d'imposition (PDF)"
                  filePath={state.attachments[key]?.declaration}
                  onFileUploaded={(filePath) => handleFileUploaded(key, 'declaration', filePath)}
                />
                
                <AttachmentUploader
                  clientId={clientId}
                  year={fiscalYear}
                  obligationType={key}
                  attachmentType="receipt"
                  attachmentLabel="Reçu de paiement (PDF)"
                  filePath={state.attachments[key]?.receipt}
                  onFileUploaded={(filePath) => handleFileUploaded(key, 'receipt', filePath)}
                />
                
                <AttachmentUploader
                  clientId={clientId}
                  year={fiscalYear}
                  obligationType={key}
                  attachmentType="payment"
                  attachmentLabel="Quittance de paiement (PDF)"
                  filePath={state.attachments[key]?.payment}
                  onFileUploaded={(filePath) => handleFileUploaded(key, 'payment', filePath)}
                />
              </div>
            </div>
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
        {renderTaxItem('igs')}
        {renderTaxItem('patente')}
        {renderTaxItem('bailCommercial')}
        {renderTaxItem('precompteLoyer')}
        {renderTaxItem('tpf')}
      </CardContent>
    </Card>
  );
};
