
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ObligationStatuses } from '@/hooks/fiscal/types';
import UnifiedAttachmentSection from './components/UnifiedAttachmentSection';

interface DeclarationProps {
  fiscalYear: string;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: () => void;
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (taxType: string, field: string, value: boolean | string | number) => void;
  handleAttachmentUpdate: (obligation: string, attachmentType: string, filePath: string | null) => void;
  clientId: string;
}

interface DeclarationState {
  activeTab: 'annuelles' | 'mensuelles';
  openedDetails: Record<string, boolean>;
}

export const DeclarationsSection: React.FC<DeclarationProps> = ({ 
  fiscalYear, 
  hasUnsavedChanges, 
  setHasUnsavedChanges,
  obligationStatuses,
  handleStatusChange,
  handleAttachmentUpdate,
  clientId
}) => {
  const [state, setState] = useState<DeclarationState>({
    activeTab: 'annuelles',
    openedDetails: {}
  });

  // Calculate date limite based on regime fiscal
  const calculateDateLimite = (regime: string, year: string) => {
    if (regime === 'igs') {
      // IGS: 15 Mai de l'exercice fiscal en cours
      return `${year}-05-15`;
    } else if (regime === 'reel') {
      // Régime du Réel: 15 Avril de l'exercice en cours
      return `${year}-04-15`;
    }
    return '';
  };

  // Handle assujetti toggle
  const handleAssujettiChange = (declaration: string, checked: boolean) => {
    handleStatusChange(declaration, 'assujetti', checked);
    if (!checked) {
      handleStatusChange(declaration, 'depose', false);
    }
  };

  // Handle depose toggle
  const handleDeposeChange = (declaration: string, checked: boolean) => {
    handleStatusChange(declaration, 'depose', checked);
    if (checked) {
      setState(prev => ({
        ...prev,
        openedDetails: { ...prev.openedDetails, [declaration]: true }
      }));
    }
  };

  // Toggle details visibility
  const toggleDetails = (declaration: string) => {
    setState(prev => ({
      ...prev,
      openedDetails: {
        ...prev.openedDetails,
        [declaration]: !prev.openedDetails[declaration]
      }
    }));
  };

  // Handle regime change
  const handleRegimeChange = (declaration: string, regime: string) => {
    handleStatusChange(declaration, 'regime', regime);
    
    // Update date limite based on new regime
    if (declaration === 'dsf') {
      const dateLimite = calculateDateLimite(regime, fiscalYear);
      handleStatusChange(declaration, 'dateLimite', dateLimite);
    }
  };

  // Handle tab change
  const handleTabChange = (value: 'annuelles' | 'mensuelles') => {
    setState(prev => ({ ...prev, activeTab: value }));
  };

  const renderDeclarationItem = (key: keyof ObligationStatuses, name: string) => {
    const obligation = obligationStatuses[key];
    if (!('depose' in obligation)) return null; // Skip if not a declaration obligation
    
    return (
      <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <span className="font-medium text-gray-800">{name}</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-assujetti`}
                checked={obligation.assujetti}
                onCheckedChange={(checked) => handleAssujettiChange(key, checked)}
              />
              <Label htmlFor={`${key}-assujetti`}>
                {obligation.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-depose`}
                checked={obligation.depose}
                onCheckedChange={(checked) => handleDeposeChange(key, checked)}
                disabled={!obligation.assujetti}
              />
              <Label htmlFor={`${key}-depose`}>
                {obligation.depose ? "Déposé" : "Non déposé"}
              </Label>
            </div>
            
            {obligation.assujetti && obligation.depose && !state.openedDetails[key] && (
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
        
        {obligation.assujetti && obligation.depose && state.openedDetails[key] && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
            <div className="flex justify-between mb-4">
              <h4 className="font-medium text-sm">Détails de la déclaration</h4>
              <button 
                onClick={() => toggleDetails(key)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {key === 'dsf' && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Régime fiscal</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={obligation.regime || ''}
                  onChange={(e) => handleRegimeChange(key, e.target.value)}
                >
                  <option value="">Sélectionner un régime</option>
                  <option value="igs">Impôt Général Synthétique (IGS)</option>
                  <option value="reel">Régime du Réel</option>
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">Date limite de dépôt</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={obligation.dateEcheance || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Date de soumission</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={obligation.dateDepot || ''}
                  onChange={(e) => handleStatusChange(key, 'dateDepot', e.target.value)}
                />
              </div>
            </div>
            
            {/* Unified Attachments */}
            <UnifiedAttachmentSection
              obligationName={key}
              clientId={clientId}
              selectedYear={fiscalYear}
              existingAttachments={obligation.attachements}
              onAttachmentUpload={(obligation, attachmentType, filePath) => {
                handleAttachmentUpdate(obligation, attachmentType, filePath);
              }}
              onAttachmentDelete={(obligation, attachmentType) => {
                handleAttachmentUpdate(obligation, attachmentType, null);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Déclarations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={state.activeTab} onValueChange={(v) => handleTabChange(v as 'annuelles' | 'mensuelles')}>
          <TabsList className="mb-4">
            <TabsTrigger value="annuelles">Annuelles</TabsTrigger>
            <TabsTrigger value="mensuelles">Mensuelles</TabsTrigger>
          </TabsList>
          
          {state.activeTab === 'annuelles' && (
            <>
              {renderDeclarationItem('dsf', 'Déclaration Statistique et Fiscale (DSF)')}
              {renderDeclarationItem('darp', 'Déclaration Annuelle des Revenus des Particuliers (DARP)')}
            </>
          )}
          
          {state.activeTab === 'mensuelles' && (
            <>
              {renderDeclarationItem('cntps', 'CNTPS')}
              {renderDeclarationItem('precomptes', 'Précomptes')}
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
